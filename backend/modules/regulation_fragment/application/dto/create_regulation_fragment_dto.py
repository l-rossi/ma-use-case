from pydantic import BaseModel


class CreateRegulationFragmentDTO(BaseModel):
    title: str
    content: str
    llm_identifier: str
