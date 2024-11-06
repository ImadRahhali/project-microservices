from database import get_db_connection

class Customer:
    def __init__(self, id=None, name=None, email=None, password=None):
        self.id = id
        self.name = name
        self.email = email
        self.password = password

    @classmethod
    def create_table(cls):
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS customers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
        """)
        connection.commit()
        cursor.close()
        connection.close()

    def save(self):
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
        INSERT INTO customers (name, email, password)
        VALUES (%s, %s, %s)
        """, (self.name, self.email, self.password))
        connection.commit()
        cursor.close()
        connection.close()
