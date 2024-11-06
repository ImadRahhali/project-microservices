from flask import Flask, request, jsonify
from models import Customer
from database import get_db_connection

app = Flask(__name__)

# Ensure the database table is created
Customer.create_table()

@app.route('/register', methods=['POST'])
def register_customer():
    data = request.get_json()
    CIN = data.get('CIN')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    address = data.get('address')
    phone = data.get('phone')
    email = data.get('email')

    # Check for missing fields
    if not all([CIN, first_name, last_name, address, phone, email]):
        return jsonify({"error": "All fields are required"}), 400

    customer = Customer(
        CIN=CIN,
        first_name=first_name,
        last_name=last_name,
        address=address,
        phone=phone,
        email=email
    )
    customer.save()

    return jsonify({"message": "Customer registered successfully"}), 201

@app.route("/getall", methods=["GET"])
def get_all_customers():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM customers")
    result = cursor.fetchall()
    cursor.close()
    connection.close()

    if result:
        return jsonify({"customers": result}), 200
    return jsonify({"message": "No customers found"}), 404

@app.route('/update', methods=['PUT'])
def update_customer():
    CIN = request.args.get('CIN')
    if not CIN:
        return jsonify({"error": "CIN parameter is required"}), 400

    data = request.get_json()
    update_fields = {}

    # Collect only provided fields for update
    if 'first_name' in data:
        update_fields['first_name'] = data['first_name']
    if 'last_name' in data:
        update_fields['last_name'] = data['last_name']
    if 'address' in data:
        update_fields['address'] = data['address']
    if 'phone' in data:
        update_fields['phone'] = data['phone']
    if 'email' in data:
        update_fields['email'] = data['email']

    if not update_fields:
        return jsonify({"error": "No fields provided for update"}), 400

    # Update customer in the database
    connection = get_db_connection()
    cursor = connection.cursor()

    # Dynamically build the SQL query with the fields to update
    set_clause = ", ".join([f"{key} = %s" for key in update_fields.keys()])
    sql_query = f"UPDATE customers SET {set_clause} WHERE CIN = %s"
    values = list(update_fields.values()) + [CIN]

    cursor.execute(sql_query, values)
    connection.commit()
    rows_affected = cursor.rowcount
    cursor.close()
    connection.close()

    if rows_affected == 0:
        return jsonify({"error": "Customer not found or no update performed"}), 404
    return jsonify({"message": "Customer updated successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)
