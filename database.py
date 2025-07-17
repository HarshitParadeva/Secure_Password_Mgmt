import mysql.connector
from encryption import encrypt_password, decrypt_password

# -------------------------------
# Database Connection Helper
# -------------------------------
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="4459",
        database="password_manager"
    )

# -------------------------------
# Store Encrypted Password
# -------------------------------
def store_password(username, site_name, site_username, plain_password):
    encrypted = encrypt_password(plain_password)
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO saved_passwords (username, site_name, site_username, encrypted_password)
            VALUES (%s, %s, %s, %s)
        """, (username, site_name, site_username, encrypted))
        conn.commit()
    except Exception as e:
        print("❌ DB Insert Error:", e)
    finally:
        cursor.close()
        conn.close()

# -------------------------------
# Fetch and Decrypt Passwords
# -------------------------------
def get_passwords(username):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, site_name, site_username, encrypted_password
        FROM saved_passwords WHERE username = %s
    """, (username,))
    records = cursor.fetchall()
    cursor.close()
    conn.close()

    decrypted_records = []
    for row in records:
        entry_id, site_name, site_username, encrypted = row
        decrypted = decrypt_password(encrypted)
        decrypted_records.append({
            "id": entry_id,
            "site_name": site_name,
            "site_username": site_username,
            "password": decrypted
        })

    return decrypted_records

# -------------------------------
# Secure Delete (with username check)
# -------------------------------
def delete_password_by_id(entry_id, username):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            DELETE FROM saved_passwords WHERE id = %s AND username = %s
        """, (entry_id, username))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        print("❌ DB Delete Error:", e)
        return False
    finally:
        cursor.close()
        conn.close()

# -------------------------------
# User Insertion (Sign-up)
# -------------------------------
def insert_user(username, hashed_password):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (username, password) VALUES (%s, %s)",
        (username, hashed_password)
    )
    conn.commit()
    cursor.close()
    conn.close()

# -------------------------------
# Get User by Username
# -------------------------------
def get_user_by_username(username):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user
