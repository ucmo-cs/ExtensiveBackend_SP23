[Back to main](../README.md)

# Seating

[Add Chairs To Seating Arrangement](#add-chairs-to-seating-arrangement)<br>
[Remove Chairs From Seating Arrangement](#remove-chairs-from-seating-arrangement)<br>
[Get Student From Chair](#get-student-from-chair)<br>
<br><br>

## Add Chairs To Seating Arrangement

[Back to the top](#seating)

### /api/seating/add_chairs_to_seating_arrangement

### Example Request<br><br>

```json
{
    "class_id": 6,
    "arrangement": [{
        "x": 10,
        "y": 30,
        "student_id": 2
    },
    {
        "x": 23,
        "y": 21,
        "student_id": 3
    }]
}
```

### <br>

| Variable    | Data Type        | Required | Additional Validation |
|-------------|------------------|----------|-----------------------|
| class_id    | integer          | Yes      | No                    |
| arrangement | array of objects | Yes      | No                    |

### Object inside of arrangement

| Variable   | Data Type | Required | Additional Validation |
|------------|-----------|----------|-----------------------|
| x          | integer   | Yes      | No                    |
| y          | integer   | Yes      | No                    |
| student_id | integer   | Yes      | No                    |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "Chairs added"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Remove Chairs From Seating Arrangement

[Back to the top](#seating)

### /api/seating/remove_chair_from_seating_arrangement

### Example Request<br><br>

```json
{
    "chair_ids": [3, 4]
}
```

### <br>

| Variable  | Data Type         | Required | Additional Validation                                              |
|-----------|-------------------|----------|--------------------------------------------------------------------|
| chair_ids | array of integers | True     | No                                                                 |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "Chairs Removed"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```

## Get Student From Chair

[Back to the top](#seating)

### /api/seating/get_student_from_chair

### Example Request:<br>

#### /api/seating/get_student_from_chair?chair_id=3

<br>

| Variable | Data Type | Required | Additional Validation                                              |
|----------|-----------|----------|--------------------------------------------------------------------|
| chair_id | integer   | True     | No                                                                 |

### <br>Expected Response:<br>

#### Healthy Call

```json 
{
    "message": "Student information pertaining to that chair"
}
```

#### Unhealthy Call

```json 
{
    "error": "error message"
}
```
