"""Tests del builder de WHERE (filters()) — incluye el escape anti-inyección SQL.

Bloquean regresiones del fix de seguridad: valores normales deben producir el
mismo SQL de siempre, y los intentos de inyección deben quedar neutralizados.
Puro Python, sin BigQuery ni SQL Server (solo construye el string del WHERE).
"""
import os
# Para que 'from helpers.utils' importe sin exigir credenciales reales.
os.environ.setdefault("CLOUD_PROJECT", "test-project")

import unittest

from helpers.utils import filters, _esc


class TestFiltersNormal(unittest.TestCase):
    def test_vacio_da_1_igual_1(self):
        self.assertEqual(filters({})["filter_string"], "1=1")

    def test_valor_normal_sin_cambios(self):
        r = filters({"resultado_llamada": "Venta"})["filter_string"]
        self.assertEqual(r, "resultado_llamada = 'Venta'")

    def test_nombre_asesor_like(self):
        r = filters({"nombre_asesor": "Andres"})["filter_string"]
        self.assertEqual(r, "cuenta like '%Andres%'")

    def test_fecha_valida_se_incluye(self):
        r = filters({"fecha_desde": "2026-08-10"})["filter_string"]
        self.assertIn("TIMESTAMP('2026-08-10')", r)

    def test_varios_filtros_con_and(self):
        r = filters({"resultado_llamada": "Venta", "tipo_llamada": "servicio"})["filter_string"]
        self.assertIn(" AND ", r)


class TestFiltersInyeccion(unittest.TestCase):
    def test_comilla_queda_escapada(self):
        r = filters({"resultado_llamada": "x' OR '1'='1"})["filter_string"]
        self.assertIn("\\'", r)                 # la comilla se escapó
        self.assertNotIn("OR '1'='1'", r)       # no rompió el literal con comillas crudas

    def test_fecha_con_inyeccion_se_ignora(self):
        # No matchea YYYY-MM-DD -> se descarta, no llega al TIMESTAMP().
        r = filters({"fecha_desde": "2026-01-01') OR 1=1 --"})["filter_string"]
        self.assertEqual(r, "1=1")

    def test_apostrofe_legitimo_funciona(self):
        r = filters({"nombre_asesor": "O'Brien"})["filter_string"]
        self.assertEqual(r, "cuenta like '%O\\'Brien%'")


class TestEsc(unittest.TestCase):
    def test_comilla(self):
        self.assertEqual(_esc("a'b"), "a\\'b")

    def test_backslash(self):
        self.assertEqual(_esc("c\\d"), "c\\\\d")

    def test_valor_normal_transparente(self):
        self.assertEqual(_esc("normal"), "normal")


if __name__ == "__main__":
    unittest.main()
