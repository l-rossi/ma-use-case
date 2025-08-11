import os
from typing import List, Literal, Tuple, Generator, Union, Dict

import requests
from dotenv import load_dotenv

from modules.reasoning.application.dto.prolog_result_dto import PrologResultDTO, PrologAnswerDTO

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

    def execute_prolog(self, knowledge_base: str, goal: str) -> Tuple[
        Literal["success", "failure", "error"], List[PrologAnswerDTO]]:
        # Step 1: Send initial query
        print(f"Sending request to {self.prolog_url}/pengine/create")
        print(f"Knowledge base: {knowledge_base}")
        print(f"Goal: {goal}")

        res = requests.post(f"{self.prolog_url}/pengine/create", json={
            "ask": goal,
            "src_text": knowledge_base,
            "application": "pengine_sandbox",
            "format": "json",
            # We cannot really handle many solutions anyways so just truncating at 1000 is good enough.
            "chunk": 1_000
        })
        print(f"Response status code: {res.status_code}")
        print(f"Response content: {res.text}")

        response_body = res.json()
        print(f"Response body: {response_body}")

        if not type(response_body) is list:
            response_body = [response_body]

        answers = list(
            answer  for res in response_body for answer in self._process_event(res)
        )

        is_error = any(
            answer.status == "error" for answer in answers
        )

        is_failure = any(
            answer.status == "failure" for answer in answers
        )

        if is_error:
            return "error", answers
        elif is_failure:
            return "failure", answers

        return "success", answers

    def _process_event(self, event: dict) -> Generator[PrologAnswerDTO, None]:
        event_type = event.get("event", None)
        if event_type is None:
            raise ValueError("Event does not contain 'event' key")

        if event_type == "create":
            yield from self._process_event(
                event.get("answer", {})
            )

        elif event_type == "destroy":
            # Currently we do not "save" destroy events,
            yield from self._process_event(
                event.get("data", {})
            )

        elif event_type == "success":
            answers: Union[List, None] = event.get("data", None)
            if answers is None:
                raise ValueError("Success event does not contain 'data' key")

            if not isinstance(answers, list):
                raise ValueError("Success event 'data' is not a list")

            for answer in answers:
                yield PrologAnswerDTO(
                    status="success",
                    answers=[PrologResultDTO(variable=k, value=v) for k, v in answer.items()]
                )

        elif event_type == "failure":
            yield PrologAnswerDTO(
                status="failure",
                answers=[]
            )

        elif event_type == "error":
            yield PrologAnswerDTO(
                status="error",
                answers=[],
                message=event.get("data")
            )

        elif event_type == "output":
            # Basically there should be no output normally, except if there is for example a syntax error.
            # We just dump the data into the answer and let the downstream task (LLM) figure out what to do with it.
            yield PrologAnswerDTO(
                status="error",
                answers=[],
                message=str(event.get("data"))
            )


        else:
            raise ValueError(f"Unknown event type: {event_type}")

    def execute_with_examples(self, facts: Dict[str, List[str]], rules: List[str], goal: str = None) -> Tuple[
        Literal["success", "failure", "error"], List[PrologAnswerDTO]]:
        """
        Execute a Prolog query with user-provided facts and rules.

        Args:
            facts: Dictionary mapping predicate templates to lists of values
            rules: List of Prolog rules
            goal: Optional goal to query (if not provided, will use a default goal)

        Returns:
            Tuple of status and answers
        """
        # Build the knowledge base
        knowledge_base = ""

        # Add rules
        for rule in rules:
            knowledge_base += rule + ".\n"

        # Add user-provided facts
        for predicate, values in facts.items():
            for value in values:
                # Extract variable name and replace it with the value
                # Find the variable name inside the parentheses
                var_match = predicate.split('(')[1].split(')')[0].strip()
                # Format the predicate with the value
                fact = predicate.replace(var_match, value)
                knowledge_base += fact + ".\n"

        # If no goal is provided, use a default goal that will show all possible violations
        if not goal:
            goal = "violation(X)"

        # Execute the query
        return self.execute_prolog(knowledge_base=knowledge_base, goal=goal)
