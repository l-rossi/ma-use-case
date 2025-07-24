import os
from typing import List, Optional, Literal, Tuple

import requests
from dotenv import load_dotenv

from modules.reasoning.prolog_result_dto import PrologResultDTO

# Load environment variables
load_dotenv()


class PrologReasoner:
    """
    A reasoner that executes Prolog code using an HTTP connection to a Prolog engine.
    This reasoner does not inherit from SymbolicReasoner.
    """

    def __init__(self):
        """
        Initialize the PrologReasoner with the URL of the Prolog engine.
        The URL is read from the SWI_PROLOG_URL environment variable.
        """
        self.prolog_url = os.getenv("SWI_PROLOG_URL")
        if not self.prolog_url:
            raise ValueError("SWI_PROLOG_URL environment variable is not set")

    def execute_prolog(self, knowledge_base: str, goal: str) -> Tuple[Literal["success", "failure", "error"], List[PrologResultDTO]]:
        # Step 1: Send initial query
        print(f"Sending request to {self.prolog_url}/pengine/create")
        print(f"Knowledge base: {knowledge_base}")
        print(f"Goal: {goal}")

        try:
            res = requests.post(f"{self.prolog_url}/pengine/create", json={
                "ask": goal,
                "src_text": knowledge_base,
                "application": "pengine_sandbox",
                "format": "json",
                "chunks": 1_000
            })
            print(f"Response status code: {res.status_code}")
            print(f"Response content: {res.text}")

            response_body = res.json()
            print(f"Response body: {response_body}")

            answer = response_body.get("answer", None)
            if answer is None:
                print("No answer found in the Prolog response")
                raise ValueError("No answer found in the Prolog response")

            data = answer
            print(f"Data: {data}")

            # success, found a solution,
            # failure, no solution found,
            # error, something went wrong
            terminal_events = ["success", "failure", "error"]
            while data is not None and data.get("event", None) not in terminal_events:
                print(f"Event: {data.get('event', None)}, not in terminal events, getting next data")
                data = data.get("data", None)
                print(f"Next data: {data}")

            if data is None:
                print("Data is None, invalid Prolog response format")
                raise ValueError("Invalid Prolog response format")
        except Exception as e:
            print(f"Exception: {e}")
            raise

        if data.get("event") == "failure":
            return "failure", []

        if data.get("event") == "error":
            # Yes this is a bit hacky, but I am not too good with Python typing.
            # Not sure how to return discriminatory unions here
            return "error", [
                PrologResultDTO(
                    variable="error",
                    value=str(data.get("data", {}))
                )
            ]

        if data.get("event") == "success":
            results = []
            for d in data.get("data", []):
                for var, val in d.items():
                    results.append(PrologResultDTO(
                        variable=var,
                        value=val
                    ))
            return "success", results

        raise ValueError(f"Unexpected Prolog response event: {data.get('event')}")
