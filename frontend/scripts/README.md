# TypeScript Type Generation

This directory contains scripts for generating TypeScript type definitions from Python Pydantic models.

## generate-types.js

This script automatically generates TypeScript interfaces from Pydantic models defined in the backend.

### What it does

1. Detects the operating system (Windows or Unix-like)
2. Activates the Python virtual environment appropriate for the detected OS
3. Runs the `pydantic2ts` command to generate TypeScript types from the Pydantic models
4. Outputs the generated types to `frontend/generated/types.ts`

### Usage

The script is automatically run as part of the `npm install` process via the `postinstall` script in `package.json`.

You can also run it manually:

```bash
npm run generate-types
```

### Requirements

- Node.js
- Python virtual environment set up in `backend/.venv`
- `pydantic-to-typescript` Python package installed in the virtual environment
- `json-schema-to-typescript` npm package installed in the frontend

### Troubleshooting

If you encounter issues:

1. Make sure the Python virtual environment exists at `backend/.venv`
2. Ensure `pydantic-to-typescript` is installed in the virtual environment:
   ```bash
   # Activate the virtual environment first
   pip install pydantic-to-typescript
   ```
3. Check that `json-schema-to-typescript` is installed in the frontend:
   ```bash
   npm install --save-dev json-schema-to-typescript
   ```
4. Verify that `backend/exported_types.py` exists and contains the proper imports