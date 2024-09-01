# Multi-Step Registration and Verification System

This project is a comprehensive registration and verification system built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Next.js and TypeScript for the frontend.

## Features

- Multi-step registration process
- User authentication
- Mobile number verification using Firebase
- Email verification using Nodemailer
- Aadhaar card verification
- PAN card verification
- Bank account verification
- GST verification
- Pincode validation

## Tech Stack

### Frontend
- Next.js
- TypeScript
- React.js

### Backend
- Node.js
- Express.js
- MongoDB

### Authentication & Verification
- Firebase (for mobile verification)
- Nodemailer (for email verification)

## Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. Install dependencies for both frontend and backend
   ```
   cd frontend
   npm install

   cd ../backend
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the backend directory
   - Add necessary environment variables (MongoDB URI, Firebase config, email service credentials, etc.)

4. Run the application
   ```
   # Start the backend server
   cd backend
   npm start

   # In a new terminal, start the frontend
   cd frontend
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Start with the registration process by entering your name and date of birth
3. Follow the subsequent steps for mobile verification, email verification, and other document validations

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
