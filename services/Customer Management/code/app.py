from flask import Flask, request, jsonify
from models import Customer
from auth import hash_password
from auth import check_password
from database import get_db_connection

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register_customer():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Hash the password
    hashed_password = hash_password(password)

    customer = Customer(name=name, email=email, password=hashed_password)
    customer.create_table()
    customer.save()

    return jsonify({"message": "Customer registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login_customer():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM customers WHERE email = %s", (email,))
    customer = cursor.fetchone()
    cursor.close()
    connection.close()

    if customer and check_password(customer['password'], password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route("/getall", methods=["GET"])
def getAll():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT name,email from customers")
    result = cursor.fetchall()
    if result:
        return jsonify({"users" :result}), 200
    return jsonify({"message" : "error getting All users"})

if (__name__ == "__main__"):
    app.run(debug=True)