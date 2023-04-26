[Back to main](../README.md)

# Class

[Add Class](#add-class)<br>
[Remove Class](#remove-class)<br>
[Add User To Class](#add-user-to-class)<br>
[Remove User From Class](#remove-user-from-class)<br>
[Get All Users From Class](#get-all-users-from-class)<br>
[Get All Chairs From Class](#get-all-chairs-from-class)<br>
[Get All Classes](#get-all-classes)<br>
<br><br>

## Add Class

[Back to the top](#class)

### /api/class/add_class

### Expected Request<br><br>

```json
{
    "teacher_username": "teacher username",
    "class_name": "class name",
    "hour": "hour",
    "room_id": "room id"
}
```

### <br>

| Variable         | Data Type | Required | Additional Validation                                |
|------------------|-----------|----------|------------------------------------------------------|
| teacher_username | string    | True     | Must be a username ascribed to a teacher             |
| class_name       | string    | True     | No                                                   |
| hour             | integer   | True     | Teacher must not have other class at this hour       |
| room_id          | integer   | True     | Room must not have a class taught in it at this hour |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "Class added"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Remove Class

[Back to the top](#class)

### /api/class/remove_class

### Expected Request<br><br>

```json
{
    "class_id": "class id"
}
```

### <br>

| Variable | Data Type | Required | Additional Validation                                              |
|----------|-----------|----------|--------------------------------------------------------------------|
| class_id | integer   | True     | No                                                                 |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "Class Removed"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Get All Users From Class

[Back to the top](#class)

### /api/class/get_all_users_from_class

### Expected Request<br><br>/api/class/get_all_users_from_class?class_id=5<br>

### <br>

| Variable | Data Type | Required | Additional Validation                                              |
|----------|-----------|----------|--------------------------------------------------------------------|
| class_id | integer   | True     | No                                                                 |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "array of user information for that class"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Add User To Class

[Back to the top](#class)

### /api/class/add_user_to_class

### Expected Request<br><br>

```json
{
    "class_id": "class id", 
    "user_id": "user id"
}
```

### <br>

| Variable | Data Type | Required | Additional Validation |
|----------|-----------|----------|-----------------------|
| class_id | integer   | True     | No                    |
| user_id  | integer   | True     | No                    |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "User has been added to that class"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Remove User From Class

[Back to the top](#class)

### /api/class/remove_user_from_class

### Expected Request<br><br>

```json
{
    "class_id": "class id", 
    "user_id": "user id"
}
```

### <br>

| Variable | Data Type | Required | Additional Validation |
|----------|-----------|----------|-----------------------|
| class_id | integer   | True     | No                    |
| user_id  | integer   | True     | No                    |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "User has been added to that class"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

# Get All Chairs From Class

[Back to the top](#class)

### /api/class/get_all_chairs_from_class

### Expected Request<br><br>/api/class/get_all_chairs_from_class?class_id=6<br>

| Variable | Data Type | Required | Additional Validation |
|----------|-----------|----------|-----------------------|
| class_id | integer   | True     | No                    |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "array with all chairs in the provided class"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Get All Classes

[Back to the top](#class)

### /api/class/get_all_classes

### Expected Request<br><br>/api/class/get_all_classes?user_id=59

| Variable | Data Type | Required | Additional Validation |
|----------|-----------|----------|-----------------------|

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "array of all classes"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```
