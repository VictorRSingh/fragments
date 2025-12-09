POST http://localhost:8080/v1/fragments

Content-Type: text/plain

[BasicAuth]
user1@email.com:password1

`This is a fragment`

HTTP/1.1 201

[Captures]
url: header "Location"
id: jsonpath "$.fragment.id"

GET {{url}}

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

PUT {{url}}

Content-Type: text/plain

[BasicAuth]
user1@email.com:password1

`This is a fragment updated`

HTTP/1.1 200

GET {{url}}

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
body == "This is a fragment updated"