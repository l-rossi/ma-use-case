# MA Use Case

A full-stack application with a Next.js frontend and Flask backend.

## Project Structure

- `frontend/`: Next.js application with App Router, Tailwind CSS, and TanStack Query
- `backend/`: Flask API

## Frontend Setup

TODO

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file based on `.env.example` and add your OpenAI API key.

6. Run the Flask application:
   ```
   flask run
   ```

7. The API will be available at [http://localhost:5000](http://localhost:5000).

## Technologies Used

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query
- RadixUI/Shadcn (to be implemented)

### Backend
- Flask
- OpenAI SDK
- Python-dotenv for environment management
