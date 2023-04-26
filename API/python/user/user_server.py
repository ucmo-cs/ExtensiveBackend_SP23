import grpc
from python.user.user import user_pb2
from python.user.user import user_pb2_grpc
from concurrent import futures
from dotenv import load_dotenv
import os
from python.class_service.decorators import database_connect
import json

load_dotenv()


class UserCall(user_pb2_grpc.UserCallServicer):
    @database_connect
    def AddUser(self, db, request, context):
        # Populate values sent in the request
        username, firstname, lastname, password, email, role_id = request.username, request.first_name, request.last_name, request.user_password, request.email, request.role_id
        grade = None if role_id != 0 else request.grade
        try:
            # Insert all relevant data into the user table
            sql = "INSERT INTO new.user(username, first_name, last_name, email, role_id) VALUES('%s', '%s', '%s', " \
                  "'%s', '%s') as message" % (username, firstname, lastname, email, role_id)
            db.execute(sql)
            # Grab the new user_id that was generated
            sql = "SELECT user_id FROM user WHERE username = '%s'" % username
            db.execute(sql)
            uid = db.fetchall()[0]["user_id"]
            # Now populate the login table with the id and password attached
            sql = "INSERT INTO login VALUES('%s', '%s')" % (uid, password)
            db.execute(sql)

            match role_id:
                case 0:
                    sql = "INSERT INTO student(user_id, grade) VALUES(%s, %s)" % (uid, grade)
                    db.execute(sql)
                case 1:
                    sql = "INSERT INTO guardian(user_id) VALUES (%s)" % uid
                    db.execute(sql)
                case 2:
                    sql = "INSERT INTO teacher(user_id) VALUES (%s)" % uid
                    db.execute(sql)
                case 3:
                    sql = "INSERT INTO admin(user_id) VALUES (%s)" % uid
                    db.execute(sql)
            # 200 is a successful error code
            return user_pb2.UserReply(message="User Added", status_code=200)
        except Exception as e:
            # 400 is unsuccessful
            return user_pb2.UserReply(error=str(e), status_code=400)

    @database_connect
    def RemoveUser(self, db, request, context):
        # Grab user id from request data
        user_id = request.user_id
        try:
            # Verifying that the user_id exists
            sql = "SELECT role_id FROM user WHERE user_id = '%s'" % user_id
            db.execute(sql)
            role = db.fetchall()
            if role:
                role = role[0]["role_id"]
                '''
                If the user_id exists, we will first drop it from the login table
                This is because of foreign key constraints.  Before deleting the root primary key, we must remove it from
                Any foreign key positions first
                '''
                sql = "DELETE FROM login WHERE user_id = '%s'" % user_id
                db.execute(sql)
                match role:
                    case 0:
                        sql = "DELETE FROM student WHERE user_id = %s" % user_id
                        db.execute(sql)
                    case 1:
                        sql = "DELETE FROM parent WHERE user_id = %s" % user_id
                        db.execute(sql)
                    case 2:
                        sql = "DELETE FROM teacher WHERE user_id = %s" % user_id
                        db.execute(sql)
                    case 3:
                        sql = "DELETE FROM admin WHERE user_id = %s" % user_id
                        db.execute(sql)
                # After that, we delete the user from the user table
                sql = "DELETE FROM user WHERE user_id = '%s'" % user_id
                db.execute(sql)
                # 200 is successful
                return user_pb2.UserReply(message="User removed", status_code=200)
            else:
                raise ValueError("That user_id does not exist in the login")
        except ValueError as v:
            # If the user doesn't exist, return 404 for not found
            return user_pb2.UserReply(error=str(v), status_code=404)
        except Exception as e:
            # Generic error returns a 400
            return user_pb2.UserReply(error=str(e), status_code=400)

    @database_connect
    def GetAllClassesOfUser(self, db, request, context):
        # Grab user id from request data
        user_id = request.user_id
        try:
            # Grabbing role of user
            sql = "SELECT role_id FROM user WHERE user_id = %s" % user_id
            db.execute(sql)
            role = db.fetchall()[0]["role_id"]
            match role:
                case 0:
                    # Grabbing student id from user id
                    sql = "SELECT student_id FROM student WHERE user_id = %s" % user_id
                    db.execute(sql)
                    student_id = db.fetchall()
                    if student_id:
                        sql = "SELECT * FROM student_classes sc INNER JOIN class c ON sc.class_id = c.class_id WHERE student_id = %s" % student_id[0]["student_id"]
                        db.execute(sql)
                        classes = db.fetchall()
                        if classes:
                            classes = json.dumps(classes)
                            classes = classes.replace("\'", '\"')
                            return user_pb2.UserReply(message=classes, status_code=200)
                        else:
                            raise ValueError("That student has no classes")
                case 2:
                    # Grabbing teacher id from user id
                    sql = "SELECT teacher_id FROM teacher WHERE user_id = %s" % user_id
                    db.execute(sql)
                    teacher_id = db.fetchall()
                    # If that teacher exists
                    if teacher_id:
                        # Grabbing relevant information
                        sql = "SELECT class_id, class_name, hour FROM class WHERE teacher_id = %s ORDER BY hour ASC" % teacher_id[0]["teacher_id"]
                        db.execute(sql)
                        classes = db.fetchall()
                        # If the teacher has classes
                        if classes:
                            # Convert to string
                            classes = json.dumps(classes)
                            classes = classes.replace("\'", '\"')
                            return user_pb2.UserReply(message=classes, status_code=200)
                        else:
                            raise ValueError("That teacher has no classes")
                    else:
                        raise ValueError("That user is not a teacher")
        except ValueError as v:
            # If the user doesn't exist, return 404 for not found
            return user_pb2.UserReply(error=str(v), status_code=404)
        except Exception as e:
            # Generic error returns a 400
            return user_pb2.UserReply(error=str(e), status_code=400)

    @database_connect
    def GetAllTeachers(self, db, request, context):
        try:
            sql = "SELECT * FROM USER u INNER JOIN TEACHER t ON t.user_id = u.user_id"
            db.execute(sql)
            teachers = db.fetchall()
            return user_pb2.UserReply(message=json.dumps(teachers), status_code=200)
        except Exception as e:
            return user_pb2.UserReply(error=str(e), status_code=400)


def serve():
    # General service setup
    port = '7'
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_pb2_grpc.add_UserCallServicer_to_server(UserCall(), server)
    server.add_insecure_port(os.getenv("PRIVATE_IP") + ':' + port)
    server.start()
    print("Server started, listening on " + port)
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
