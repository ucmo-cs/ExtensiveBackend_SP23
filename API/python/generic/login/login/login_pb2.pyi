from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class LoginReply(_message.Message):
    __slots__ = ["error", "object", "status_code"]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    OBJECT_FIELD_NUMBER: _ClassVar[int]
    STATUS_CODE_FIELD_NUMBER: _ClassVar[int]
    error: str
    object: str
    status_code: int
    def __init__(self, object: _Optional[str] = ..., error: _Optional[str] = ..., status_code: _Optional[int] = ...) -> None: ...

class LoginRequest(_message.Message):
    __slots__ = ["body", "password", "username"]
    BODY_FIELD_NUMBER: _ClassVar[int]
    PASSWORD_FIELD_NUMBER: _ClassVar[int]
    USERNAME_FIELD_NUMBER: _ClassVar[int]
    body: str
    password: str
    username: str
    def __init__(self, username: _Optional[str] = ..., password: _Optional[str] = ..., body: _Optional[str] = ...) -> None: ...
