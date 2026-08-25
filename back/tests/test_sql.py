"""Tests de helpers/sql.py — la fuente ÚNICA de la partición Contacto Efectivo.

Bloquean que la partición diverja o pierda/gane categorías (fue el bug del
embudo). Puro Python, sin BigQuery ni SQL Server.
"""
import unittest

from helpers.sql import (
    TABLE, CONTACTADO, SIN_CONTACTO, sql_in, CONTACTADO_SQL, SIN_CONTACTO_SQL,
)


class TestParticion(unittest.TestCase):
    def test_particion_excluyente(self):
        # CONTACTADO y SIN_CONTACTO no pueden compartir ninguna categoría.
        self.assertEqual(set(CONTACTADO) & set(SIN_CONTACTO), set())

    def test_particion_cubre_las_categorias_conocidas(self):
        # Juntas cubren exactamente todos los valores de Resultado_Llamada.
        esperadas = {
            "Contactado", "Rechazado", "Venta",
            "No Disponible", "Buzón de Voz", "Número Equivocado",
            "Sin Contacto", "Sin Clasificar",
        }
        self.assertEqual(set(CONTACTADO) | set(SIN_CONTACTO), esperadas)

    def test_venta_cuenta_como_contacto(self):
        # Una venta implica que se habló con la persona -> va en CONTACTADO.
        self.assertIn("Venta", CONTACTADO)
        self.assertNotIn("Venta", SIN_CONTACTO)

    def test_buzon_es_sin_contacto(self):
        self.assertIn("Buzón de Voz", SIN_CONTACTO)


class TestSqlIn(unittest.TestCase):
    def test_formato(self):
        self.assertEqual(sql_in("col", ("a", "b")), "col IN ('a', 'b')")

    def test_contactado_sql_es_el_esperado(self):
        self.assertEqual(
            CONTACTADO_SQL,
            "Resultado_Llamada IN ('Contactado', 'Rechazado', 'Venta')",
        )

    def test_sin_contacto_sql_tiene_las_5(self):
        self.assertEqual(SIN_CONTACTO_SQL.count("'") // 2, 5)

    def test_table_con_backticks_y_nombre(self):
        self.assertTrue(TABLE.startswith("`") and TABLE.endswith("`"))
        self.assertIn("cltiene_llamadas_procesadas", TABLE)


if __name__ == "__main__":
    unittest.main()
