from enum import Enum


class MessageSource(Enum):
    SYSTEM_PROMPT = "SYSTEM"
    USER_PROMPT = "USER"
    MODEL_RESPONSE = "MODEL"