"""
Leveraging Legal Information Representation for Business Process Compliance
Copyright (C) 2025 Lukas Rossi (l.rossi@tum.de)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
"""

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
