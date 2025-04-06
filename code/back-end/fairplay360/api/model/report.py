from datetime import datetime, UTC
from mongoengine import Document, StringField, BooleanField, DateTimeField, URLField, EnumField, EmbeddedDocument, EmbeddedDocumentField, ListField



class File(EmbeddedDocument):
    url = URLField(required=True)

class Resolution(EmbeddedDocument):
    action = StringField(required=True)
    reason = StringField(required=True, default="")
    created_at = DateTimeField(default=lambda: datetime.now(UTC))
    user_id = StringField(required=True)

class Report(Document):
    content = StringField(required=True)
    context = StringField(required=False)
    state = StringField(
        required=True,
        choices=["rejected", "accepted", "processing"],
        default="processing"
    )
    source = URLField(required=True)
    is_hate = BooleanField(required=True, default=False)
    created_at = DateTimeField(default=lambda: datetime.now(UTC))
    user_id = StringField(required=False)
    notification_email = StringField(required=True)
    images = ListField(EmbeddedDocumentField(File), default=[])
    pdf = ListField(EmbeddedDocumentField(File), default=[])
    resolutions = ListField(EmbeddedDocumentField(Resolution), default=[])
