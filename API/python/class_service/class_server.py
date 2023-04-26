import grpc
from python.class_service.class_files import class_pb2
from python.class_service.class_files import class_pb2_grpc
from concurrent import futures
from dotenv import load_dotenv
import os
from python.class_service.decorators import database_connect
import json
import socket

load_dotenv()


class ClassCall(class_pb2_grpc.ClassCallServicer):
    @database_connect
    def AddClass(self, db, request, context):
        teacher_username, class_name, hour, room_id = request.teacher_username, request.class_name, request.hour, request.room_id
        try:
            # Grab user_id from username
            sql = "SELECT user_id FROM user WHERE username = '%s'" % teacher_username
            db.execute(sql)
            user_id = db.fetchall()[0]

            # If valid id
            if user_id:
                # Check to see if that user is in fact a teacher
                sql = "SELECT teacher_id FROM teacher WHERE user_id = %s" % user_id["user_id"]
                db.execute(sql)
                teacher_id = db.fetchall()
                if not teacher_id:
                    raise ValueError("That user is not a teacher")

                # If user is a teacher
                else:
                    teacher_id = teacher_id[0]["teacher_id"]

                    # Make sure teacher is not already teaching at that hour
                    sql = "SELECT * FROM class WHERE hour = '%s' AND teacher_id = '%s'" % (hour, teacher_id)
                    db.execute(sql)
                    if db.fetchall():
                        raise ValueError("That teacher is already teaching a class at that hour!")

                    # Make sure the room exists
                    sql = "SELECT * FROM room WHERE room_id = %s" % room_id
                    db.execute(sql)
                    if not db.fetchall():
                        raise ValueError("That room does not exist")

                    # Make sure that class doesn't exist in a room at that hour
                    sql = "SELECT * FROM CLASS WHERE hour = '%s' and room_id = '%s'" % (hour, room_id)
                    db.execute(sql)
                    if db.fetchall():
                        raise ValueError("That room already has a class in it at that hour")

                    # If they have that hour free
                    else:
                        # Add class for that teacher
                        sql = "INSERT INTO class(teacher_id, class_name, hour, room_id) VALUES(%s, '%s', %s, %s)" % (
                            teacher_id, class_name, hour, room_id)
                        db.execute(sql)
                        return class_pb2.ClassReply(message="Class Created", status_code=200)
            else:
                raise ValueError("The username provided for the teacher does not exist")
        except ValueError as error:
            return class_pb2.ClassReply(error=str(error), status_code=404)
        except Exception as error:
            return class_pb2.ClassReply(error=str(error), status_code=400)

    @database_connect
    def RemoveClass(self, db, request, context):
        class_id = request.class_id
        try:
            # See if the class exists
            sql = "SELECT * FROM class WHERE class_id = '%s'" % class_id
            db.execute(sql)

            # If class exists
            if db.fetchall():
                # Delete class from student classes
                sql = "DELETE FROM student_classes WHERE class_id = '%s'" % class_id
                db.execute(sql)

                # Delete class from class table
                sql = "DELETE FROM class WHERE class_id = '%s'" % class_id
                db.execute(sql)
                return class_pb2.ClassReply(message="Class has been removed", status_code=200)
            else:
                raise ValueError("That class does not exist")
        except ValueError as v:
            return class_pb2.ClassReply(error=str(v), status_code=404)
        except Exception as error:
            return class_pb2.ClassReply(error=str(error), status_code=400)

    @database_connect
    def AddUserToClass(self, db, request, context):
        class_id, user_id = request.class_id, request.user_id
        try:
            # Get student_id from user_id
            sql = "SELECT student_id FROM student WHERE user_id = %s" % user_id
            db.execute(sql)
            student_id = db.fetchall()
            if not student_id:
                raise ValueError("That user is not a student")
            # If valid
            else:
                # Check class validity
                sql = "SELECT class_id FROM class WHERE class_id = %s" % class_id
                db.execute(sql)
                if not db.fetchall():
                    raise ValueError("That class does not exist")

                # If valid, check to make sure hour isn't occupied by another class
                # Start by getting hour for class provided
                student_id = student_id[0]["student_id"]
                grab_hour_for_class_id = "SELECT hour FROM class WHERE class_id = %s" % class_id
                db.execute(grab_hour_for_class_id)
                hour = db.fetchall()[0]["hour"]

                # Now we grab all classes for that user
                grab_all_classes_for_the_student = "SELECT * FROM student_classes WHERE student_id = %s" % student_id
                db.execute(grab_all_classes_for_the_student)
                classes = db.fetchall()
                has_hour = False

                # For each of those classes, we will check the hour against hour for class provided
                for clas in classes:
                    grab_hour_for_class_id = "SELECT hour FROM class WHERE class_id = %s" % clas["class_id"]
                    db.execute(grab_hour_for_class_id)
                    class_hour = db.fetchall()[0]["hour"]
                    if class_hour == hour:
                        has_hour = True

                # If hour occupied
                if has_hour:
                    raise ValueError("That student already has a class at that hour!")
                else:
                    # Finally run query
                    put_student_in_student_classes_table = "INSERT INTO student_classes VALUES(%s, %s)" % (
                        student_id, class_id)
                    db.execute(put_student_in_student_classes_table)
                    return class_pb2.ClassReply(message="User has been added to class", status_code=200)
        except ValueError as v:
            return class_pb2.ClassReply(error=str(v), status_code=404)
        except Exception as error:
            return class_pb2.ClassReply(error=str(error), status_code=400)

    @database_connect
    def RemoveUserFromClass(self, db, request, context):
        class_id, user_id = request.class_id, request.user_id
        try:
            # Grab student_id from user_id
            sql = "SELECT student_id FROM student WHERE user_id = %s" % user_id
            db.execute(sql)
            student_id = db.fetchall()
            if not student_id:
                raise ValueError("That user is not a student")

            # If user is a student
            else:
                student_id = student_id[0]["student_id"]

                # Make sure class is valid
                sql = "SELECT class_id FROM class WHERE class_id = %s" % class_id
                db.execute(sql)
                if not db.fetchall():
                    raise ValueError("That class does not exist")

                # If valid, remove user from that class
                remove_user_from_table = "DELETE FROM student_classes WHERE student_id = %s" % student_id
                db.execute(remove_user_from_table)
                return class_pb2.ClassReply(message="User has been removed from the class",
                                            status_code=200)
        except ValueError as v:
            return class_pb2.ClassReply(error=str(v), status_code=404)
        except Exception as error:
            return class_pb2.ClassReply(error=str(error), status_code=400)

    @database_connect
    def GetAllUsersFromClass(self, db, request, context):
        class_id = request.class_id
        try:
            # Just checking to see if a class exists
            sql = "SELECT * FROM class WHERE class_id = %s" % class_id
            db.execute(sql)
            # If class exists
            if db.fetchall():
                # Grabbing student ids in that class
                sql = "SELECT student_id FROM student_classes WHERE class_id = '%s'" % class_id
                db.execute(sql)
                student_ids = db.fetchall()
                # If it returns students
                if student_ids:
                    user_ids = []
                    # One by one grab their user ids
                    for student in student_ids:
                        sql = "SELECT user_id FROM student WHERE student_id = %s" % student["student_id"]
                        db.execute(sql)
                        user_ids.append(db.fetchall()[0]["user_id"])
                    users = []
                    # One by one grab personal information
                    for user in user_ids:
                        sql = "SELECT u.user_id, s.student_id, u.first_name, u.last_name FROM user u LEFT JOIN student s ON u.user_id = s.user_id WHERE u.user_id = %s" % user
                        db.execute(sql)
                        users.append(db.fetchall()[0])
                    # Sort by last name
                    users = sorted(users, key=lambda d: d["last_name"])
                    users = json.dumps(users)
                    return class_pb2.ClassReply(message=users, status_code=200)
                else:
                    raise ValueError("That class is empty")
            else:
                raise ValueError("That class does not exist")
        except ValueError as v:
            return class_pb2.ClassReply(error=str(v), status_code=404)
        except Exception as error:
            return class_pb2.ClassReply(error=str(error), status_code=400)

    @database_connect
    def GetAllChairsFromClass(self, db, request, context):
        class_id = request.class_id
        try:
            sql = "SELECT chair_id, chair_x, chair_y, student_id FROM chair WHERE class_id = %s" % class_id
            db.execute(sql)
            chairs = json.dumps(db.fetchall())
            return class_pb2.ClassReply(message=chairs, status_code=200)
        except Exception as e:
            return class_pb2.ClassReply(error=str(e), status_code=400)

    @database_connect
    def GetAllClasses(self, db, request, context):
        try:
            sql = "SELECT c.*, r.room_name FROM class c LEFT JOIN room r ON c.room_id = r.room_id"
            db.execute(sql)
            classes = json.dumps(db.fetchall())
            return class_pb2.ClassReply(message=classes, status_code=200)
        except Exception as e:
            return class_pb2.ClassReply(error=str(e), status_code=400)


def serve():
    # General service setup
    port = '3'
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    class_pb2_grpc.add_ClassCallServicer_to_server(ClassCall(), server)
    server.add_insecure_port(os.getenv("PRIVATE_IP") + ':' + port)
    server.start()
    print("Server started, listening on " + port)

    # getting the hostname by socket.gethostname() method
    hostname = socket.gethostname()
    # getting the IP address using socket.gethostbyname() method
    ip_address = socket.gethostbyname(hostname)
    # printing the hostname and ip_address
    print(f"Hostname: {hostname}")
    print(f"IP Address: {ip_address}")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
