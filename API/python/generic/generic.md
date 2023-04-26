[Back to main](../README.md)

# Generic

[Login](#login)<br>
[Email User](#email-user)<br>
<br><br>

## Login

[Back to the top](#generic)

### /api/generic/login

### Expected Request <br><br>/api/generic/login?username=USERNAME&password=PASSWORD<br>

| Variable | Data Type | Required | Additional Validation |
|----------|-----------|----------|-----------------------|
| username | string    | True     | No                    |
| password | string    | True     | No                    |   

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "True|False"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Email User

[Back to the top](#generic)

### /api/generic/email_user

### Expected Request<br><br>

```json
{
    "email_to": "Array containing user ids",
    "email_subject": "Subject of the email",
    "email_body": "Body of the email"
}
```

### <br>

| Variable      | Data Type         | Required | Additional Validation |
|---------------|-------------------|----------|-----------------------|
| email_to      | array of integers | True     | No                    |
| email_subject | string            | True     | No                    |
| email_body    | string            | True     | No                    |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "Email Sent"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```