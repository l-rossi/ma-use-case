from datetime import datetime, timezone

from sqlalchemy.orm import Mapped, mapped_column

from backend.di_container import container

db = container.db()

class RegulationFragment(db.Model):
    __tablename__ = 'regulation_fragments'
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<Regulation Fragment {self.title}>'


class AgenticLog(db.Model):
    __tablename__ = 'agentic_logs'
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    log_entry: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<AgenticLog {self.id} for User {self.user_id}>'


class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    regulation_fragment_id: Mapped[int] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    agent: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<ChatMessage {self.id} for User {self.user_id}>'
