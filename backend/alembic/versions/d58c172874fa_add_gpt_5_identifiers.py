"""add_gpt_5_idenfiers

Revision ID: d58c172874fa
Revises: 9841c61a4625
Create Date: 2025-08-08 09:50:18.167168

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'd58c172874fa'
down_revision: Union[str, Sequence[str], None] = '9841c61a4625'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Use PostgreSQL 9.1+ ALTER TYPE to add a new value to the enum
    op.execute("ALTER TYPE llmidentifier ADD VALUE 'GPT_5'")
    op.execute("ALTER TYPE llmidentifier ADD VALUE 'GPT_5_MINI'")
    op.execute("ALTER TYPE llmidentifier ADD VALUE 'GPT_5_NANO'")


def downgrade() -> None:
    """Downgrade schema."""
    # Create a new enum type with the old values
    old_enum = postgresql.ENUM('GPT_3_5_TURBO', 'GPT_4o_MINI', 'SONNET_4', 'GEMINI_2_5_FLASH', 'GPT_5', 'GPT_5_MINI',
                              name='llmidentifier_old')
    old_enum.create(op.get_bind())

    # Update the column to use the old enum type
    # First, create a temporary column with the old enum type
    op.add_column('regulation_fragments', sa.Column('llm_identifier_old',
                                                  postgresql.ENUM('GPT_3_5_TURBO', 'GPT_4o_MINI', 'SONNET_4', 'GEMINI_2_5_FLASH', 'GPT_5', 'GPT_5_MINI',
                                                          name='llmidentifier_old'), nullable=True))

    # Copy data from new column to old column, mapping GPT_5_NANO to GPT_5_MINI
    op.execute("""
    UPDATE regulation_fragments 
    SET llm_identifier_old = CASE 
        WHEN llm_identifier = 'GPT_5_NANO' THEN 'GPT_5_MINI'::llmidentifier_old 
        ELSE llm_identifier::text::llmidentifier_old 
    END
    """)

    # Drop the new column
    op.drop_column('regulation_fragments', 'llm_identifier')

    # Rename the old column to the original name
    op.alter_column('regulation_fragments', 'llm_identifier_old', new_column_name='llm_identifier', nullable=False)

    # Drop the new enum type
    op.execute('DROP TYPE llmidentifier')

    # Rename the old enum type to the original name
    op.execute('ALTER TYPE llmidentifier_old RENAME TO llmidentifier')
