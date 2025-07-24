# MA Use Case

Optimizing 

## Project Overview



## Project Structure

- `frontend/`: Next.js application with App Router, Tailwind CSS, and TanStack Query
- `backend/`: Flask API with LLM integration for requirement extraction

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (the name is important):
   ```
   python -m venv .venv
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


## Frontend Setup

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

## Technologies Used

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query
- RadixUI/Shadcn UI components

### Backend
- Flask
- OpenAI SDK for LLM integration
- Python-dotenv for environment management
- Pydantic for data validation and serialization

## Use Case: Optimizing Formal Requirements Extraction

This project demonstrates how large language models can be used to extract formal requirements from regulatory texts in a way that enhances human understanding. Traditional formal requirement extraction often results in highly technical specifications that are difficult for non-specialists to comprehend.

By using a combination of natural language processing techniques and interactive visualization:

1. **Contextual Understanding**: Requirements are presented within their original context, with visual highlighting to show the relationship between formal predicates and source text.

2. **Iterative Refinement**: Users can provide feedback to regenerate and improve the extracted requirements, creating a human-in-the-loop system that continuously enhances accuracy and understandability.

3. **Structured Representation**: Complex regulatory texts are broken down into atomic predicates that capture individual requirements in a more digestible format.

This approach bridges the gap between formal specification and human comprehension, making regulatory compliance more accessible and manageable.
