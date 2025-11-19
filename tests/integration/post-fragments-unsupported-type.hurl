POST http://localhost:8080/v1/fragments
Content-Type: multipart/form-data

[BasicAuth]
user1@email.com:password1

[MultipartFormData]
username: user1
password: password1

HTTP/1.1 415