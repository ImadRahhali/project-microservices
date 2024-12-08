
---

# Microservices Project - Customer and Vehicle Services

This project consists of two microservices: Customer Service and Vehicle Service, each of which uses a MySQL database. The services are built using Node.js and Prisma, and Docker Compose is used to orchestrate the containers.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Docker**: [Docker Installation Guide](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)
- **Git**: [Git Installation Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Setting up the Project

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/TahirRida/project-microservices.git
cd project-microservices
```

### 2. Configure the `.env` File

In the project directory, you will find an `.env` file. Before running the application, you need to update the database URLs and other environment-specific variables.

Create or modify the `.env` files in the root of the customer-service and vehicle-service folders (if it does not already exist) with the following contents:

#### customer-service Folder :

```env
# MySQL connection URLs for the services
DATABASE_URL="mysql://root:RootPasswordHere@mysql-customer:3306/customer_db"
```
change `RootPasswordHere` by your own root password.

#### vehicle-service Folder :

```env
# MySQL connection URLs for the services
DATABASE_URL="mysql://root:RootPasswordHere@mysql-vehicle:3306/vehicle_db"
CUSTOMER_SERVICE_URL="http://customer-service:3000/customers"
```
change `RootPasswordHere` by your own root password.
### 3. Modify Docker Compose Configuration

You need to do changes on the `docker-compose.yaml` file:

The MySQL services for both `customer-service` and `vehicle-service` need to have their environment variables properly configured with the same root password you set in the `.env` files. Ensure the `MYSQL_ROOT_PASSWORD` values in the Docker Compose configuration match the password you used in your `.env` files.

#### MySQL Configuration for customer-service:

```yaml
mysql-customer:
  image: mysql:8
  environment:
    MYSQL_ROOT_PASSWORD: RootPasswordHere  # Change to your custom root password
    MYSQL_DATABASE: customer_db
```
#### MySQL Configuration for vehicle-service:

```yaml
mysql-vehicle:
  image: mysql:8
  environment:
    MYSQL_ROOT_PASSWORD: RootPasswordHere  # Change to your custom root password
    MYSQL_DATABASE: vehicle_db
```

If you need to change the ports or other Docker Compose configurations, update the `docker-compose.yml` file. Here are some common adjustments:

- **Ports**: If you need to run the services on different ports, modify the `ports` section for `customer-service` and `vehicle-service` services in the `docker-compose.yml` file.
  
Example to change ports:
```yaml
  customer-service:
    ports:
      - "3001:3000"
  vehicle-service:
    ports:
      - "4001:4000"
```

### 4. Build and Run the Services

After configuring the `.env` file and Docker Compose file, you're ready to start the services using Docker Compose.

Run the following command to build and start the services:

```bash
docker-compose up --build
```

This will:
- Build the Docker images for both `customer-service` and `vehicle-service` from the provided Dockerfiles.
- Start MySQL containers for both customer and vehicle services.
- Start the customer and vehicle services containers.

### 5. Verify the Services

Once the containers are up and running, you can verify the services by making API requests.

- **Customer Service**: Open `http://localhost:3000` or `http://localhost:3001` (depending on the port configuration) to interact with the Customer Service API.
- **Vehicle Service**: Open `http://localhost:4000` or `http://localhost:4001` (depending on the port configuration) to interact with the Vehicle Service API.

You can use tools like **Postman** or **cURL** to make requests.

### 6. Manage the Docker Containers

- To stop the services, run:
  ```bash
  docker-compose down
  ```
- To view the logs for all services, run:
  ```bash
  docker-compose logs -f
  ```

### 7. Prisma Migrations and Setup

Both services use Prisma for database management. The first time you run the application, Prisma will automatically migrate the databases for both services using the `npx prisma migrate deploy` command specified in the Docker Compose file. However, if you need to run migrations manually for any reason, you can do so by running:

```bash
docker-compose exec customer-service /bin/sh -c "npx prisma migrate dev"
docker-compose exec vehicle-service /bin/sh -c "npx prisma migrate dev"
```

### 8. Debugging and Troubleshooting

- If the services fail to start, check the logs to identify the problem:
  ```bash
  docker-compose logs
  ```
- Ensure the environment variables in the `.env` file are set correctly.
- Make sure the services are properly connecting to their respective MySQL databases.

### 9. Optional: Test API Endpoints

You can test the following API endpoints:

**Customer Service**
- `POST /customers`: Add a new customer.
- `GET /customers/{id}`: Get a customer by ID.

**Vehicle Service**
- `POST /vehicles`: Add a new vehicle.
- `GET /vehicles/{id}`: Get a vehicle by VIN.

---
