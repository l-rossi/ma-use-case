from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


def create_db():
    db = SQLAlchemy(model_class=Base)
    return db
