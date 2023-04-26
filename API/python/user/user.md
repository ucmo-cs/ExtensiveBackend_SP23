[Back to main](../README.md)

# User

[Add User](#add-user)<br>
[Remove User](#remove-user)<br>
[Get All Classes From Teachers](#get-all-classes-from-user)<br>
[Get All Users](#get-all-users)<br>

<br><br>

## Add User

[Back to the top](#user)

### /api/user/add_user

### Expected Request<br><br>

```json
{
    "firstname": "firstname",
    "lastname": "lastname",
    "user_password": "password",
    "email": "email",
    "role": "role"
}
```

### <br>

| Variable      | Data Type | Required | Additional Validation                                              |
|---------------|-----------|----------|--------------------------------------------------------------------|
| firstname     | string    | True     | No                                                                 |
| lastname      | string    | True     | No                                                                 | 
| user_password | string    | True     | Minimum 8 characters.  At least one letter and at least one number |
| email         | string    | True     | Looks for something like something@something.something             |
| role          | integer   | True     | Looking for a valid role_id.  Currently that's something from 0-3  |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "User added"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Remove User

[Back to the top](#user)

### /api/user/remove_user

### Expected Request<br><br>

```json
{
    "user_id": "user id"
}
```

### <br>

| Variable      | Data Type | Required | Additional Validation                                              |
|---------------|-----------|----------|--------------------------------------------------------------------|
| firstname     | integer   | True     | No                                                                 |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "User Removed"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Get All Classes From User

[Back to the top](#user)

### /api/generic/get_all_classes_from_user

### Expected Request<br><br>

```json
{
    "user_id": "user id"
}
```

### <br>

| Variable | Data Type | Required | Additional Validation                                              |
|----------|-----------|----------|--------------------------------------------------------------------|
| user_id  | integer   | True     | No                                                                 |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "a list of all the class data for the user"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Get All Users

[Back to the top](#user)

### /api/generic/get_all_users

### Expected Request: /api/user/get_all_users?role_id=2<br><br>

### <br>

| Variable | Data Type | Required | Additional Validation                                              |
|----------|-----------|----------|--------------------------------------------------------------------|
| user_id  | integer   | False    | No                                                                 |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "a list of all of the users, filtered by role if role_id is provided"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```
