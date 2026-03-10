from api.models import FilterModel
from helpers.utils import get_llamada_context


def test(filters: FilterModel):
    return {"result": get_llamada_context()}
