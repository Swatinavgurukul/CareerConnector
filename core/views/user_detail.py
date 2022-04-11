from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from core.helpers import api_response
from core.models.users import User


class UserDetailAPI(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        data = {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "area code": user.area_code,
            "phone": user.phone,
        }
        # print(user)

        return api_response(200, "successfully", data)