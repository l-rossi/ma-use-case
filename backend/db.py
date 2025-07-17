from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import declarative_base

Base = declarative_base()


def create_db():
    db = SQLAlchemy(model_class=Base)
    return db
