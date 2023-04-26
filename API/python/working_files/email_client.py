from __future__ import print_function
import grpc
from python.generic.email.email import email_pb2
from python.generic.email.email import email_pb2_grpc
from dotenv import load_dotenv
import os
import json

load_dotenv()

ip = os.getenv("EMAIL_IP") + ":80"


def email_user(request):
    with grpc.insecure_channel(ip) as channel:
        stub = email_pb2_grpc.EmailCallStub(channel)
        response = stub.EmailUser(
            email_pb2.EmailUserRequest(email_to=json.dumps(request["email_to"]), email_subject=request["email_subject"],
                                       email_body=request["email_body"], )
        )
    return response
