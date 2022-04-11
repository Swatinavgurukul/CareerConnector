from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from directsourcing.settings import MEDIA_ROOT
import tempfile
import os
from django.core.files.uploadedfile import SimpleUploadedFile

file1 = "resume/102636455875_172_3_KarmenHarden_3KNR1ZG.pdf"
image_url = str(MEDIA_ROOT) + str(file1)


class TestSetUP(APITestCase):
    def setUp(self):
        file1 = SimpleUploadedFile("file.pdf", b"file_content", content_type="file/pdf")
        self.register_url = reverse("register_email")
        self.login_url = reverse("token_obtain")
        self.user_data = {
            "email": "testuser@simpliifyvms.com",
            "username": "testuser",
            "password": "TestPassword@123",
            "full_name": "Test user",
            "phone": 9898989812,
            "area_code": "us",
            "resume_file": file1,
        }
        return super().setUp()

    def tearDown(self):
        return super().tearDown()