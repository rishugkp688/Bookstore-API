# Bookstore-API

# Bookstore API

A RESTful API for a Bookstore Application built with NestJS, TypeScript, and MongoDB.

## Features

-   User Authentication with JWT (Signup, Login, Protected Routes)
-   Book management (CRUD operations: Create, Read, Update, Delete)
-   Authorization: Only the creator of a book can update or delete it.
-   Search and filtering capabilities for books
-   Input validation using DTOs and Class-validator
-   Error handling with appropriate HTTP status codes

## Tech Stack

-   [NestJS](https://nestjs.com/): A TypeScript-based Node.js framework for building efficient and scalable server-side applications.
-   TypeScript: A strongly typed superset of JavaScript.
-   MongoDB: A NoSQL database.
-   Mongoose: MongoDB object modeling tool.
-   JSON Web Tokens (JWT): For secure user authentication.
-   bcrypt: For hashing user passwords.
-   class-validator and class-transformer: For data validation and transformation.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or later)
-   [npm](https://www.npmjs.com/)  (Node Package Manager) - usually comes with Node.js
-   [MongoDB](https://www.mongodb.com/) - You can install it locally or use a cloud-based service like [MongoDB Atlas](https://www.mongodb.com/atlas).

## Installation and Setup

1.  **Clone the repository:**

    ```
    git clone <repository-url>
    cd bookstore-api
    ```

2.  **Install dependencies:**

    ```
    npm install
    ```

3.  **Create a `.env` file:**

    * In the root directory of your project, create a file named `.env`.
    * Add the following environment variables:

        ```
        MONGODB_URI=mongodb://localhost:27017/bookstore # Or your MongoDB connection string
        JWT_SECRET=your_jwt_secret_key # Replace with a strong secret key
        ```

4.  **Run the application:**

    * **Development mode (with hot-reloading):**

        ```
        npm run start:dev
        ```

    * **Production mode:**

        ```
        npm run build
        npm run start:prod
        ```

## API Endpoints

### Authentication

-   **POST /auth/signup**

    * Register a new user.
    * Body:

        ```json
        {
          "email": "user@example.com",
          "password": "password123"
        }
        ```
    * Response:
        * Status Code: 201 Created
        * Body:
            ```json
            {
              "message": "User registered successfully"
            }
            ```
-   **POST /auth/login**

    * Authenticate a user and receive a JWT token.
    * Body:

        ```json
        {
          "email": "user@example.com",
          "password": "password123"
        }
        ```
    * Response:
        * Status Code: 200 OK
        * Body:

            ```json
            {
              "access_token": "YOUR_JWT_TOKEN"
            }
            ```

### Books API (All routes require authentication)

-   **POST /books**

    * Create a new book.
    * Headers:
        * `Authorization: Bearer YOUR_JWT_TOKEN`  (Replace  `YOUR_JWT_TOKEN`  with a valid JWT)
        * `Content-Type: application/json`
    * Body:

        ```json
        {
          "title": "The Great Gatsby",
          "author": "F. Scott Fitzgerald",
          "category": "Classic",
          "price": 15.99,
          "rating": 4.7,
          "publishedDate": "1925-04-10T00:00:00.000Z"
        }
        ```
    * Response:
        * Status Code: 201 Created
        * Body: The created book object.
-   **GET /books**

    * Get all books, with optional filtering.
    * Headers:
        * `Authorization: Bearer YOUR_JWT_TOKEN`
    * Query Parameters (Optional):
        * `title`:  `string`  (Search by title, partial and case-insensitive match)
        * `author`:  `string`  (Filter by author)
        * `category`:  `string`  (Filter by category)
        * `rating`:  `number`  (Filter by exact rating)
    * Response:
        * Status Code: 200 OK
        * Body: An array of book objects.
-   **GET /books/:id**

    * Get a book by ID.
    * Headers:
        * `Authorization: Bearer YOUR_JWT_TOKEN`
    * Response:
        * Status Code: 200 OK
        * Body: The book object with the specified ID.
-   **PUT /books/:id**

    * Update a book.  Only the user who created the book can update it.
    * Headers:
        * `Authorization: Bearer YOUR_JWT_TOKEN`
        * `Content-Type: application/json`
    * Body: (A JSON object containing the fields to update)

        ```json
        {
          "price": 24.99,
          "rating": 4.8
        }
        ```
    * Response:
        * Status Code: 200 OK
        * Body: The updated book object.
    * Error Responses:
        * 404 Not Found: If the book with the given ID doesn't exist.
        * 401 Unauthorized: If the user is not the creator of the book.
-   **DELETE /books/:id**

    * Delete a book. Only the user who created the book can delete it.
    * Headers:
        * `Authorization: Bearer YOUR_JWT_TOKEN`
    * Response:
        * Status Code: 200 OK
        * Body:
            ```json
            {
              "message": "Book successfully deleted"
            }
            ```
    * Error Responses:
        * 404 Not Found: If the book with the given ID doesn't exist.
        * 401 Unauthorized: If the user is not the creator of the book.

## API Testing Tutorial with Postman

[Postman](https://www.postman.com/) is a popular tool for testing APIs. Here's a quick tutorial on how to use it with this Bookstore API:

1.  **Install Postman:** Download and install Postman.
2.  **Important: Start Your API:** Make sure your NestJS server is running (`npm run start:dev`).
3.  **Authentication (Signup and Login):**
    * **Signup:**
        * Open Postman and create a new request.
        * Method: `POST`
        * URL:  `http://localhost:3000/auth/signup`
        * Headers:  `Content-Type: application/json`
        * Body:
            ```json
            {
              "email": "[email address removed]",
              "password": "securepass"
            }
            ```
        * Send the request. You should get a success message.
    * **Login:**
        * Create a new request.
        * Method: `POST`
        * URL:  `http://localhost:3000/auth/login`
        * Headers:  `Content-Type: application/json`
        * Body:
            ```json
            {
              "email": "[email address removed]",
              "password": "securepass"
            }
            ```
        * Send the request.
        * In the response, you'll receive an `access_token` (JWT).  Copy this token. You'll need it for the following requests.
4.  **Making Authenticated Requests (Books API):**
    * For any request to the `/books` endpoints, you need to include the JWT for authorization.
    * In Postman, go to the "Authorization" tab of your request.
    * Select "Bearer Token".
    * Paste the `access_token` you copied in the login step into the "Token" field.
5.  **Create a Book:**
    * Method: `POST`
    * URL:  `http://localhost:3000/books`
    * Headers:
        * `Content-Type: application/json`
        * `Authorization: Bearer YOUR_JWT_TOKEN`  (Replace with your token)
    * Body:
        ```json
        {
          "title": "A Fantastic Book",
          "author": "A. Author",
          "category": "Fantasy",
          "price": 12.50,
          "rating": 4,
          "publishedDate": "2024-01-20T00:00:00.000Z"
        }
        ```
    * Send the request.
6.  **Get All Books:**
    * Method: `GET`
    * URL:  `http://localhost:3000/books`
    * Headers:  `Authorization: Bearer YOUR_JWT_TOKEN`
    * Send the request.
7.  **Get a Book by ID:**
    * Method: `GET`
    * URL:  `http://localhost:3000/books/YOUR_BOOK_ID`  (Replace  `YOUR_BOOK_ID`  with an actual ID from your database)
    * Headers:  `Authorization: Bearer YOUR_JWT_TOKEN`
    * Send the request.
8.  **Update a Book:**
    * Method: `PUT`
    * URL:  `http://localhost:3000/books/YOUR_BOOK_ID`  (Replace  `YOUR_BOOK_ID`)
    * Headers:
        * `Content-Type: application/json`
        * `Authorization: Bearer YOUR_JWT_TOKEN`
    * Body:
        ```json
        {
          "price": 15.00
        }
        ```
    * Send the request.
9.  **Delete a Book:**
    * Method: `DELETE`
    * URL:  `http://localhost:3000/books/YOUR_BOOK_ID`  (Replace  `YOUR_BOOK_ID`)
    * Headers:  `Authorization: Bearer YOUR_JWT_TOKEN`
    * Send the request.
10. **Filtering Books:**
    * Method: `GET`
    * URL:  `http://localhost:3000/books`
    * Headers:  `Authorization: Bearer YOUR_JWT_TOKEN`
    * To filter, use the "Params" tab in Postman to add query parameters:
        * Example:  `http://localhost:3000/books?category=Fantasy&rating=4`
    * Send the request.

## Architecture

The application follows a modular architecture with the following components:

-   **Controllers:** Handle HTTP requests and responses.
-   **Services:** Implement business logic.
-   **DTOs (Data Transfer Objects):** Define the shape of data being sent and received, used for validation.
-   **Schemas:** Define the structure of MongoDB documents.
-   **Modules:** Organize related features (e.g., AuthModule, BooksModule).

## Assumptions

-   Email addresses are unique for user registration.
-   Book prices are in a single currency (no currency conversion).
-   Books can only have one category (no multi-category support).
-   Ratings are numeric values between 0 and 5.
-   Only the user who created a book can update or delete it.
