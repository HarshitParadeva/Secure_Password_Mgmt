from cryptography.fernet import Fernet
import os

# Generate a new AES key and save to 'key.key'
def generate_key():
    key = Fernet.generate_key()
    with open('key.key', 'wb') as key_file:
        key_file.write(key)

# Load the AES key from file
def load_key():
    if not os.path.exists("key.key"):
        generate_key()
    with open('key.key', 'rb') as key_file:
        return key_file.read()

# Encrypt the given password
def encrypt_password(password):
    key = load_key()
    f = Fernet(key)
    encrypted = f.encrypt(password.encode())
    return encrypted.decode()

# Decrypt the given encrypted password
def decrypt_password(encrypted_password):
    key = load_key()
    f = Fernet(key)
    decrypted = f.decrypt(encrypted_password.encode())
    return decrypted.decode()
