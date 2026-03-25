# Fragments API

A production-ready cloud microservice for storing, retrieving, and converting small pieces of data (“fragments”). This project was built as part of a **Cloud Computing for Programmers** course and demonstrates modern cloud development practices including containerization, CI/CD, cloud deployment, and secure authentication.

---

## Overview

The **Fragments API** allows authenticated users to create, read, update, delete, and convert fragments of data such as:

- Plain text  
- JSON  
- Markdown  
- HTML  
- Images (PNG / JPEG)  
- Binary data  

Each fragment is stored securely and can be retrieved in its original format or converted into another supported format.

This project focuses on building a **production-style microservice**, not just a local API.

---

## Features

- RESTful API built with **Node.js**
- Authentication using **Amazon Cognito**
- Containerized using **Docker**
- CI pipeline with **GitHub Actions**
- Deployable to **AWS EC2 / ECS**
- Secure environment-based configuration
- Supports multiple content types
- Fragment conversion (e.g. Markdown → HTML, Text → JSON)
- Fully testable locally using Docker

---

## Tech Stack

### Backend
- Node.js
- Express
- REST API architecture

### Cloud / DevOps
- AWS (Cognito, EC2, S3, DynamoDB)
- Docker
- GitHub Actions (CI/CD)
- Environment variables
- Linux / Amazon Linux

### Testing
- Unit tests
- CI workflow validation
- Local container testing

# How to use

Run the any of the following commands to start the server

```
npm start

```

This will allow you to run the server on localhost:8080 and be able to receive requests on the API

```

npm run dev

```

This will run the server in dev mode using the --watch flag to allow the server to restart automatically on file saves.

```

npm run debug

```

This will allow you run the server in debug mode, similar to npm run dev, this will use the flags --watch and --inspect. Attach in VSCode to be able to set breakpoints.
