[Back to main](../README.md)

# Room

[Add Room](#add-room)<br>
[Remove Room](#remove-room)<br>
[Get All Room Info](#get-all-room-info)<br>
[Get All Rooms](#get-all-rooms)<br>
<br><br>

## Add Room

[Back to the top](#room)

### /api/room/add_room

### Expected Request<br><br>

```json
{
    "room_name": "Test",
    "room_width": 12,
    "room_length": 1925
}
```

### <br>

| Variable    | Data Type | Required | Additional Validation |
|-------------|-----------|----------|-----------------------|
| room_name   | string    | Yes      | No                    |
| room_width  | integer   | Yes      | No                    |
| room_length | integer   | Yes      | No                    |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "Room added"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Remove Room

[Back to the top](#room)

### /api/room/remove_room

### Expected Request<br><br>

```json
{
    "room_id": 1
}
```

### <br>

| Variable | Data Type | Required | Additional Validation |
|----------|-----------|----------|-----------------------|
| room_id  | integer   | Yes      | No                    |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "Room removed"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Get All Room Info

[Back to the top](#room)

### /api/room/get_all_room_info

### Expected Request: /api/room/get_all_room_info?room_id=7<br><br>

### <br>

| Variable | Data Type | Required | Additional Validation |
|----------|-----------|----------|-----------------------|
| room_id  | integer   | Yes      | No                    |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "Json object storing information pertaining to the room"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Get All Rooms

[Back to the top](#room)

### /api/room/get_all_rooms

### Expected Request<br><br>

```json
{
  
}
```

### <br>

| Variable | Data Type | Required | Additional Validation |
|----------|-----------|----------|-----------------------|
|          |           |          |                       |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "Array storing all rooms and their info"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```