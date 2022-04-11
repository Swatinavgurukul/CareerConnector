from re import I
from rest_framework import serializers
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import IsAuthenticated
import json
from rest_framework.response import Response
from rest_framework.views import APIView
from core.helpers import api_response
from core.models.translation import Translation
from core.serializers.translation_serializer import TranslationSerializer


@api_view(("GET",))
@renderer_classes((JSONRenderer,))
def TranslationView(request, file):
    data = request.data
    # print(data)
    json_file = open("./assets/translations/" + file + ".json", encoding="utf-8")
    json_load = json.load(json_file)
    json_data = json.dumps(json_load)
    return api_response(Response.status_code, "Translation messages ", json_data)


class LanguageTranslationView(APIView):
    def get(self, request, lang=None):
        lang_obj = Translation.objects.filter(language=lang)
        if lang_obj:
            serializer = TranslationSerializer(lang_obj, many=True)
            dic2 = {}
            dic3 = {}
            for i in serializer.data:
                dic3[i["namespace"]] = i["text"]
                dic2["layout"] = dic3

            return api_response(200, "Translation Language retrieved successfully", dic2)
        else:
            return api_response(404, "Translation Language Doesn't Exists", {})

class LanguageTranslationCreateView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = TranslationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(201, "Translation created ", serializer.data)
        else:
            return api_response(400, "Invalid data", serializer.errors)
