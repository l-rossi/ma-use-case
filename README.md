# MA Use Case

## TODOs
-	Write logs to file of user interactions.
-	ReadME: Add User instructions


Take more notes:
-	For example security of Prolog
-	LLM comes up with stuff, also has too much general knowledge
-	Talk about UI/UX 


## How to Run

### Using Docker Compose

You can quickly run the entire application stack using Docker Compose:

1. Set the following environment variables on your system or create a `.env` file in `/deployment` with the following
   variables
   set:
    - `OPENAI_API_KEY` - [Get your API key from OpenAI](https://platform.openai.com/api-keys)
    - `ANTHROPIC_API_KEY` - [Get your API key from Anthropic](https://console.anthropic.com/settings/keys)
    - `GOOGLE_API_KEY` - [Get your API key from Google Cloud Console](https://console.cloud.google.com/apis/credentials)
    - `GOOGLE_PROJECT_ID` - [Find your Project ID in Google Cloud Console](https://console.cloud.google.com/welcome)

2. Run the following command from the project root:
   ```
   docker compose -f ./deployment/services.yml up
   ```

(You might want to add a project name with the `-p` for recognizing the containers later)

3. Access the application:
   A web server should now run at [http://localhost:3000](http://localhost:3000)
   (The backend will also be exposed at port 5000)

### For Development

- Run Node 22 And Python 3.13. Newer may work, but are not tested.
    - I can recommend [nvm](https://github.com/nvm-sh/nvm) for managing node versions
    - For python, [pyenv](https://github.com/pyenv/pyenv) should work though I have not tested it. After the venv is
      created (by running the venv module using the correct python version) everything should be set though.
- Spin up the Postgres and SWI-Prolog services.
- You will need to setup the backend first as the frontend depends on it for type generation.

#### Backend

Create a venv environment and install the dependencies (From within the `backend` directory):

Unix:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Windows:

```bash
python -m venv venv
venv\Scripts\Activate
```

_Important_:
The name of the virtual environment must be `.venv` for the type generation script to work correctly.

Install the dependencies:

```bash
pip install -r requirements.txt
```

Run the backend:

Windows:

```bash
python app.py
```

Unix:

```bash
python3 app.py
```

With a running database you can now make sure all migrations are applied:

```bash
alembic upgrade head
```

#### Frontend

From inside the `frontend` directory, run the following commands:

Install dependencies and generate types:

```bash
npm i
```

Run the Next.js development server:

```bash
npm run dev
```

## Project Overview
