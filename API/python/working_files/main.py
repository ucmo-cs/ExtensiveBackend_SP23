from flask import Flask, request, Response
from flask_cors import cross_origin
from login_client import *
from user_client import *
from class_client import *
from email_client import *
from room_client import *
from seating_client import *
from python.working_files.log_response import Logging
from python.schemas.LoginSchema import LoginSchema
from python.schemas.AddUserSchema import AddUserSchema
import json
from marshmallow.exceptions import ValidationError

app = Flask(__name__)
# This cors is essentially stating that they can make GET, POST, or DELETE calls
# From any origin, and with Authorization and Content-Type headers
admin_cors = {
    "origins": ["*"],
    "methods": ["POST", "DELETE"],
    "allow_headers": ["Authorization", "Content-Type"]
}

generic_cors = {
    "origins": ["*"],
    "methods": ["GET", "POST", "DELETE"],
    "allow_headers": ["Authorization", "Content-Type", "Access-Control-Allow-Origin"]
}

logging_obj = Logging()


@app.route("/api/generic/login", methods=["GET"])
@cross_origin(**generic_cors)
def login_api():
    # Converting parameters to dictionary for consinstency
    data = {
        "username": request.args.get('username'),
        "password": request.args.get('password')
    }
    try:
        # Validate against the LoginSchema
        validate = LoginSchema().load(data)
    except Exception as e:
        # If it isn't valid, return why and a 400 code
        to_return = Response(json.dumps({"error": str(e)}, status=400))
    try:
        result = login(data)
    except Exception as e:
        to_return = Response(json.dumps({"error": str(e)}), status=500)
    else:
        # Message will return "valid": True or "valid": False if it's good, but if it threw an error
        # It will return "error": error_message
        object = ""
        if result.object != "":
            object = json.loads(result.object)
        to_return = Response(
            json.dumps({"user" if result.object else "error": result.error if result.error else object}),
            status=result.status_code)
    logging_obj.log_response(request.url_rule, data, to_return.status)
    return to_return


@app.route("/api/user/add_user", methods=["POST"])
@cross_origin(**admin_cors)
def add_user_api():
    info = request.get_json()
    try:
        # Validate against AddUserSchema
        validate = AddUserSchema().load(info)
    except ValidationError as v:
        # For prettier errors, I extracted into a list and appended to it
        errors = []
        for i in v.messages.values():
            errors.append(i[0])
        # This only works for Validation Errors, but it's essentially identical to the next except clause
        to_return = Response(json.dumps({"errors": errors}), status=400)
    except Exception as e:
        # Generic error returns 400 code
        to_return = Response(json.dumps({"errors": str(e)}), status=400)
    else:
        result = add_user(info)
        # This response returns "message": message unless there is an error in which case it is
        # "error" error
        to_return = Response(
            json.dumps({"message" if result.message else "error": result.message if result.message else result.error}),
            status=result.status_code)
    logging_obj.log_response(request.url_rule, info, to_return.status)
    return to_return


@app.route("/api/user/remove_user", methods=["DELETE"])
@cross_origin(**admin_cors)
def remove_user_api():
    info = request.get_json()
    result = remove_user(info)
    # This response returns "message": message unless there is an error in which case it is
    # "error" error
    to_return = Response(
        json.dumps({"message" if result.message else "error": result.message if result.message else result.error}),
        status=result.status_code)
    logging_obj.log_response(request.url_rule, info, to_return.status)
    return to_return


