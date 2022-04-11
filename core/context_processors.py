from core.helpers import get_asset


def css_processor(request):
    styleCss = get_asset("style.css")
    return {"styleCss": styleCss}
