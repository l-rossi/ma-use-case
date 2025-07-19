from enum import Enum


class LLMIdentifier(str, Enum):
    """
    Enum representing different LLM identifiers.
    """
    GPT_3_5_TURBO = "GPT_3_5_TURBO"
    GPT_4o_MINI = "GPT_4o_MINI"
    SONNET_4 = "SONNET_4"
    GEMINI_2_5_FLASH = "GEMINI_2_5_FLASH"