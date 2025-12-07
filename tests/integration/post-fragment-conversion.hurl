POST http://localhost:8080/v1/fragments

Content-Type: text/plain

[BasicAuth]
user1@email.com:password1

`This is a fragment!`

HTTP/1.1 201

[Captures]
url: header "Location"
id: jsonpath "$.fragment.id"

GET http://localhost:8080/v1/fragments/{{id}}

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

GET http://localhost:8080/v1/fragments/{{id}}.html

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

GET http://localhost:8080/v1/fragments/{{id}}.jpg

[BasicAuth]
user1@email.com:password1

HTTP/1.1 415

POST http://localhost:8080/v1/fragments

Content-Type: image/png

[BasicAuth]
user1@email.com:password1

file,test.png;

HTTP/1.1 201

[Captures]
url2: header "Location"
id2: jsonpath "$.fragment.id"

GET {{url2}}

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200


GET http://localhost:8080/v1/fragments/{{id2}}.jpg

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

GET http://localhost:8080/v1/fragments/{{id2}}.txt

[BasicAuth]
user1@email.com:password1

HTTP/1.1 415