import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from di_container import container
from modules.models.infra.agentic_log_controller import agentic_log_controller
from modules.atoms.infra.atom_controller import atom_controller
from modules.chat.infra.controllers.chat_controller import chat_controller
from modules.regulation_fragment.infra.regulation_fragment_controller import \
    regulation_fragment_controller
from modules.rules.infra.rule_controller import rule_controller

load_dotenv()

# Create and configure the app
app = Flask(__name__)
app.container = container
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
db = container.db()
CORS(app)
app.register_blueprint(agentic_log_controller)
app.register_blueprint(chat_controller)
app.register_blueprint(regulation_fragment_controller)
app.register_blueprint(atom_controller)
app.register_blueprint(rule_controller)

with app.app_context():
    # Import models to ensure they are registered with SQLAlchemy
    import db_models

    # This is literally just to my PyCharm happy :)
    _ = db_models
    db.init_app(app)

if __name__ == '__main__':
    app.run(debug=True)
