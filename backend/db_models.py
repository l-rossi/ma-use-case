from datetime import datetime, timezone
from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from modules.models.domain.message_source import MessageSource

from db import Base


class RegulationFragment(Base):
    __tablename__ = 'regulation_fragments'
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    agentic_logs: Mapped[List["AgenticLog"]] = relationship(back_populates="regulation_fragment", cascade="all, delete-orphan")
    chat_messages: Mapped[List["ChatMessage"]] = relationship(back_populates="regulation_fragment", cascade="all, delete-orphan")
    atoms: Mapped[List["Atom"]] = relationship(back_populates="regulation_fragment", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Regulation Fragment {self.title}>'


class AgenticLog(Base):
    __tablename__ = 'agentic_logs'
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    log_entry: Mapped[str] = mapped_column(nullable=False)
    message_source: Mapped[MessageSource] = mapped_column(nullable=False)
    regulation_fragment_id: Mapped[int] = mapped_column(ForeignKey("regulation_fragments.id", ondelete='CASCADE'), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    regulation_fragment: Mapped["RegulationFragment"] = relationship(back_populates="agentic_logs")

    def __repr__(self):
        return f'<AgenticLog {self.id} for Fragment {self.regulation_fragment_id}>'


class ChatMessage(Base):
    __tablename__ = 'chat_messages'
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    regulation_fragment_id: Mapped[int] = mapped_column(ForeignKey("regulation_fragments.id", ondelete='CASCADE'), nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    agent: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    regulation_fragment: Mapped["RegulationFragment"] = relationship(back_populates="chat_messages")

    def __repr__(self):
        return f'<ChatMessage {self.id} for Fragment {self.regulation_fragment_id}>'


class Atom(Base):
    __tablename__ = 'atoms'
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    regulation_fragment_id: Mapped[int] = mapped_column(ForeignKey("regulation_fragments.id", ondelete='CASCADE'), nullable=False)
    predicate: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    is_negated: Mapped[bool] = mapped_column(default=False)
    spans: Mapped[List["AtomSpan"]] = relationship(back_populates="atom", lazy="selectin", cascade="all, delete-orphan")
    regulation_fragment: Mapped["RegulationFragment"] = relationship(back_populates="atoms")

    def __repr__(self):
        return f'<Atom {self.predicate} in Fragment {self.regulation_fragment_id}>'


class AtomSpan(Base):
    __tablename__ = 'atom_spans'
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    atom_id: Mapped[int] = mapped_column(ForeignKey("atoms.id", ondelete='CASCADE'), nullable=False)
    atom: Mapped["Atom"] = relationship(back_populates="spans")
    start: Mapped[int] = mapped_column(nullable=False)
    end: Mapped[int] = mapped_column(nullable=False)

    def __repr__(self):
        return f'<AtomSpan {self.id} for Atom {self.atom_id}>'
