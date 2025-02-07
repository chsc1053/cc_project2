from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
import os

app = Flask(__name__, static_folder="static")
app.secret_key = "my_key"

# Absolute path to the database file
BASE_DIR = os.path.dirname(os.path.abspath('users.db'))
DATABASE = os.path.join(BASE_DIR, 'users.db')

def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute(
        """CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY, 
            password TEXT, 
            firstname TEXT, 
            lastname TEXT, 
            email TEXT, 
            address TEXT
        )"""
    )
    conn.commit()
    conn.close()


@app.route("/")
def index():
    error = request.args.get("error")
    return render_template("index.html", error=error)


@app.route("/signup")
def signup():
    error = request.args.get("error")
    return render_template("signup.html", error=error)


@app.route("/register", methods=["POST"])
def register():
    username = request.form["username"]
    password = request.form["password"]
    firstname = request.form["firstname"]
    lastname = request.form["lastname"]
    email = request.form["email"]
    address = request.form["address"]
    
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username=?", (username,))
        if c.fetchone():
            error = "Username already exists"
            return render_template("signup.html", error=error)

        c.execute(
            "INSERT INTO users (username, password, firstname, lastname, email, address) VALUES (?, ?, ?, ?, ?, ?)",
            (username, password, firstname, lastname, email, address),
        )
        conn.commit()

    success = "SignUp Successful! Navigating to Login page..."
    return render_template("signup.html", success=success)


@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute(
            "SELECT * FROM users WHERE username=? AND password=?", (username, password)
        )
        user = c.fetchone()

    if user:
        session["username"] = username
        return redirect(url_for("home"))
    else:
        return redirect(url_for("index", error="Invalid login credentials!"))


@app.route("/home")
def home():
    if "username" not in session:
        return redirect(url_for("index"))

    username = session["username"]
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username=?", (username,))
        user = c.fetchone()

    return render_template("home.html", user=user)


@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("index"))


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
