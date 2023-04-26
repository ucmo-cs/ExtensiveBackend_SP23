from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class AddUserRequest(_message.Message):
    __slots__ = ["email", "first_name", "grade", "last_name", "role_id", "user_password", "username"]
    EMAIL_FIELD_NUMBER: _ClassVar[int]
    FIRST_NAME_FIELD_NUMBER: _ClassVar[int]
    GRADE_FIELD_NUMBER: _ClassVar[int]
    LAST_NAME_FIELD_NUMBER: _ClassVar[int]
    ROLE_ID_FIELD_NUMBER: _ClassVar[int]
    USERNAME_FIELD_NUMBER: _ClassVar[int]
    USER_PASSWORD_FIELD_NUMBER: _ClassVar[int]
    email: str
    first_name: str
    grade: int
    last_name: str
    role_id: int
    user_password: str
    username: str
    def __init__(self, username: _Optional[str] = ..., first_name: _Optional[str] = ..., last_name: _Optional[str] = ..., user_password: _Optional[str] = ..., email: _Optional[str] = ..., role_id: _Optional[int] = ..., grade: _Optional[int] = ...) -> None: ...

class GetAllClassesOfUserRequest(_message.Message):
    __slots__ = ["user_id"]
    USER_ID_FIELD_NUMBER: _ClassVar[int]
    user_id: int
    def __init__(self, user_id: _Optional[int] = ...) -> None: ...

class GetAllTeachersRequest(_message.Message):
    __slots__ = []
    def __init__(self) -> None: ...

class RemoveUserRequest(_message.Message):
    __slots__ = ["user_id"]
    USER_ID_FIELD_NUMBER: _ClassVar[int]
    user_id: int
    def __init__(self, user_id: _Optional[int] = ...) -> None: ...

class UserReply(_message.Message):
    __slots__ = ["error", "message", "status_code"]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    STATUS_CODE_FIELD_NUMBER: _ClassVar[int]
    error: str
    message: str
    status_code: int
    def __init__(self, message: _Optional[str] = ..., error: _Optional[str] = ..., status_code: _Optional[int] = ...) -> None: ...
