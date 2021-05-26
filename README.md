# Delilah Restó API

## Content
- [Delilah Restó API](#delilah-restó-api)
  - [Content](#content)
  - [Modules](#modules)
  - [Installation](#installation)
    - [Node](#node)
    - [DataBase](#database)
    - [JWT](#jwt)
  - [API](#api)
    - [Using local node server](#using-local-node-server)
      - [You can rub the api with command](#you-can-rub-the-api-with-command)
    - [Swagger](#swagger)
## Modules
- Express
- swagger-iu-express
- mongoose
- morgan

## Installation
### Node
```bash
npm install
```
### DataBase
1. Add env vars to the `.env` file
```
MONGODB=mongodb+srv://dbadmin:Q1w2e3r4t5@cluster0.wtsge.mongodb.net/DelilahResto?retryWrites=true&w=majority
```

2. Enter MongoDB and create a new database with the name of (`DelilahResto`).
Verify that the database was created correctly
### JWT
Add the secret word to `.env` file
```
JWT_SECRET=123456
```

## API
### Using local node server
#### You can rub the api with command
```bash
npm run dev
```
### Swagger
```bash
http://localhost:3000/api-docs/ 
```
- To use an admin example you can use these credentials:
```bash
user: admin
password: admin123
```
To access to restricted endpoint, use the login endpoint first, copy the JWT and click on Authorize option.