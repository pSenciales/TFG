from mongoengine import connect
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

def connectDB():
    connect(host=MONGO_URI)