# Development Guidelines for MA-Use-Case Project

This document provides specific guidelines for developing and maintaining this project.

## Project Structure

### Backend Structure

The backend follows a modular architecture with a clean/hexagonal architecture pattern:

```
backend/
├── .venv/                  # Python virtual environment
├── infra/                  # Infrastructure-related code
├── modules/                # Application modules
│   ├── atoms/              # Example module
│   │   ├── application/    # Application services, DTOs, use cases
│   │   │   ├── dto/        # Data Transfer Objects
│   │   ├── domain/         # Domain models and business logic
│   │   ├── infra/          # Infrastructure layer (repositories, external services)
├── prompts/                # AI/LLM prompts
├── app.py                  # Main application entry point
├── db.py                   # Database configuration
├── db_models.py            # SQLAlchemy models
├── di_container.py         # Dependency injection container
├── exported_types.py       # Types to be exported to frontend
├── requirements.txt        # Python dependencies
```

### Frontend Structure

The frontend is a Next.js application with the following structure:

```
frontend/
├── .next/                  # Next.js build directory
├── generated/              # Generated files (including TypeScript types)
├── node_modules/           # Node.js dependencies
├── public/                 # Static assets
├── scripts/                # Utility scripts
│   ├── generate-dto-types.js   # Script to generate TypeScript types from backend DTOs
├── src/                    # Source code
│   ├── api/                # API client code
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and libraries
```

## Build and Configuration Instructions

### Backend Setup

1. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate.bat
   
   # Unix/macOS
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables by copying `.env.example` to `.env` and updating the values.

4. Run the application:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```
   
   Note: The `postinstall` script will automatically generate TypeScript types from the backend DTOs.

2. Configure environment variables by updating the `.env` file.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## DTO Creation Process

DTOs (Data Transfer Objects) are used to define the data structures for API requests and responses. The process for adding a new DTO is as follows:

1. Create a new Pydantic model in the appropriate module's `application/dto` directory:
   ```python
   from pydantic import BaseModel
   
   class MyNewDTO(BaseModel):
       id: int
       name: str
       description: str
   ```

2. Import and add the new DTO to `exported_types.py` in the backend root:
   ```python
   from .modules.my_module.application.dto.my_new_dto import MyNewDTO
   ```

3. Run the type generation script to update the frontend types:
   ```bash
   # From the frontend directory
   npm run generate-types
   ```
   
   Alternatively, you can run `npm install` which will trigger the `postinstall` script that includes type generation.

4. Use the generated TypeScript interface in your frontend code:
   ```typescript
   import { MyNewDTO } from '@/generated/types';
   
   async function fetchMyData(): Promise<MyNewDTO> {
     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/my-endpoint`);
     if (!res.ok) {
       throw new Error('Failed to fetch data');
     }
     return await res.json();
   }
   ```

## Code Style and Development Guidelines

- **Backend**:
  - Follow the clean/hexagonal architecture pattern with clear separation between application, domain, and infrastructure layers.
  - Use Pydantic for data validation and serialization.
  - Use dependency injection for managing dependencies.
  - Document public functions and classes with docstrings.

- **Frontend**:
  - Use TypeScript for type safety.
  - Follow the Next.js App Router pattern for routing.
  - Use React Query for data fetching and state management.
  - Use the generated TypeScript types for API requests and responses.
  - Follow the ESLint and Prettier configurations for code formatting.