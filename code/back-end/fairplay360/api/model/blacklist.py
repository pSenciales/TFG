from mongoengine import Document, StringField, DateTimeField
from datetime import datetime, UTC

class Blacklist(Document):
    email = StringField(primary_key=True)
    created_at = DateTimeField(default=lambda: datetime.now(UTC))
