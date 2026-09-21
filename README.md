# Rigginie

Rigginie is a full-stack PC ecommerce and computer shop application built for browsing, comparing, and purchasing computer hardware. The project combines a Django backend for authentication, product management, and API services with a React frontend for a storefront experience and admin dashboard.

## Project overview

This application is designed for a PC shop experience with:

- customer-facing product pages for CPUs, GPUs, motherboards, storage, and peripherals
- custom PC and prebuilt PC recommendations
- account and profile management
- cart and shopping flow
- support/help, blog, survey, and store location pages
- admin routing for internal management screens

The repo combines both the backend and frontend into one project structure, making it easy to run the application as a standalone web app.

## Tech stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide icons

### Backend
- Python
- Django
- Django REST Framework
- JWT authentication
- MySQL database

## Repository structure

```text
Rigginie/
├── README.md
├── UsersList.jsx
├── .rigginie/              # Python environment / project-related virtual environment files
├── backendd/               # Django backend project
│   ├── backendd/           # Django settings and config
│   ├── databaseadmin/      # admin-related backend modules
│   ├── databaseusers/      # user authentication and profile APIs
│   ├── machinelearning/    # ML-related logic
│   ├── sales/              # sales logic
│   └── manage.py
├── brigginie/              # React frontend app
│   ├── src/                # app source files
│   ├── public/             # static assets
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
└── ...
```

## Main features

- user registration and login
- email verification flow
- password change and logout support
- product categories and individual component pages
- AI build and custom build interfaces
- admin dashboard route
- responsive storefront experience

## Backend details

The backend is a Django project configured in `backendd/` and includes:

- REST API routes for authentication and profile actions
- JWT-based authentication via `rest_framework_simplejwt`
- MySQL database configuration in `backendd/backendd/settings.py`
- CORS enabled for frontend access

Example API endpoints include:

```text
/auth/register/
/auth/login/
/auth/profile/
/auth/change-password/
/auth/logout/
/auth/emailverify/
/auth/resend-verification-code/
```

## Frontend details

The frontend app is in `brigginie/` and uses a route-based structure to separate:

- customer pages (`Appusers.jsx`)
- admin pages (`Appadmin.jsx`)

This gives the app a storefront layout plus an internal admin area.

## Quick start

### 1. Backend

```bash
cd backendd
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend

```bash
cd brigginie
npm install
npm run dev
```

Then open the frontend in the browser and connect it to the Django backend API.

## Notes

- The project is primarily Python-based, with a smaller frontend React portion.
- The repo appears to be a local development project for a PC ecommerce platform.
- Configuration values such as the database credentials and allowed hosts are currently set for local development.

## Summary

Rigginie is a computer retail and ecommerce application with a Django backend and React storefront, focused on selling PC components and guiding users through product discovery, custom builds, and account management.
