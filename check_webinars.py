import mysql.connector
import json

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="demo"
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, title, status, registration_required, registration_url, webinar_date FROM webinars")
    rows = cursor.fetchall()
    print("Webinars found:")
    for row in rows:
        print(row)
    cursor.close()
    conn.close()
except Exception as e:
    print("Error:", e)
