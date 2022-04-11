from rest_framework.response import Response
from django.shortcuts import render, redirect
from django.urls import reverse
from rest_framework.views import APIView
from django.contrib.auth.mixins import LoginRequiredMixin
from core.helpers import get_asset


def DesignGuide(request):
    context = {
        "styleCss": get_asset("style.css"),
    }
    return render(request, "design_guide/index.html", context)


# def home(request):
#     context = {
#         "styleCss": get_asset("style.css"),
#     }
#     return render(request, "public/index.html", context)

# def redirect_to_dashboard(request):
#     return redirect(reverse("dashboard"))


# class dashboard(LoginRequiredMixin, APIView):
#     login_url = "/login/"
#     redirect_field_name = "/login/"

#     def get(self, request):
#         context = {
#             "styleCss": get_asset("style.css"),
#             "userBundle": get_asset("user-bundle.js"),
#             "adminBundle": get_asset("admin-bundle.js"),
#         }
#         if request.user.is_superuser is True:
#             return render(request, "dashboard/admin.html", context)
#         else:
#             return render(request, "dashboard/user.html", context)
