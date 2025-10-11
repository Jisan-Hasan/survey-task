#!/bin/sh

# Wait for the PostgreSQL database to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Apply database migrations
echo "Running migrations..."
python manage.py migrate --noinput

echo "Creating superuser..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model

User = get_user_model()
# Retrieve environment variables
email = '$DJANGO_SUPERUSER_EMAIL'
password = '$DJANGO_SUPERUSER_PASSWORD'

# Check for existence using the (email)
if not User.objects.filter(email=email).exists():
    # Pass ONLY email and password, which matches the custom manager's signature
    User.objects.create_superuser(email, password)
    print("Superuser created.")
else:
    print("Superuser already exists. Skipping creation.")
EOF


exec "$@"