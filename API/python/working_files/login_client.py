from __future__ import print_function
import grpc
import os

os.chdir("../..")
from python.generic.login.login import login_pb2
from python.generic.login.login import login_pb2_grpc
from dotenv import load_dotenv
from json import dumps

load_dotenv()


def login(request):
    print("Will try to call ...")
    with grpc.insecure_channel(os.getenv("LOGIN_IP") + ':80') as channel:
        stub = login_pb2_grpc.LoginCallStub(channel)
        # Sends in a login request with appropriate data
        try:
            response = stub.Login(
                login_pb2.LoginRequest(username=request['username'], password=request['password'], body=dumps(request)))
        except Exception as e:
            print(str(e))
            return str(e)
    return response
