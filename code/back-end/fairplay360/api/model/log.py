from datetime import datetime, UTC
from mongoengine import Document, StringField, DateTimeField

class Log(Document):
    action = StringField(required=True)
    created_at = DateTimeField(default=lambda: datetime.now(UTC))
    user_id = StringField(required=True)

