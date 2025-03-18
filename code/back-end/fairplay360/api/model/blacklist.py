from mongoengine import Document, StringField

class Blacklist(Document):
    email = StringField(primary_key=True)