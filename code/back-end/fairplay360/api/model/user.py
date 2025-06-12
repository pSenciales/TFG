import bcrypt
from datetime import datetime, UTC
from mongoengine import Document, StringField, EmailField, BooleanField, DateTimeField, EmbeddedDocumentField, \
    EmbeddedDocument


class Token(EmbeddedDocument):
    access_token = StringField(primary_key=True)
    created_at = DateTimeField(default=lambda: datetime.now(UTC))


class User(Document):
    name = StringField(required=True, max_length=100)
    email = EmailField(required=True)
    provider = StringField(
        required=True,
        choices=["google", "github", "credentials"],
        default="credentials"
    )
    password = StringField(required=False)
    is_admin = BooleanField(default=False)
    is_active = BooleanField(default=True)
    access_token = EmbeddedDocumentField(Token, required=False)
    created_at = DateTimeField(default=lambda: datetime.now(UTC))

    meta = {
        "indexes": [
            {
                "fields": ["email", "provider"],
                "unique": True,
                "partialFilterExpression": {"is_active": True},
            }
        ]
    }

    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, raw_password):
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.password.encode('utf-8'))

    def set_inactive(self):
        self.is_active = False