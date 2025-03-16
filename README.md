# Payever Project

This project consists of two microservices: `invoice-service` and `notifier-service`. The services run using Docker Compose.

## Prerequisites
- Docker
- Docker Compose

## How to Run the Project

1. Start the services with Docker Compose:
   ```sh
   docker-compose up -d
   ```

   This will start the required services, including MongoDB, RabbitMQ, `invoice-service`, and `notifier-service`.

2. Check running containers:
   ```sh
   docker ps
   ```

2. Logs for specific services:
   ```sh
   docker-compose logs -f invoice-service
   docker-compose logs -f notifier-service
   ```

## Environment Variables
Ensure you have a `.env` file with the necessary configurations:

```env
DATABASE_URL=mongodb://admin:admin@mongo:27017
RABBITMQ_URI=amqp://guest:guest@rabbitmq:5672
PORT=3000
```

## Stopping the Services
To stop the services, run:
```sh
docker-compose down
```

## Additional Notes
- `invoice-service` handles invoice-related operations.
- `notifier-service` is responsible for sending notifications and depends on RabbitMQ.
- The services are set to start in order: MongoDB -> RabbitMQ -> Other Services.

