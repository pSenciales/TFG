from datetime import datetime, UTC
from enum import Enum
from mongoengine import Document, StringField, BooleanField, DateTimeField, URLField, EnumField, EmbeddedDocument, EmbeddedDocumentField, ListField


class State(Enum):
    Closed = "closed"
    Pending = "pending"
    Processing = "processing"


class File(EmbeddedDocument):
    url = URLField(required=True)

class Resolution(EmbeddedDocument):
    action = StringField(required=True)
    reason = StringField(required=True, default="")
    created_at = DateTimeField(default=lambda: datetime.now(UTC))
    user_id = StringField(required=True)


class Report(Document):
    content = StringField(required=True)
    state = EnumField(State, required=True, default=State.Processing)
    source = URLField(required=False)
    is_hate = BooleanField(required=True, default=False)
    created_at = DateTimeField(default=lambda: datetime.now(UTC))
    user_id = StringField(required=True)
    images = ListField(EmbeddedDocumentField(File), default=[])
    pdf = ListField(EmbeddedDocumentField(File), default=[])
    resolutions = ListField(EmbeddedDocumentField(Resolution), default=[])