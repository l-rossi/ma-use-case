from enum import Enum


class Formalism(str, Enum):
    """
    Enum representing different formalisms for regulation fragments.
    """
    PROLOG = "PROLOG"