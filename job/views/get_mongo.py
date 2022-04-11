from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from core.helpers import api_response
from bson.objectid import ObjectId
from rest_framework.response import Response
import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
# Database Name
db = client["dummydata"]


class MongoGetDataApi(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request):
        try:
            mongo_id = request.data.get("mongo_id")
            collection = request.data.get("collection")
            detail = db[collection].find_one({"_id": ObjectId(mongo_id)})
            sovren_resume_response = detail["data"]
            response = {"data": sovren_resume_response}
            return api_response(Response.status_code, "Data Found", response)
        except Exception as error:
            return api_response(Response.status_code, "No Mongo Data", {})
