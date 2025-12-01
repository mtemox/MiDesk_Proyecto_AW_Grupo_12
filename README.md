# 🖥️ VirtualDesk | Sistema de Escritorio Virtual Web

![Estado del Proyecto](https://img.shields.io/badge/Estado-En_Desarrollo-orange?style=for-the-badge)
![Versión](https://img.shields.io/badge/Versión-Sprint_1-blue?style=for-the-badge)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)

> **Simulación de un Sistema Operativo en el navegador.** > Proyecto académico desarrollado para la **Escuela Politécnica Nacional (ESFOT)**.

---

## 📖 Descripción

**VirtualDesk** no es una página web común. Es una plataforma colaborativa que emula la experiencia de usuario de sistemas como Windows o Ubuntu.

Permite a los estudiantes de la ESFOT tener su propio espacio de trabajo en la nube, donde pueden crear notas, guardar enlaces, abrir ventanas flotantes y personalizar su entorno, todo bajo una interfaz moderna con efectos de **Glassmorphism**.

### ✨ Características Principales
* 🖼️ **Interfaz Gráfica UI/UX:** Ventanas arrastrables, menú contextual (clic derecho) y barra de tareas.
* 🔒 **Seguridad Avanzada:** Autenticación JWT, encriptación de contraseñas y validación por correo.
* ☁️ **Persistencia:** Todo lo que creas en tu escritorio (íconos, carpetas) se guarda en la nube (MongoDB Atlas).
* 📱 **Apps Integradas:** Widget de clima, noticias tech, editor de código y perfil de usuario.

---

## 🛠️ Tecnologías (MERN Stack)

| Frontend (Cliente) | Backend (Servidor) | Herramientas |
| :--- | :--- | :--- |
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) | ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat) | ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white) |
| ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) | ![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=flat&logo=visual%20studio%20code&logoColor=white) |
| **Lucide Icons** | **Nodemailer / JWT** | **Trello / Jira** |

---

## 📅 Avance del Proyecto (Sprints)

### ✅ Sprint 0: Configuración & Arquitectura
- [x] Configuración del entorno de desarrollo (Vite + Node.js).
- [x] Estructura de carpetas MVC.
- [x] Conexión a Base de Datos (MongoDB Atlas).
- [x] Configuración de Repositorio y Ramas.

### ✅ Sprint 1: Autenticación & Core
- [x] **Registro:** Formulario con envío de email de confirmación.
- [x] **Login:** Sistema de tokens JWT y validación de credenciales.
- [x] **Recuperación:** Flujo de "Olvidé mi contraseña" vía email.
- [x] **Escritorio:** Renderizado de íconos dinámicos desde la BD.
- [x] **Gestión de Ítems:** Crear (POST) y Eliminar (DELETE) enlaces con clic derecho.
- [x] **Perfil:** Edición de datos personales y cambio de contraseña.

---

## 🚀 Instalación y Despliegue

Sigue estos pasos para correr el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/TU_USUARIO/nombre-repo.git](https://github.com/TU_USUARIO/nombre-repo.git)
cd nombre-repo
```

2. Configurar el Backend
```bash
cd backend
npm install
Crea un archivo .env en la carpeta backend con:
```

```bash
Fragmento de código

PORT=3000
MONGODB_URI_PRODUCTION=tu_cadena_de_conexion_mongo
JWT_SECRET=tu_palabra_secreta
BREVO_API_KEY=tu_api_key_correo
URL_FRONTEND=http://localhost:5173

```
Iniciar servidor:


```bash
npm run dev
```

3. Configurar el Frontend
```bash
cd frontend
npm install
Crea un archivo .env en la carpeta frontend con:
```

Fragmento de código
```bash
VITE_BACKEND_URL=http://localhost:3000/api
```
Iniciar cliente:

```bash
npm run dev
```
