from flask import Flask, render_template, request, redirect, url_for, flash, session
from auth import signup_user, login_user
from database import get_passwords, store_password, delete_password_by_id  # ✅ Fixed import
from encryption import generate_key
import os

app = Flask(__name__)
app.secret_key = 'supersecretkey'  

# ✅ Ensure encryption key exists
if not os.path.exists("key.key"):
    generate_key()

# -------------------------------
# Login Route
# -------------------------------
@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        success, message = login_user(username, password)
        if success:
            session.clear()
            session["username"] = username
            return redirect(url_for('dashboard'))
        else:
            flash(message)
            return redirect(url_for('login'))

    return render_template('login.html')

# -------------------------------
# Signup Route
# -------------------------------
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm = request.form['confirmPassword']

        if password != confirm:
            flash("Passwords do not match")
            return redirect(url_for('signup'))

        success, message = signup_user(username, password)
        if success:
            flash("Signup successful! Please log in.")
            return redirect(url_for('login'))
        else:
            flash(message)
            return redirect(url_for('signup'))

    return render_template('signup.html')

# -------------------------------
# Dashboard Route
# -------------------------------
@app.route('/dashboard')
def dashboard():
    if "username" not in session:
        return redirect(url_for('login'))

    username = session["username"]
    passwords = get_passwords(username)
    return render_template('dashboard.html', username=username, passwords=passwords)

# -------------------------------
# Save Password Route
# -------------------------------
@app.route("/save", methods=["POST"])
def save():
    if "username" not in session:
        return redirect(url_for("login"))

    username = session["username"]
    site_name = request.form["site_name"]
    site_username = request.form["site_username"]
    site_password = request.form["site_password"]

    store_password(username, site_name, site_username, site_password)
    return redirect(url_for("dashboard"))

# -------------------------------
# Delete Password Route
# -------------------------------
@app.route("/delete/<int:entry_id>", methods=["POST"])
def delete(entry_id):
    if "username" not in session:
        return redirect(url_for("login"))

    username = session["username"]
    success = delete_password_by_id(entry_id, username)

    if not success:
        flash("Unable to delete password entry.")

    return redirect(url_for("dashboard"))

# -------------------------------
# Logout Route
# -------------------------------
@app.route("/logout")
def logout():
    session.pop("username", None)
    flash("You have been logged out.")
    return redirect(url_for("login"))

# -------------------------------
# Run App
# -------------------------------
if __name__ == '__main__':
    app.run(debug=True)
