from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class EmailUserReply(_message.Message):
    __slots__ = ["error", "message", "status_code"]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    STATUS_CODE_FIELD_NUMBER: _ClassVar[int]
    error: str
    message: str
    status_code: int
    def __init__(self, message: _Optional[str] = ..., error: _Optional[str] = ..., status_code: _Optional[int] = ...) -> None: ...

class EmailUserRequest(_message.Message):
    __slots__ = ["email_body", "email_subject", "email_to"]
    EMAIL_BODY_FIELD_NUMBER: _ClassVar[int]
    EMAIL_SUBJECT_FIELD_NUMBER: _ClassVar[int]
    EMAIL_TO_FIELD_NUMBER: _ClassVar[int]
    email_body: str
    email_subject: str
    email_to: str
    def __init__(self, email_to: _Optional[str] = ..., email_subject: _Optional[str] = ..., email_body: _Optional[str] = ...) -> None: ...
