from enum import Enum


class LLMIdentifier(str, Enum):
    """
    Enum representing different LLM identifiers.
    """
    GPT_3_5_TURBO = "GPT_3_5_TURBO"
    GPT_4o_MINI = "GPT_4o_MINI"
    GPT_5 = "GPT_5"
    GPT_5_MINI = "GPT_5_MINI"
    GPT_5_NANO = "GPT_5_NANO"
    SONNET_4 = "SONNET_4"
    GEMINI_2_5_FLASH = "GEMINI_2_5_FLASH"
