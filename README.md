# Survey Task Project

This project is a **full-stack survey application** with a **Next.js frontend** and a **Django backend** using **PostgreSQL** as the database. It is fully containerized using **Docker** and orchestrated with **Docker Compose**.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Environment Variables](#environment-variables)
5. [Running the Project](#running-the-project)
6. [Accessing the Services](#accessing-the-services)
7. [Testing](#testing)
8. [API Documentation](#api-documentation)
9. [Notes](#notes)

---

## Project Structure

```
survey-task/
├─ backend/       # Django backend
├─ frontend/      # Next.js frontend
├─ docker-compose.yml
└─ README.md
```

---

## Prerequisites

Make sure you have installed:

-   [Docker](https://www.docker.com/) (version >= 20.x)
-   [Docker Compose](https://docs.docker.com/compose/) (version >= 2.x)
-   Git (optional, if cloning repo)

---

## Setup Instructions

1. **Clone the repository**

```bash
git clone <repo-url>
cd survey-task
```

2. **Verify folder structure**

Ensure you have both `backend` and `frontend` directories with their respective `Dockerfile`s.

---

## Environment Variables

### Backend (`backend` service)

| Variable                    | Description                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| `DATABASE_URL`              | PostgreSQL connection URL. Format: `postgres://USER:PASSWORD@db:PORT/DB_NAME` |
| `DJANGO_SUPERUSER_USERNAME` | Default superuser username                                                    |
| `DJANGO_SUPERUSER_EMAIL`    | Default superuser email                                                       |
| `DJANGO_SUPERUSER_PASSWORD` | Default superuser password                                                    |

### Frontend (`frontend` service)

| Variable              | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | API base URL for frontend (points to backend container) |
| `NODE_ENV`            | Environment, usually `production` or `development`      |

---

## Running the Project

1. **Build and start all services**

```bash
docker-compose up --build
```

2. **Stop all services**

```bash
docker-compose down
```

3. **Rebuild after changes**

```bash
docker-compose up --build
```

---

## Accessing the Services

| Service  | URL                                            | Notes       |
| -------- | ---------------------------------------------- | ----------- |
| Frontend | [http://localhost:3000](http://localhost:3000) | Next.js app |
| Backend  | [http://localhost:8000](http://localhost:8000) | Django API  |
| Database | localhost:5432                                 | PostgreSQL  |

> Default superuser credentials:
>
> -   Email: `jisan@gmail.com`
> -   Password: `test1234`

---

## Running Tests

### Backend Tests

1. Enter the backend container:

```bash
docker-compose exec backend bash
```

2. Run Django tests:

```bash
python manage.py test
```

---

Here’s the **API Documentation section** of your README, formatted cleanly in Markdown:

---

## 📚 API Documentation

The full API documentation is available here:
👉 **[View API Documentation on Postman](https://documenter.getpostman.com/view/37320274/2sB3QMK8dW)**

## Notes

-   Backend is accessible inside Docker network via `http://backend:8000`
-   Frontend uses the `NEXT_PUBLIC_API_URL` environment variable to communicate with backend
-   Database data is persisted using a Docker volume `survey_data`
