from pydantic import BaseModel


class PriceDTO(BaseModel):
    price: float

    class Config:
        extra = "forbid"