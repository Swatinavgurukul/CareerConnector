import boto3
from botocore.exceptions import ClientError
import json
from aws_secretsmanager_caching import SecretCache, SecretCacheConfig
from decouple import config


def aws_secret(secret_name):

    secret_name = secret_name
    region_name = "us-east-2"
    session = boto3.session.Session(
        aws_access_key_id=config("AWS_PUBLIC_KEY"),
        aws_secret_access_key=config("AWS_SECRET_KEY"),
    )
    client = session.client(service_name="secretsmanager", region_name=region_name)

    try:
        # Create a cache
        cache = SecretCache(SecretCacheConfig(secret_refresh_interval=3600.0), client)
        # Get secret string from the cache
        get_secret_value_response = cache.get_secret_string(secret_name)

    except ClientError as e:
        if e.response["Error"]["Code"] == "DecryptionFailureException":
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "InternalServiceErrorException":
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "InvalidParameterException":
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "InvalidRequestException":
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "ResourceNotFoundException":
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
    else:
        secret = get_secret_value_response
        return json.loads(secret)


def get_secret(envrionment):
    return aws_secret(envrionment)


def google_secret():
    return aws_secret("google_service_account")