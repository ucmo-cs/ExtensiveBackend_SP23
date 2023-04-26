from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class AddChairToSeatingArrangementRequest(_message.Message):
    __slots__ = ["arrangement", "class_id"]
    ARRANGEMENT_FIELD_NUMBER: _ClassVar[int]
    CLASS_ID_FIELD_NUMBER: _ClassVar[int]
    arrangement: str
    class_id: int
    def __init__(self, class_id: _Optional[int] = ..., arrangement: _Optional[str] = ...) -> None: ...

class GetStudentFromChairRequest(_message.Message):
    __slots__ = ["chair_id"]
    CHAIR_ID_FIELD_NUMBER: _ClassVar[int]
    chair_id: int
    def __init__(self, chair_id: _Optional[int] = ...) -> None: ...

class RemoveChairFromSeatingArrangementRequest(_message.Message):
    __slots__ = ["chair_ids"]
    CHAIR_IDS_FIELD_NUMBER: _ClassVar[int]
    chair_ids: str
    def __init__(self, chair_ids: _Optional[str] = ...) -> None: ...

class SeatingReply(_message.Message):
    __slots__ = ["error", "message", "status_code"]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    STATUS_CODE_FIELD_NUMBER: _ClassVar[int]
    error: str
    message: str
    status_code: int
    def __init__(self, message: _Optional[str] = ..., error: _Optional[str] = ..., status_code: _Optional[int] = ...) -> None: ...