@app.route("/api/class/add_class", methods=["POST"])
@cross_origin(**admin_cors)
def add_class_api():
    info = request.get_json()
    try:
        result = add_class(info)
        to_return = Response(
            json.dumps({"message" if result.message else "error": result.message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as e:
        to_return = Response(json.dumps({"error": str(e)}), status=500)
    logging_obj.log_response(request.url_rule, info, to_return.status)
    return to_return


@app.route("/api/class/remove_class", methods=["DELETE"])
@cross_origin(**admin_cors)
def remove_class_api():
    try:
        info = request.get_json()
        result = remove_class(info)
        to_return = Response(
            json.dumps({"message" if result.message else "error": result.message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        to_return = Response(json.dumps({"error": str(error)}), status=500)
    logging_obj.log_response(request.url_rule, info, to_return.status)
    return to_return


@app.route("/api/room/add_room", methods=["POST"])
@cross_origin(**generic_cors)
def add_room_api():
    info = request.get_json()
    try:
        result = add_room(info)
        to_return = Response(
            json.dumps({"message" if result.message else "error": result.message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        to_return = Response(json.dumps({"error": str(error)}), status=500)
    logging_obj.log_response(request.url_rule, info, to_return.status)
    return to_return


@app.route("/api/room/remove_room", methods=["DELETE"])
@cross_origin(**generic_cors)
def remove_room_api():
    info = request.get_json()
    try:
        result = remove_room(info)
        to_return = Response(
            json.dumps({"message" if result.message else "error": result.message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        to_return = Response(json.dumps({"error": str(error)}), status=500)
    logging_obj.log_response(request.url_rule, info, to_return.status)
    return to_return


@app.route("/api/room/get_all_room_info", methods=["GET"])
@cross_origin(**generic_cors)
def get_all_room_info_api():
    info = {
        "room_id": int(request.args.get('room_id'))
    }
    try:
        result = get_all_room_info(info)
        if result.message:
            result_message = json.loads(result.message)
        return Response(
            json.dumps({"message" if result.message else "error": result_message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        return Response(json.dumps({"error": str(error)}), status=500)


@app.route("/api/generic/email_user", methods=["POST"])
@cross_origin(**generic_cors)
def email_user_api():
    info = request.get_json()
    try:
        result = email_user(info)
        to_return = Response(
            json.dumps({"message" if result.message else "error": result.message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        to_return = Response(json.dumps({"error": str(error)}), status=500)
    logging_obj.log_response(request.url_rule, info, to_return.status)
    return to_return


@app.route("/api/class/add_user_to_class", methods=["POST"])
@cross_origin(**generic_cors)
def add_user_to_class_api():
    info = request.get_json()
    try:
        result = add_user_to_class(info)
        to_return = Response(
            json.dumps({"message" if result.message else "error": result.message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        to_return = Response(json.dumps({"error": str(error)}), status=500)
    logging_obj.log_response(request.url_rule, info, to_return.status)
    return to_return


@app.route("/api/class/remove_user_from_class", methods=["DELETE"])
@cross_origin(**generic_cors)
def remove_user_from_class_api():
    info = request.get_json()
    try:
        result = remove_user_from_class(info)
        to_return = Response(
            json.dumps({"message" if result.message else "error": result.message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        to_return = Response(json.dumps({"error": str(error)}), status=500)
    logging_obj.log_response(request.url_rule, info, to_return.status)
    return to_return


@app.route("/api/seating/add_chairs_to_seating_arrangement", methods=["POST"])
@cross_origin(**generic_cors)
def add_chairs_to_class_api():
    info = request.get_json()
    try:
        result = add_chairs_to_class(info)
        to_return = Response(
            json.dumps({"message" if result.message else "error": result.message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        to_return = Response(json.dumps({"error": str(error)}), status=500)
    logging_obj.log_response(request.url_rule, info, to_return.status)
    return to_return


@app.route("/api/seating/remove_chair_from_seating_arrangement", methods=["DELETE"])
@cross_origin(**generic_cors)
def remove_chair_from_seating_arrangement_api():
    info = request.get_json()
    try:
        result = remove_chair_from_seating_arrangement(info)
        to_return = Response(
            json.dumps({"message" if result.message else "error": result.message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        to_return = Response(json.dumps({"error": str(error)}), status=500)
    logging_obj.log_response(request.url_rule, info, to_return.status)
    return to_return


@app.route("/api/class/get_all_users_from_class", methods=["GET"])
@cross_origin(**generic_cors)
def get_all_users_from_class_api():
    info = {
        "class_id": int(request.args.get('class_id'))
    }
    try:
        result = get_all_users_from_class(info)
        if result.message:
            result_message = json.loads(result.message)
        return Response(
            json.dumps({"message" if result.message else "error": result_message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        return Response(json.dumps({"error": str(error)}), status=500)


@app.route("/api/class/get_all_chairs_from_class", methods=["GET"])
@cross_origin(**generic_cors)
def get_all_chairs_from_class_api():
    info = {
        "class_id": int(request.args.get('class_id'))
    }
    try:
        result = get_all_chairs_from_class(info)
        if result.message:
            result_message = json.loads(result.message)
        return Response(
            json.dumps({"message" if result.message else "error": result_message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        return Response(json.dumps({"error": str(error)}), status=500)


@app.route("/api/user/get_all_classes_from_user", methods=["GET"])
@cross_origin(**generic_cors)
def get_all_classes_from_user_api():
    info = {
        "user_id": int(request.args.get('user_id'))
    }
    try:
        result = get_all_classes_from_user(info)
        if result.message:
            result_message = json.loads(result.message)
        return Response(
            json.dumps({"message" if result.message else "error": result_message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        return Response(json.dumps({"error": str(error)}), status=500)


@app.route("/api/user/get_all_teachers", methods=["GET"])
@cross_origin(**generic_cors)
def get_all_teachers_api():
    try:
        result = get_all_teachers()
        if result.message:
            result_message = json.loads(result.message)
        return Response(
            json.dumps({"message" if result.message else "error": result_message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        return Response(json.dumps({"error": str(error)}), status=500)


@app.route("/api/class/get_all_classes", methods=["GET"])
@cross_origin(**generic_cors)
def get_all_classes_api():
    try:
        result = get_all_classes()
        if result.message:
            result_message = json.loads(result.message)
        return Response(
            json.dumps({"message" if result.message else "error": result_message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        return Response(json.dumps({"error": str(error)}), status=500)


@app.route("/api/seating/get_student_from_chair", methods=["GET"])
@cross_origin(**generic_cors)
def get_user_from_chair_api():
    info = {
        "chair_id": int(request.args.get('chair_id'))
    }
    try:
        result = get_student_from_chair(info)
        if result.message:
            result_message = json.loads(result.message)
        return Response(
            json.dumps({"message" if result.message else "error": result_message if result.message else result.error}),
            status=result.status_code
        )
    except Exception as error:
        return Response(json.dumps({"error": str(error)}), status=500)


@app.route("/api/generic/check", methods=["GET"])
@cross_origin(**generic_cors)
def check():
    # An easy way to see if the API is visible to others
    return "check successful"


def main():
    app.run(host='0.0.0.0', port=8000)


if __name__ == "__main__":
    main()
