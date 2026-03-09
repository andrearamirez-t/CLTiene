from api.models import FilterModel


def test(filters: FilterModel):
    return {"result": filters.get_query()}
