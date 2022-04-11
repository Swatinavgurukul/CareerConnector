from django.shortcuts import render
from core.helpers import get_asset
from rest_framework.decorators import api_view
from rest_framework.response import Response
from chatbot.views.bot import run_sample
from core.models.users import User


def ChatBot(request):
    context = {
        "styleCss": get_asset("style.css"),
    }
    return render(request, "chatbot/bot.html", context)


@api_view(["POST"])
def bot(request):
    if request.method == "POST":
        data = request.data
        # print(data)
        texts = data["texts"]
        res = run_sample([texts])

        return Response({"message": "DialogFlow", "data": res})


@api_view(["POST"])
def botcard(request):
    if request.method == "POST":
        user_obj = User.objects.get(id=request.user.id)
        name = user_obj.first_name + " " + user_obj.last_name
        # print(name)
        data = request.data
        # print(data)
        texts = data["texts"]
        res = run_sample([texts])
        # print(res)
        return Response({"message": "DialogFlow", "data": texts})