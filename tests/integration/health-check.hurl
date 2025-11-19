GET http://localhost:8080

HTTP/1.1 200

Cache-Control: no-cache

# Extra checks to perform against the response
[Asserts]
# We expect to get back a JSON response with { "status": "ok", ... }
jsonpath "$.status" == "ok"
# We expect to get back a JSON response with { ..., "author": "..." }
jsonpath "$.author" isString
# We expect to get back a JSON response with { ..., "githubUrl": "..." }
jsonpath "$.githubUrl" matches /^https:\/\/github.com\/.+/
# We expect to get back a JSON response with { ..., "version": "x.y.z" }
jsonpath "$.version" matches /^\d+\.\d+\.\d+$/