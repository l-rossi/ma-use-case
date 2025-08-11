from typing import List, Literal

from pydantic import BaseModel


# A single key value pair
class PrologResultDTO(BaseModel):
    variable: str
    value: str


# A set of key value pairs, representing a valid model
class PrologAnswerDTO(BaseModel):
    status: Literal["success", "failure", "error"]
    answers: List[PrologResultDTO]
    message: str = ""  # Optional message for additional context, e.g., error messages


class PrologHttpResponseDTO(BaseModel):
    status: Literal["success", "failure", "error"]
    answers: List[PrologAnswerDTO]
