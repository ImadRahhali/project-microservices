from database import get_db_connection

class Customer:
    def __init__(self, CIN=None, first_name=None, last_name=None, address=None, phone=None, email=None):
        self.CIN = CIN
        self.first_name = first_name
        self.last_name = last_name
        self.address = address
        self.phone = phone
        self.email = email

    @classmethod
    def create_table(cls):
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS customers (
            CIN VARCHAR(100) PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            address TEXT NOT NULL,
            phone VARCHAR(20) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE
        )
        """)
        connection.commit()
        cursor.close()
        connection.close()

    def save(self):
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
        INSERT INTO customers (CIN, first_name, last_name, address, phone, email)
        VALUES (%s, %s, %s, %s, %s, %s)
        """, (self.CIN, self.first_name, self.last_name, self.address, self.phone, self.email))
        connection.commit()
        cursor.close()
        connection.close()
