POST http://localhost:8080/v1/fragments

Content-Type: application/json

[BasicAuth]
user1@email.com:password1

{
    "fragment": "This is a fragment"
}

HTTP/1.1 201


[Captures]
url: header "Location"

GET {{url}}

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json