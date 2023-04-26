import grpc
from python.seating.seating import seating_pb2
from python.seating.seating import seating_pb2_grpc
from concurrent import futures
from dotenv import load_dotenv
import os
from python.class_service.decorators import database_connect
import json

load_dotenv()


class SeatingCall(seating_pb2_grpc.SeatingCallServicer):
    @database_connect
    def AddChairToSeatingArrangement(self, db, request, context):
        class_id, arrangement = request.class_id, json.loads(request.arrangement)
        try:
            for i in arrangement:
                sql = "INSERT INTO chair(chair_x, chair_y, student_id, class_id) VALUES(%s, %s, %s, %s)" % (
                    i["x"], i["y"], i["student_id"], class_id)
                db.execute(sql)
            # 200 for successful.  Even if they don't match, the code ran successfully
            return seating_pb2.SeatingReply(message="The chairs have been added to that class",
                                            status_code=200)
        except Exception as e:
            # Generic answer returns a 400
            return seating_pb2.SeatingReply(error=str(e), status_code=400)

    @database_connect
    def RemoveChairFromSeatingArrangement(self, db, request, context):
        chair_ids = json.loads(request.chair_ids)
        try:
            for i in chair_ids:
                sql = "DELETE FROM chair WHERE chair_id = %s" % i
                db.execute(sql)
            return seating_pb2.SeatingReply(message="The chairs have been deleted from that class",
                                            status_code=200)
        except Exception as e:
            return seating_pb2.SeatingReply(error=str(e), status_code=400)

    @database_connect
    def GetStudentFromChair(self, db, request, context):
        chair_id = request.chair_id
        try:
            sql = "SELECT chair_id FROM chair WHERE chair_id = %s" % chair_id
            db.execute(sql)
            chair_exists = db.fetchall()
            if not chair_exists:
                raise ValueError("That chair does not exist")

            sql = "SELECT student_id FROM chair WHERE chair_id = %s" % chair_id
            db.execute(sql)
            student_id = db.fetchall()[0]["student_id"]

            sql = "SELECT user_id FROM student WHERE student_id = %s" % student_id
            db.execute(sql)
            user_id = db.fetchall()
            if user_id:
                user_id = user_id[0]["user_id"]
                sql = "SELECT * FROM user WHERE user_id = %s" % user_id
                db.execute(sql)
                user_data = db.fetchall()[0]
                return seating_pb2.SeatingReply(message=json.dumps(user_data), status_code=200)
            else:
                raise ValueError("That student id is not assigned to a user")
        except ValueError as v:
            return seating_pb2.SeatingReply(error=str(v), status_code=404)
        except Exception as e:
            return seating_pb2.SeatingReply(error=str(e), status_code=400)


def serve():
    # Generic Service Stuff
    port = '6'
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    seating_pb2_grpc.add_SeatingCallServicer_to_server(SeatingCall(), server)
    server.add_insecure_port(os.getenv("PRIVATE_IP") + ':' + port)
    server.start()
    print("Server started, listening on " + port)
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
