import os
import sys
from flask import Flask

# Add the current directory to the path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import create_db
from modules.rules.application.dto.create_rule_dto import CreateRuleDTO
from modules.rules.infra.rule_repository import RuleRepository

# Create a Flask app and configure it
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:6543/db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = create_db()
db.init_app(app)

# Test function
def test_rule_goal_flag():
    with app.app_context():
        # Create a repository
        rule_repository = RuleRepository(db)
        
        # Create a test rule with is_goal=False
        regular_rule = rule_repository.save(
            CreateRuleDTO(
                regulation_fragment_id=1,  # Assuming this ID exists
                description="Test regular rule",
                definition="test_rule(X) :- condition(X).",
                is_goal=False
            )
        )
        print(f"Created regular rule with ID {regular_rule.id}, is_goal={regular_rule.is_goal}")
        
        # Create a test rule with is_goal=True
        goal_rule = rule_repository.save(
            CreateRuleDTO(
                regulation_fragment_id=1,  # Assuming this ID exists
                description="Test goal rule",
                definition="violation(test, X) :- condition(X), not allowed(X).",
                is_goal=True
            )
        )
        print(f"Created goal rule with ID {goal_rule.id}, is_goal={goal_rule.is_goal}")
        
        # Retrieve the rules and verify the is_goal flag
        retrieved_regular_rule = rule_repository.find_by_id(regular_rule.id)
        retrieved_goal_rule = rule_repository.find_by_id(goal_rule.id)
        
        print(f"Retrieved regular rule: is_goal={retrieved_regular_rule.is_goal}")
        print(f"Retrieved goal rule: is_goal={retrieved_goal_rule.is_goal}")
        
        # Clean up
        rule_repository.delete_by_id(regular_rule.id)
        rule_repository.delete_by_id(goal_rule.id)
        print("Test rules deleted")

if __name__ == "__main__":
    test_rule_goal_flag()