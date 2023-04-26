from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class AddClassRequest(_message.Message):
    __slots__ = ["class_name", "hour", "room_id", "teacher_username"]
    CLASS_NAME_FIELD_NUMBER: _ClassVar[int]
    HOUR_FIELD_NUMBER: _ClassVar[int]
    ROOM_ID_FIELD_NUMBER: _ClassVar[int]
    TEACHER_USERNAME_FIELD_NUMBER: _ClassVar[int]
    class_name: str
    hour: int
    room_id: int
    teacher_username: str
    def __init__(self, teacher_username: _Optional[str] = ..., class_name: _Optional[str] = ..., hour: _Optional[int] = ..., room_id: _Optional[int] = ...) -> None: ...

class AddUserToClassRequest(_message.Message):
    __slots__ = ["class_id", "user_id"]
    CLASS_ID_FIELD_NUMBER: _ClassVar[int]
    USER_ID_FIELD_NUMBER: _ClassVar[int]
    class_id: int
    user_id: int
    def __init__(self, class_id: _Optional[int] = ..., user_id: _Optional[int] = ...) -> None: ...

class ClassReply(_message.Message):
    __slots__ = ["error", "message", "status_code"]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    STATUS_CODE_FIELD_NUMBER: _ClassVar[int]
    error: str
    message: str
    status_code: int
    def __init__(self, message: _Optional[str] = ..., error: _Optional[str] = ..., status_code: _Optional[int] = ...) -> None: ...

class GetAllChairsFromClassRequest(_message.Message):
    __slots__ = ["class_id"]
    CLASS_ID_FIELD_NUMBER: _ClassVar[int]
    class_id: int
    def __init__(self, class_id: _Optional[int] = ...) -> None: ...

class GetAllClassesRequest(_message.Message):
    __slots__ = []
    def __init__(self) -> None: ...

class GetAllUsersFromClassRequest(_message.Message):
    __slots__ = ["class_id"]
    CLASS_ID_FIELD_NUMBER: _ClassVar[int]
    class_id: int
    def __init__(self, class_id: _Optional[int] = ...) -> None: ...

class RemoveClassRequest(_message.Message):
    __slots__ = ["class_id"]
    CLASS_ID_FIELD_NUMBER: _ClassVar[int]
    class_id: int
    def __init__(self, class_id: _Optional[int] = ...) -> None: ...

class RemoveUserFromClassRequest(_message.Message):
    __slots__ = ["class_id", "user_id"]
    CLASS_ID_FIELD_NUMBER: _ClassVar[int]
    USER_ID_FIELD_NUMBER: _ClassVar[int]
    class_id: int
    user_id: int
    def __init__(self, class_id: _Optional[int] = ..., user_id: _Optional[int] = ...) -> None: ...
