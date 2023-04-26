from marshmallow import Schema, fields
from marshmallow.validate import Range, Regexp


class AddUserSchema(Schema):
    firstname = fields.Str(required=True)
    lastname = fields.Str(required=True)
    # User password checks that it has 8 characters, one of which is a number, and one must be a letter
    user_password = fields.Str(required=True, validate=Regexp(regex="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$", error="Password is not valid.  It must be at least 8 characters, one of them must be a letter, and one must be a number."))
    email = fields.Email(required=True)
    role = fields.Int(required=True, validate=Range(min=0, max=3, error="The role must be a number 0-3"))
    grade = fields.Int(required=False, validate=Range(min=7, max=12, error="The grade must be between 7 and 12"))
