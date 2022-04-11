import os
import mongoengine
from pathlib import Path
from decouple import config
from datetime import timedelta


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")

environment = config("ENVIORNMENT")
SECRET_KEY = config("SECRET_KEY")
DEBUG = config("DEBUG", default=False, cast=bool)

ALLOWED_HOSTS = ["localhost", "127.0.0.1", ".simplifyhire.net", ".simplifyhire.com", ".simplifycareers.com"]


DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
]

CUSTOM_APPS = [
    "core",
    "job",
    "notification",
    "chatbot",
    "integration_engine",
    "resume",
    "recruiter",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework.authtoken",
    "allauth",
    "allauth.account",
    "timezone_field",
    "cloudinary",
    "cloudinary_storage",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.linkedin",
    "allauth.socialaccount.providers.linkedin_oauth2",
    "django_elasticsearch_dsl",
    "django_elasticsearch_dsl_drf",
    "oauth2_provider",
    "corsheaders",
]


INSTALLED_APPS = DJANGO_APPS + CUSTOM_APPS + THIRD_PARTY_APPS

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "oauth2_provider.middleware.OAuth2TokenMiddleware",
    # rollbar
    "rollbar.contrib.django.middleware.RollbarNotifierMiddleware",
    "corsheaders.middleware.CorsMiddleware",
]
CORS_ORIGIN_ALLOW_ALL = True

ROOT_URLCONF = "directsourcing.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [TEMPLATE_DIR],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
TEMPLATES[0]["OPTIONS"]["context_processors"].append("core.context_processors.css_processor")

WSGI_APPLICATION = "directsourcing.wsgi.application"


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": config("DB_ENGINE"),
        "NAME": config("DATABASE_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST"),
        "PORT": config("DB_PORT", cast=int),
        "OPTIONS": {
            "init_command": "SET foreign_key_checks = 0;",
        },
    },
    "mongodb": {
        "ENGINE": config("MONGODB_ENGINE"),
        "NAME": config("MONGODB_NAME"),
        "USER": config("MONGODB_USER"),
        "PASSWORD": config("MONGODB_PASSWORD"),
        "HOST": config("MONGODB_HOST"),
        "PORT": config("MONGODB_PORT", cast=int),
    },
}


mongoengine.connect(
    db=config("MONGODB_NAME"),
    host=config("MONGODB_HOST"),
    port=config("MONGODB_PORT", cast=int),
    username=config("MONGODB_USER"),
    password=config("MONGODB_PASSWORD"),
)

# Rest Framework Configuration
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        # "rest_framework.authentication.SessionAuthentication",
        "oauth2_provider.contrib.rest_framework.OAuth2Authentication",
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSIONS_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
        "rest_framework.permissions.IsAdminUser",
        "oauth2_provider.contrib.rest_framework.TokenHasReadWriteScope",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "EXCEPTION_HANDLER": "rollbar.contrib.django_rest_framework.post_exception_handler",
}

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    # All Auth
    "allauth.account.auth_backends.AuthenticationBackend",
]

AUTH_USER_MODEL = "core.User"

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Login via Username and Email
# ACCOUNT_AUTHENTICATION_METHOD = "username_email"

ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_SIGNUP_PASSWORD_VERIFICATION = False
# ACCOUNT_EMAIL_VERIFICATION = "optional"
PASSWORD_RESET_TIMEOUT = 7 * 24 * 3600

# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = "/static/"
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
SITE_ID = 1

# Provider specific settings
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]
LOGIN_URL = "/api/v1/accounts/login/"
LOGIN_REDIRECT_URL = "/"
# LOGOUT_REDIRECT_URL = "/"
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_LOGOUT_REDIRECT_URL = "/login/"
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media/")
# DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"


CLOUDINARY_STORAGE = {
    "CLOUD_NAME": config("CLOUDINARY_CLOUD_NAME"),
    "API_KEY": config("CLOUDINARY_API_KEY"),
    "API_SECRET": config("CLOUDINARY_API_SECRET"),
}

APPEND_SLASH = False

ROLLBAR = {
    "access_token": config("ROLLBAR_KEY"),
    "environment": "development" if DEBUG else "production",
    "branch": "master",
    "root": BASE_DIR,
    "enabled": not DEBUG,
}
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": config("GOOGLE_CLIENT_ID"),
            "secret": config("GOOGLE_CLIENT_SECRET"),
            "key": "",
        },
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
    },
}
# http://127.0.0.1:8000/linkedin_oauth2/login/callback/
SOCIALACCOUNT_PROVIDERS = {
    "linkedin_oauth2": {
        "APP": {
            "client_id": "78kvfdrrf0n50i",
            "secret": "Q9UuTQDS3U53BOam",
            "key": "",
        },
        "SCOPE": ["r_emailaddress", "r_liteprofile"],
        "PROFILE_FIELDS": [
            "id",
            "first-name",
            "last-name",
            "email-address",
            "picture-url",
            "public-profile-url",
        ],
    }
}

url = config("ELASTIC_ENDPOINT")
elastic_username = config("ELASTIC_USERNAME")
elastic_password = config("ELASTIC_PASSWORD")
elastic_index = config("ELASTIC_INDEX")


ELASTICSEARCH_DSL = {
    "default": {
        "index": elastic_index,
    }
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=1440),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUDIENCE": None,
    "ISSUER": None,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "JTI_CLAIM": "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=1440),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=7),
}


CELERY_BROKER_URL = "redis://127.0.0.1:6379"
CELERY_RESULT_BACKEND = "redis://127.0.0.1:6379"
CELERY_ACCEPT_CONTENT = ["application/json"]
CELERY_RESULT_SERIALIZER = "json"
CELERY_TASK_SERIALIZER = "json"
# C-+/ELERY_TASK_ALWAYS_EAGER = True
OAUTH2_PROVIDER = {
    # this is the list of available scopes
    "REFRESH_TOKEN_EXPIRE_SECONDS": 360000,
    "SCOPES": {"read": "Read scope", "write": "Write scope", "groups": "Access to your groups"},
    "ACCESS_TOKEN_EXPIRE_SECONDS": 360000,
}
