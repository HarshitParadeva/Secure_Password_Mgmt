import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="4459",  
        database="password_manager"
    )
    print("✅ Connected to MySQL successfully!")
    conn.close()
except mysql.connector.Error as err:
    print("❌ Connection failed:", err)
