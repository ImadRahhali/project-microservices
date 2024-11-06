# project-microservices

# Garage Management System

The **Garage Management System** is a microservices-based application designed to streamline the operations of a vehicle service garage. The system is divided into multiple domain services, each responsible for different business processes, including customer management, vehicle management, workshop scheduling, maintenance job management, invoicing, and notification management.

This project leverages **Flask** and **Node.js** to implement a set of microservices, each dedicated to a specific domain. The modular architecture allows the system to scale and adapt to evolving business needs, ensuring separation of concerns, ease of maintenance, and flexibility in deployment.

## Core Microservices:

- **Customer Management** (Flask): Handles customer registration, updates, and management of customer data.
- **Vehicle Management** (Flask): Manages vehicles owned by customers, including vehicle registration and updates.
- **Workshop Scheduling** (Node.js): Responsible for scheduling and managing maintenance jobs, as well as delegating tasks to the maintenance job management service.
- **Maintenance Job Management** (Node.js): Executes maintenance jobs, updates job statuses, and tracks progress.
- **Invoicing** (Node.js/Flask): Generates and sends invoices to customers after the completion of maintenance jobs.
- **Notification Management** (Node.js): Sends notifications (e.g., SMS, emails) to customers about vehicle statuses, scheduled maintenance, and job completion updates.

## Key Features:

- **Microservices Architecture**: Each component operates as an independent microservice with its own data store and business logic, ensuring scalability and maintainability.
- **RESTful APIs**: All services expose RESTful APIs, making it easy to integrate and communicate between services.
- **Service Communication**: The services communicate with each other via HTTP-based APIs, enabling seamless interaction between domains.
- **Database**: Uses PostgreSQL or MySQL databases to store customer, vehicle, job, and invoice information.
- **Containerization**: Each microservice is containerized with Docker, ensuring consistent environments for development, testing, and production.
- **Kubernetes Deployment**: The application can be orchestrated using Kubernetes, providing automated scaling, deployment, and management.

## Technologies Used:

- **Backend**: Flask (Python), Node.js (JavaScript/TypeScript), Express (Node.js)
- **Database**: PostgreSQL, MySQL
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **APIs**: RESTful API design

## Project Structure:

- **`/customer-management`**: Flask app for managing customers.
- **`/vehicle-management`**: Flask app for managing vehicles.
- **`/workshop-scheduling`**: Node.js app for managing maintenance job scheduling.
- **`/maintenance-job-management`**: Node.js app for job execution and progress tracking.
- **`/invoicing`**: Node.js/Flask app for invoice generation and dispatch.
- **`/notification-management`**: Node.js app for sending customer notifications.

## Future Work:

- Implement additional services like payment processing and customer feedback management.
- Extend the notification system to include more channels, such as push notifications and mobile apps.
- add tests.

