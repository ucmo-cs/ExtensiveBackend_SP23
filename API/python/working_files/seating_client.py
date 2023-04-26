from __future__ import print_function
import grpc
from python.seating.seating import seating_pb2
from python.seating.seating import seating_pb2_grpc
from dotenv import load_dotenv
import os
import json

load_dotenv()

ip = os.getenv("SEATING_IP") + ":80"


def add_chairs_to_class(request):
    with grpc.insecure_channel(ip) as channel:
        stub = seating_pb2_grpc.SeatingCallStub(channel)
        response = stub.AddChairToSeatingArrangement(
            seating_pb2.AddChairToSeatingArrangementRequest(class_id=request["class_id"],
                                                            arrangement=json.dumps(request["arrangement"]))
        )
    return response


def remove_chair_from_seating_arrangement(request):
    with grpc.insecure_channel(ip) as channel:
        stub = seating_pb2_grpc.SeatingCallStub(channel)
        response = stub.RemoveChairFromSeatingArrangement(
            seating_pb2.RemoveChairFromSeatingArrangementRequest(chair_ids=json.dumps(request["chair_ids"]))
        )
    return response


def get_student_from_chair(request):
    with grpc.insecure_channel(ip) as channel:
        stub = seating_pb2_grpc.SeatingCallStub(channel)
        response = stub.GetStudentFromChair(
            seating_pb2.GetStudentFromChairRequest(chair_id=request["chair_id"])
        )
    return response
