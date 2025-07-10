import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from backend.di_container import container
from backend.modules.chat.infra.controllers.chat_controller import chat_controller
from backend.modules.regulation_fragment.infra.controllers.regulation_fragment_controller import \
    regulation_fragment_controller

load_dotenv()

if __name__ == '__main__':
    app = Flask(__name__)
    app.container = container
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    print("Database URI:", app.config["SQLALCHEMY_DATABASE_URI"])
    db = container.db()
    db.init_app(app)
    CORS(app)
    app.register_blueprint(chat_controller)
    app.register_blueprint(regulation_fragment_controller)

    with app.app_context():
        # Import models to ensure they are registered with SQLAlchemy
        import models

        # This is literally just to my PyCharm happy :)
        _ = models
        db.create_all()

    app.run(debug=True)
