#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Auto superuser + fix email
python manage.py shell << 'EOF'
from django.contrib.auth.models import User

# Create superuser if not exists
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@freelancehub.com', 'Admin@1234')
    print("Superuser created!")
else:
    # Fix email if empty
    u = User.objects.get(username='admin')
    if not u.email:
        u.email = 'admin@freelancehub.com'
        u.set_password('Admin@1234')
        u.save()
        print("Admin email fixed!")
    else:
        print("Admin already exists!")
EOF