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

import unittest
from modules.atoms.application.atom_util import determine_predicate_arity


class TestAtomUtil(unittest.TestCase):
    """
    Test cases for atom_util.py functions, specifically count_variables_in_predicate.
    """

    def test_count_variables_in_predicate(self):
        """Test counting variables in Prolog predicates."""
        # Test cases from the issue description
        self.assertEqual(determine_predicate_arity("test"), 0)
        self.assertEqual(determine_predicate_arity("text(X)"), 1)
        self.assertEqual(determine_predicate_arity("test(X, X)"), 2)
        self.assertEqual(determine_predicate_arity("test(X, Y)"), 2)
        
        # Additional test cases
        self.assertEqual(determine_predicate_arity("complex_predicate(X, Y, Z)"), 3)
        self.assertEqual(determine_predicate_arity("nested(X, nested2(Y, Z))"), 2)
        self.assertEqual(determine_predicate_arity("empty()"), 0)


if __name__ == "__main__":
    unittest.main()