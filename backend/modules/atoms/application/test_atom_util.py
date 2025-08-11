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