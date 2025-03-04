from flask import Flask
from flask_cors import CORS
from db import connectDB
from routes import (user_bp, log_bp, report_bp, blacklist_bp)

connectDB()
app = Flask(__name__)

CORS(app)

app.register_blueprint(user_bp)
app.register_blueprint(report_bp)
app.register_blueprint(log_bp)
app.register_blueprint(blacklist_bp)


if __name__ == "__main__":
    app.run()
