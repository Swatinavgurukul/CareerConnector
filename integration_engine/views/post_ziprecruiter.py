# from datetime import datetime, timedelta, timezone
# import hmac
# import hashlib
# import base64
# import json
# from re import A
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from core.helpers import api_response
# import pymongo
# import pytz
# from rest_framework.permissions import IsAuthenticated

# client = pymongo.MongoClient("mongodb://localhost:27017/")
# # Database Name
# db = client["dummydata"]
# # Collection Name
# col = db["ziprecruiter"]


# # today_datetime = datetime.now(timezone.utc)
# # local_dt = today_datetime.astimezone()
# # print(today_datetime)
# # print(local_dt)
# # print(today_datetime.tzinfo)
# # print(local_dt.tzinfo)
# # print(today_datetime.tzinfo.utcoffset(today_datetime))
# # print(local_dt.tzinfo.utcoffset(local_dt))
# # print(today_datetime.isoformat("T") + "Z")
# # print(local_dt.isoformat("T") + "Z")


# def get_time(dt):
#     # print(dt)
#     converttime = datetime.strptime(dt[:-1], "%Y-%m-%dT%H:%M:%S.%f")
#     # converttime = converttime.replace(tzinfo=timezone.utc)
#     # print(converttime)
#     # print(converttime.tzinfo)
#     # print(converttime.tzinfo)
#     # timez = pytz.utc
#     # t_aware = timez.localize(converttime)  # aware timezone
#     # print(t_aware)

#     # # timez1 = pytz.timezone("UTC")
#     # # print(timez1)
#     # print(timez)
#     # # converttime = converttime.replace(timezone.utc)
#     # converttime = t_aware.astimezone()  # Return a datetime object with new tzinfo attribute tz
#     # print(converttime.tzinfo)  # Indian Standard time
#     return converttime


# class PostZipRecruiterAPI(APIView):
#     # p/ssion_classes = (IsAuthenticated,)

#     def post(self, request):
#         data = request.data
#         response = json.dumps(data)  # convert python objects to json string
#         # print(type(response))
#         # print(response)
#         # print(str(data))

#         # print(data)
#         # print(str(data) == data) #false

#         # print(json.loads(response))
#         # print(type(json.loads(response)))
#         # print(request.content_type)
#         # print(request.headers)
#         sent_signature = request.headers["X-ZipRecruiter-Signature"]
#         timestamp = request.headers["X-ZipRecruiter-Signature-Timestamp"]
#         # print(sent_signature)
#         # print(timestamp)

#         message = timestamp + "." + response
#         # print(message)

#         secret = "my secret"
#         signature = base64.b64encode(
#             hmac.new(bytes(secret, "ascii"), msg=bytes(message, "ascii"), digestmod=hashlib.sha256).digest()
#         ).decode()

#         sent_time = get_time(timestamp)
#         current_time = datetime.now()
#         print(current_time)
#         max_window = sent_time + timedelta(0, 360)
#         print(max_window)
#         print(current_time < max_window)
#         if signature == sent_signature and current_time < max_window:
#             response = json.dumps(data)
#             ziprecruiter = json.loads(response)
#             x = col.insert_one(ziprecruiter)
#             # print(x)
#             return api_response(Response.status_code, "Successfully", {})
#         else:
#             return api_response(Response.status_code, "Signature are not authorized", {})