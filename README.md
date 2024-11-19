# Quiz App Backend

Welcome to the Quiz App Backend repository! This project powers the backend of the Quiz App, offering APIs for managing users, quizzes, questions, and authentication.

## Repository Link

[Quiz App Backend GitHub Repository](https://github.com/Tanmaydeep-Singh/Quiz-app-backend)

---

## API Routes

### **Authentication Routes**

Base URL: `/api/auth`

- **POST /register**  
  Register a new user.

- **POST /login**  
  Log in an existing user.

---

### **User Routes**

Base URL: `/api/users`

- **GET /profile**  
  Retrieve the profile of the currently logged-in user.

- **GET /quizzes-created**  
  Retrieve quizzes created by the user.

- **GET /quizzes-attempted**  
  Retrieve quizzes attempted by the user.

- **PUT /update-rank**  
  Update the user's rank based on quiz performance.

---

### **Question Routes**

Base URL: `/api/question`

- **GET /**  
  Retrieve all questions created by the logged-in user (protected).

- **POST /create**  
  Create a new question for a quiz (protected).

---

### **Quiz Routes**

Base URL: `/api/quizzes`

- **GET /**  
  Retrieve all available quizzes.

- **POST /create**  
  Create a new quiz (protected).

- **POST /start**  
  Start a quiz for a user (protected).

- **POST /:quizId/submit**  
  Submit answers for a quiz (protected).

- **GET /:quizId/leaderboard**  
  View the leaderboard for a specific quiz.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tanmaydeep-Singh/Quiz-app-backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Quiz-app-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the required variables:
   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_secret_key
   ```

5. Start the server:
   ```bash
   npm start
   ```

---

## Technologies Used

- **Node.js**: Backend runtime
- **Express.js**: Web framework
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Redis** (optional): Caching

---

## Contributing

Feel free to contribute to this project! Fork the repository and submit a pull request with detailed changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.


