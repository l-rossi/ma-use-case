"""Update LLM identifier enum

Revision ID: c45e7f8a9b12
Revises: b131c1b6e8c9
Create Date: 2025-07-18 14:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'c45e7f8a9b12'
down_revision: Union[str, Sequence[str], None] = 'b131c1b6e8c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create a new enum type with the updated values
    new_enum = postgresql.ENUM('GPT_3_5_TURBO', 'GPT_4o_MINI', 'SONNET_4', 'GEMINI_2_5_FLASH',
                              name='llmidentifier_new')
    new_enum.create(op.get_bind())

    # Update the column to use the new enum type
    # First, create a temporary column with the new enum type
    op.add_column('regulation_fragments', sa.Column('llm_identifier_new',
                                                  postgresql.ENUM('GPT_3_5_TURBO', 'GPT_4o_MINI', 'SONNET_4', 'GEMINI_2_5_FLASH',
                                                          name='llmidentifier_new'), nullable=True))
    
    # Copy data from old column to new column, mapping GEMINI_2_5 to GEMINI_2_5_FLASH
    op.execute("""
    UPDATE regulation_fragments 
    SET llm_identifier_new = CASE 
        WHEN llm_identifier = 'GEMINI_2_5' THEN 'GEMINI_2_5_FLASH'::llmidentifier_new 
        ELSE llm_identifier::text::llmidentifier_new 
    END
    """)
    
    # Drop the old column
    op.drop_column('regulation_fragments', 'llm_identifier')
    
    # Rename the new column to the original name
    op.alter_column('regulation_fragments', 'llm_identifier_new', new_column_name='llm_identifier', nullable=False)
    
    # Drop the old enum type
    op.execute('DROP TYPE llmidentifier')
    
    # Rename the new enum type to the original name
    op.execute('ALTER TYPE llmidentifier_new RENAME TO llmidentifier')


def downgrade() -> None:
    """Downgrade schema."""
    # Create a new enum type with the old values
    old_enum = postgresql.ENUM('GPT_3_5_TURBO', 'GPT_4o_MINI', 'SONNET_4', 'GEMINI_2_5',
                              name='llmidentifier_old')
    old_enum.create(op.get_bind())

    # Update the column to use the old enum type
    # First, create a temporary column with the old enum type
    op.add_column('regulation_fragments', sa.Column('llm_identifier_old',
                                                  postgresql.ENUM('GPT_3_5_TURBO', 'GPT_4o_MINI', 'SONNET_4', 'GEMINI_2_5',
                                                          name='llmidentifier_old'), nullable=True))
    
    # Copy data from new column to old column, mapping GEMINI_2_5_FLASH to GEMINI_2_5
    op.execute("""
    UPDATE regulation_fragments 
    SET llm_identifier_old = CASE 
        WHEN llm_identifier = 'GEMINI_2_5_FLASH' THEN 'GEMINI_2_5'::llmidentifier_old 
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