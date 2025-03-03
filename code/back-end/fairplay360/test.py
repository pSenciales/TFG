from datetime import datetime, UTC
from model import User, Report, Log, Blacklist, State, File
from db import connectDB

connectDB();

# Crear un usuario de prueba
user = User(name="Test User", email="test3@example.com")
user.set_password("1234")
user.save()
print(user.check_password("1234"))
# Crear un reporte de prueba
report = Report(
    content="Este es un reporte de prueba",
    state=State.Pending,
    source="https://example.com",
    is_hate=False,
    user_id=str(user.id)
)


# Agregar archivos al reporte
file1 = File(url="https://example.com/evidence1.jpg")
file2 = File(url="https://example.com/evidence2.jpg")

report.files = [file1, file2]

report.save()

print("✅ Datos de prueba creados con éxito")
