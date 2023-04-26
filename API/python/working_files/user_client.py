from __future__ import print_function
import grpc
from python.user.user import user_pb2
from python.user.user import user_pb2_grpc
from dotenv import load_dotenv
import os
from python.class_service.decorators import database_connect

load_dotenv()

ip = os.getenv("USER_IP") + ":80"


@database_connect
def add_user(request, db):
    print("Will try to call ...")
    # We are going to grab all usernames in user table
    sql = "SELECT username FROM user"
    ids = []
    db.execute(sql)
    usernames = db.fetchall()
    # Now we'll loop through them and grab the 6 digits after their initials
    for i in usernames:
        ids.append(int(i["username"][2::]))
    # Now we'll generate a username for the new user based off of their initials, and the next sequential 6 digit number
    username = request["firstname"][0] + request["lastname"][0] + str(max(ids) + 1)
    with grpc.insecure_channel(ip) as channel:
        stub = user_pb2_grpc.UserCallStub(channel)
        # Send in request with appropriate data
        response = stub.AddUser(
            user_pb2.AddUserRequest(username=username, first_name=request["firstname"], last_name=request["lastname"],
                                    user_password=request["user_password"], email=request["email"],
                                    role_id=request["role"], grade=None if request["role"] != 0 else request["grade"]))
    return response


def remove_user(request):
    with grpc.insecure_channel(ip) as channel:
        stub = user_pb2_grpc.UserCallStub(channel)
        # Send remove user request
        response = stub.RemoveUser(user_pb2.RemoveUserRequest(user_id=request["user_id"]))
    return response


def get_all_classes_from_user(request):
    with grpc.insecure_channel(ip) as channel:
        stub = user_pb2_grpc.UserCallStub(channel)
        response = stub.GetAllClassesOfUser(user_pb2.GetAllClassesOfUserRequest(user_id=request["user_id"]))
    return response


def get_all_teachers():
    with grpc.insecure_channel(ip) as channel:
        stub = user_pb2_grpc.UserCallStub(channel)
        response = stub.GetAllTeachers(user_pb2.GetAllTeachersRequest())
    return response
