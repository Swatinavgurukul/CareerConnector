from django.urls import path
from chatbot.views.chatbot import ChatBot, bot, botcard
from chatbot.views.chatbot_api import ChatbotEmail
# from chatbot.views.resume_parser import UploadResume
# from chatbot.views.chatbot_api import SetNewPasswordAPI

urlpatterns = [
    path("chatbot", ChatBot),
    path("chatbot1", bot),
    path("chatbot2", botcard),
    # path("registerchatbot", RegisterChatBotAPI.as_view(), name="register_chatbot"),
    #path("setchatbotpassword", SetNewPasswordAPI.as_view(), name="setpassword_chatbot"),
    path("checkemail", ChatbotEmail.as_view()),
    # path("chat_resume/<int:pk>", UploadResume.as_view()),
]
