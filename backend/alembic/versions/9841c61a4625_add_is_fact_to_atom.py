"""add_is_fact_to_atom

Revision ID: 9841c61a4625
Revises: c08e348fd81d
Create Date: 2025-07-23 18:38:39.821958

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9841c61a4625'
down_revision: Union[str, Sequence[str], None] = 'c08e348fd81d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('atoms', sa.Column('is_fact', sa.Boolean(), nullable=False, server_default='false'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('atoms', 'is_fact')
