# Mustafa Frontend (Vue 3 + Vite)

Frontend Website and Administration Interface for the Mustafa Hasb Sido Portfolio & Digital Marketing Platform.

Built with Vue 3, Vite, Composition API, Bootstrap Icons, and a custom bilingual system (Arabic / English).

---

## Requirements

* Node.js 18+
* npm

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Environment Configuration

Create a local environment file:

```bash
cp .env.example .env
```

Update:

```env
VITE_API_URL=https://api.www.mustafahasbsido.com/api
VITE_STORAGE_URL=https://api.www.mustafahasbsido.com/storage
```

---

## Development Mode

```bash
npm run dev
```

---

## Production Build

```bash
npm run build
```

The production build will be generated inside:

```text
dist/
```

---

## Deployment

Upload the generated:

```text
dist/
```

directory to the hosting environment.

---

## Vue Router Configuration

This project uses:

```js
createWebHistory()
```

Therefore all requests must be redirected to:

```text
index.html
```

### Apache (.htaccess)

```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>
```

### Nginx

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## Architecture Notes

### API Clients

Public components must use:

```js
publicAxios
```

Authenticated admin pages must use:

```js
axios
```

with token interception enabled.

---

### Localization

The application does not use vue-i18n.

A custom localization system based on:

```js
provide()
inject()
```

and reactive locale management is implemented.

Supported Languages:

* Arabic (RTL)
* English (LTR)

---

### UI Libraries

* Vue 3
* Vite
* Bootstrap Icons
* Iconify
* Tabler Icons
* Chart.js

---

### Important Notes

#### Teleport Components

Styles for components rendered through:

```vue
<Teleport>
```

must be placed in global styles rather than scoped styles.

---

#### Transition Components

Vue transitions must contain a single root child element.

---

#### Empty Decorative Elements

Avoid empty HTML tags inside buttons. Use CSS pseudo-elements instead.

---

## Features

### Public Website

* Home Page
* About Section
* Services Section
* Portfolio Showcase
* Blog System
* Contact Form
* Multi-language Support
* RTL/LTR Support

### Admin Dashboard

* Authentication
* Blog Management
* Portfolio Management
* Services Management
* Categories & Tags
* Contact Messages
* Activity Logs
* Analytics Dashboard
* Trash & Restore System

---

## Deployment Checklist

* Dependencies installed
* Environment variables configured
* API URL configured correctly
* No localhost URLs remaining
* Production build completed
* Router rewrites configured
* Images loading from backend storage
* Authentication functioning correctly
* CORS configured properly

---

## Technology Stack

* Vue 3
* Vite
* Composition API
* Axios
* Bootstrap Icons
* Chart.js
* Custom Localization System
