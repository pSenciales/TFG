import bcrypt
from datetime import datetime, UTC
from mongoengine import Document, StringField, EmailField, BooleanField, DateTimeField

class User(Document):
    name = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)
    password = StringField(required=False)
    is_admin = BooleanField(default=False)
    created_at = DateTimeField(default=lambda: datetime.now(UTC))

    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, raw_password):
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.password.encode('utf-8'))