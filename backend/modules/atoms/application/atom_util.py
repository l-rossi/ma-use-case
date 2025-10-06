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

import re
from typing import List, Tuple, Callable, Iterable, Generator

from modules.atoms.application.dto.atom_dto import AtomDTO
from modules.atoms.application.dto.atom_span_dto import AtomSpanDTO
from modules.atoms.application.dto.create_atom_span_dto import CreateAtomSpanDTO


def create_wildcard_predicates(predicate_str: str, index: int = 1,
                               wildcard_factory: Callable[[int], str] = lambda i: f"_X{i}") -> Tuple[str, int]:
    """
    Recursively replace variables in a Prolog predicate with wildcard variables.

    Args:
        predicate_str: The predicate string to process
        index: The current index for wildcard variables

    Returns:
        A tuple containing:
        - The processed predicate string with wildcard variables
        - The updated index for the next wildcard variable
    """
    # Find the outermost opening and closing brackets
    open_bracket_index = predicate_str.find('(')

    # If no brackets are found, this is a literal (variable)
    if open_bracket_index == -1:
        return wildcard_factory(index), index + 1

        # LLM Generated code, will keep for now as some merit, but cannot rely on predicates having capitalized first letter

        # # TODO not sure about this here. Though this is usually the case this is just convention I think
        # #  and might break. I do not see why I need to return predicate_str here in any case.
        # # In Prolog, variables start with uppercase letters
        # if predicate_str and predicate_str[0].isupper():
        #     return wildcard_factory(index), index + 1
        # else:
        #     # Return literals as they are
        #     return predicate_str, index

    # Extract the predicate name (prefix before the first opening bracket)
    predicate_name = predicate_str[:open_bracket_index]

    # The closing bracket should be at the end of the string
    close_bracket_index = predicate_str.rfind(')')

    if close_bracket_index == -1:
        raise ValueError(f"Missing closing bracket in predicate: {predicate_str}")

    # Extract the content between brackets
    content = predicate_str[open_bracket_index + 1:close_bracket_index]

    # Split the content by commas, but only if the comma is not inside nested brackets
    args = []
    current_arg = ""
    bracket_depth = 0

    for char in content:
        if char == '(':
            bracket_depth += 1
            current_arg += char
        elif char == ')':
            bracket_depth -= 1
            current_arg += char
        elif char == ',' and bracket_depth == 0:
            args.append(current_arg.strip())
            current_arg = ""
        else:
            current_arg += char

    if current_arg:
        args.append(current_arg.strip())

    # Process each argument recursively
    processed_args = []
    current_index = index

    for arg in args:
        processed_arg, current_index = create_wildcard_predicates(arg, current_index, wildcard_factory)
        processed_args.append(processed_arg)

    # Reconstruct the predicate with processed arguments
    return f"{predicate_name}({', '.join(processed_args)})", current_index


def mask_variables_in_atoms(atoms: Iterable[AtomDTO]) -> List[str]:
    """
    Convert a list of AtomDTO objects to Prolog predicates with wildcard variables.

    Args:
        atoms: List of AtomDTO objects

    Returns:
        List of Prolog predicates with wildcard variables
    """
    wildcard_atoms = []
    index = 1

    for atom in atoms:
        # Get the predicate from the atom
        predicate = atom.predicate

        # Process the predicate recursively
        wildcard_predicate, index = create_wildcard_predicates(predicate, index)

        # Add a period at the end to make it a valid Prolog statement
        wildcard_atoms.append(f"{wildcard_predicate}.")

    return wildcard_atoms


def determine_predicate_arity(predicate: str) -> int:
    """
    Count the number of variables in a Prolog predicate.

    Args:
        predicate: The predicate string to process (e.g., "test", "test(X)", "test(X, Y)")

    Returns:
        The number of variables in the predicate
    """
    # Check if the predicate has arguments (contains opening bracket)
    open_bracket_index = predicate.find('(')
    if open_bracket_index == -1:
        # No arguments
        return 0

    # Find the matching closing bracket
    close_bracket_index = predicate.rfind(')')
    if close_bracket_index == -1:
        raise ValueError(f"Missing closing bracket in predicate: {predicate}")

    # Extract the content between brackets
    content = predicate[open_bracket_index + 1:close_bracket_index]
    if not content:
        # Empty brackets: predicate()
        return 0

    # Split the content by commas, but only if the comma is not inside nested brackets
    args = []
    current_arg = ""
    bracket_depth = 0

    for char in content:
        if char == '(':
            bracket_depth += 1
            current_arg += char
        elif char == ')':
            bracket_depth -= 1
            current_arg += char
        elif char == ',' and bracket_depth == 0:
            args.append(current_arg.strip())
            current_arg = ""
        else:
            current_arg += char

    if current_arg:
        args.append(current_arg.strip())

    return len(args)


def atoms_to_dynamic_statement(atom: AtomDTO) -> str:
    if not atom.is_fact:
        return f"%:- dynamic {atom.predicate.split('(')[0]}/{determine_predicate_arity(atom.predicate)}. % {atom.predicate}; This is a derived predicate, not a fact."

    # We add the full
    return f":- dynamic {atom.predicate.split('(')[0]}/{determine_predicate_arity(atom.predicate)}. % {atom.predicate}"


def insert_atom_spans(text: str, atom_spans: list[AtomSpanDTO]) -> str:
    """
    Insert atom spans into the text at the specified positions.
    This function assumes that the atom spans are sorted by their start position.
    """
    print("insert_atom_spans called with text:", text)
    output_text = []
    atom_spans.sort(key=lambda x: x.start)

    last_end = 0
    for span in atom_spans:
        output_text.append(text[last_end:span.start])
        output_text.append(f'<atom id="{span.atom_id}">{text[span.start:span.end]}</atom>')
        last_end = span.end
    output_text.append(text[last_end:])
    print(output_text)
    return ''.join(output_text)


def find_atom_spans(text: str) -> Generator[CreateAtomSpanDTO, None]:
    pattern = r'<atom id="(\d+)">(.*?)<\/atom>'
    virtual_character_offset = 0

    for match in re.finditer(pattern, text, re.DOTALL):
        atom_id = int(match.group(1))

        match_start, match_end = match.span()
        content_start, content_end = match.span(2)

        content_len = content_end - content_start
        match_len = match_end - match_start

        yield CreateAtomSpanDTO(
            atom_id=atom_id,
            start=match_start - virtual_character_offset,
            end=match_start - virtual_character_offset + content_len,
        )

        virtual_character_offset += match_len - content_len
