import os
import smtplib
import ssl
from concurrent import futures
from email.mime.text import MIMEText

import grpc
from dotenv import load_dotenv

from python.generic.email.email import email_pb2
from python.generic.email.email import email_pb2_grpc
from python.class_service.decorators import database_connect

import json

load_dotenv()
password = os.getenv("EMAIL_PASSWORD")
context = ssl.create_default_context()


def send_email(email, message):
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(os.getenv("MOREBOARD_EMAIL"), os.getenv("EMAIL_PASSWORD"))
        server.sendmail(os.getenv("MOREBOARD_EMAIL"), email, message.as_string())
        print("Email sent")


class EmailCall(email_pb2_grpc.EmailCallServicer):
    @database_connect
    def EmailUser(self, db, request, context):
        email_to, email_subject, email_body = request.email_to, request.email_subject, request.email_body
        try:
            emails = []
            email_to = json.loads(email_to)
            for user in email_to:
                sql = "SELECT email FROM user WHERE user_id = '%s'" % user
                db.execute(sql)
                email = db.fetchall()

                if email:
                    email = email[0]["email"]
                    emails.append(email)
                else:
                    raise ValueError("That username is invalid")

            message = MIMEText(email_body)
            message['Subject'] = email_subject
            message['From'] = os.getenv("MOREBOARD_EMAIL")
            message['To'] = ", ".join(emails)
            try:
                send_email(emails, message)
                return email_pb2.EmailUserReply(message="Email Sent", status_code=200)
            except Exception as e:
                raise e
        except ValueError as v:
            return email_pb2.EmailUserReply(error=str(v), status_code=404)
        except Exception as e:
            return email_pb2.EmailUserReply(error=str(e), status_code=500)


def serve():
    # Generic Service Stuff
    port = '4'
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    email_pb2_grpc.add_EmailCallServicer_to_server(EmailCall(), server)
    server.add_insecure_port(os.getenv("PRIVATE_IP") + ':' + port)
    server.start()
    print("Server started, listening on " + port)
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
