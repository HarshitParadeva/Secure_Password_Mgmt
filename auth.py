import bcrypt
from database import get_user_by_username, insert_user

def signup_user(username, password):
    if get_user_by_username(username):
        return False, "Username already exists"

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    insert_user(username, hashed.decode('utf-8'))
    return True, "Account created successfully"

def login_user(username, password):
    user = get_user_by_username(username)
    if not user:
        return False, "User not found"

    stored_hash = user['password']
    if bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
        return True, "Login successful"
    else:
        return False, "Incorrect password"
