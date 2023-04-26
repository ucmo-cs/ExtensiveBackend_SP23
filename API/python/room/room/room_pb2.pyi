from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class AddRoomRequest(_message.Message):
    __slots__ = ["room_length", "room_name", "room_width"]
    ROOM_LENGTH_FIELD_NUMBER: _ClassVar[int]
    ROOM_NAME_FIELD_NUMBER: _ClassVar[int]
    ROOM_WIDTH_FIELD_NUMBER: _ClassVar[int]
    room_length: int
    room_name: str
    room_width: int
    def __init__(self, room_name: _Optional[str] = ..., room_length: _Optional[int] = ..., room_width: _Optional[int] = ...) -> None: ...

class GetAllRoomInfoRequest(_message.Message):
    __slots__ = ["room_id"]
    ROOM_ID_FIELD_NUMBER: _ClassVar[int]
    room_id: int
    def __init__(self, room_id: _Optional[int] = ...) -> None: ...

class RemoveRoomRequest(_message.Message):
    __slots__ = ["room_id"]
    ROOM_ID_FIELD_NUMBER: _ClassVar[int]
    room_id: int
    def __init__(self, room_id: _Optional[int] = ...) -> None: ...

class RoomReply(_message.Message):
    __slots__ = ["error", "message", "status_code"]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    STATUS_CODE_FIELD_NUMBER: _ClassVar[int]
    error: str
    message: str
    status_code: int
    def __init__(self, message: _Optional[str] = ..., error: _Optional[str] = ..., status_code: _Optional[int] = ...) -> None: ...
