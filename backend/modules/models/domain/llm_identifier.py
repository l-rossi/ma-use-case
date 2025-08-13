from dataclasses import dataclass
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


@dataclass
class LLMCost:
    # Dollars per 1M tokens
    input_cost: float
    output_cost: float


llm_costs: dict[LLMIdentifier, LLMCost] = {
    # Prices are in dollars per 1 million tokens
    LLMIdentifier.GPT_3_5_TURBO: LLMCost(0.5, 1.5),
    LLMIdentifier.GPT_4o_MINI: LLMCost(0.15, 0.60),
    LLMIdentifier.GPT_5: LLMCost(1.25, 10),
    LLMIdentifier.GPT_5_MINI: LLMCost(0.25, 2.00),
    LLMIdentifier.GPT_5_NANO: LLMCost(0.05, 0.40),
    LLMIdentifier.SONNET_4: LLMCost(3, 15),
    LLMIdentifier.GEMINI_2_5_FLASH: LLMCost(0.30, 2.50),
}

for v in LLMIdentifier:
    if v not in llm_costs:
        raise NotImplementedError(f"LLM cost for {v} is not implemented. Please add it to the llm_costs dictionary.")
