from __future__ import print_function
import grpc
from python.room.room import room_pb2
from python.room.room import room_pb2_grpc
from dotenv import load_dotenv
import os

load_dotenv()

ip = os.getenv("ROOM_IP") + ":80"


def add_room(request):
    with grpc.insecure_channel(ip) as channel:
        stub = room_pb2_grpc.RoomCallStub(channel)
        response = stub.AddRoom(
            room_pb2.AddRoomRequest(room_name=request["room_name"], room_length=request["room_length"], room_width=request["room_width"])
        )
    return response


def remove_room(request):
    with grpc.insecure_channel(ip) as channel:
        stub = room_pb2_grpc.RoomCallStub(channel)
        response = stub.RemoveRoom(
            room_pb2.RemoveRoomRequest(room_id=request["room_id"])
        )
    return response


def get_all_room_info(request):
    with grpc.insecure_channel(ip) as channel:
        stub = room_pb2_grpc.RoomCallStub(channel)
        response = stub.GetAllRoomInfo(
            room_pb2.GetAllRoomInfoRequest(room_id=request["room_id"])
        )
    return response
