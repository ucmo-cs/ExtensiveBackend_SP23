import grpc
from python.room.room import room_pb2
from python.room.room import room_pb2_grpc
from concurrent import futures
from dotenv import load_dotenv
import os
from python.class_service.decorators import database_connect
import json

load_dotenv()


class RoomCall(room_pb2_grpc.RoomCallServicer):
    @database_connect
    def AddRoom(self, db, request, context):
        room_name, room_length, room_width = request.room_name, request.room_length, request.room_width
        try:
            sql = "INSERT INTO room(room_name, room_length, room_width) VALUES('%s', %s, %s)" % (room_name, room_length, room_width)
            db.execute(sql)
            # 200 for successful.  Even if they don't match, the code ran successfully
            return room_pb2.RoomReply(message="The room has been added", status_code=200)
        except Exception as e:
            # Generic answer returns a 400
            return room_pb2.RoomReply(error=str(e), status_code=400)

    @database_connect
    def RemoveRoom(self, db, request, context):
        room_id = request.room_id
        try:
            sql = "SELECT room_id FROM room WHERE room_id = %s" % room_id
            db.execute(sql)
            room_exists = db.fetchall()
            if room_exists:
                sql = "UPDATE class SET room_id = null WHERE room_id = %s" % room_id
                db.execute(sql)
                sql = "DELETE FROM room WHERE room_id = %s" % room_id
                db.execute(sql)
                return room_pb2.RoomReply(message="Room has been removed", status_code=200)
            else:
                raise ValueError("That room does not exists")
        except ValueError as v:
            return room_pb2.RoomReply(error=str(v), status_code=404)
        except Exception as e:
            return room_pb2.RoomReply(error=str(e), status_code=400)

    @database_connect
    def GetAllRoomInfo(self, db, request, context):
        room_id = request.room_id
        try:
            sql = "SELECT * FROM room WHERE room_id = %s" % (room_id)
            db.execute(sql)
            room_exists = db.fetchall()
            if room_exists:
                room_exists = json.dumps(room_exists)
                return room_pb2.RoomReply(message=room_exists)
            else:
                raise ValueError("That room does not exist")
        except ValueError as v:
            return room_pb2.RoomReply(error=str(v), status_code=404)
        except Exception as e:
            return room_pb2.RoomReply(error=str(e), status_code=400)


def serve():
    # Generic Service Stuff
    port = '5'
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    room_pb2_grpc.add_RoomCallServicer_to_server(RoomCall(), server)
    server.add_insecure_port(os.getenv("PRIVATE_IP") + ':' + port)
    server.start()
    print("Server started, listening on " + port)
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
