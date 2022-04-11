# from rest_framework import generics
# from core.models.user_resumes import PersonalDetails, Education, Experience
# from core.serializers.userresume_serializer import (
#     EducationSerializer,
#     ExperienceSerializer,
#     PersonalDetailsSerializer,
# )


# class PersonalDetailsListView(generics.ListCreateAPIView):
#     queryset = PersonalDetails.objects.all()
#     serializer_class = PersonalDetailsSerializer


# class EducationListView(generics.ListCreateAPIView):
#     queryset = Education.objects.all()
#     serializer_class = EducationSerializer


# class ExperienceListView(generics.ListCreateAPIView):
#     queryset = Experience.objects.all()
#     serializer_class = ExperienceSerializer
