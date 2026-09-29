# 🌐 SocialBlog - Aplicación de Blog Full-Stack

Aplicación web de blog y red social interactiva desarrollada con **Next.js 14+ (App Router)**, **Tailwind CSS** y **MongoDB Atlas**. Permite a los usuarios registrarse, publicar entradas con almacenamiento de imágenes en formato **Base64** y comentar en las publicaciones.

---

## 🚀 Características Principal

- 🔐 **Autenticación con JWT:** Registro e inicio de sesión seguro con contraseñas hasheadas (`bcryptjs`).
- 💾 **Persistencia de Sesión:** Estado global administrado mediante Context API y sincronizado con `localStorage`.
- 🖼️ **Imágenes en Base64:** Carga y conversión automática de archivos de imagen desde el navegador para guardarse directamente en la base de datos.
- 💬 **Sistema de Comentarios:** Interacción en tiempo real en cada publicación.
- 🛡️ **Control de Permisos (UI & API):** Rutas protegidas y botones de edición/borrado visibles únicamente para los autores de cada contenido.
- 📱 **Diseño Responsive:** Interfaz moderna con modo oscuro optimizada para móvil y escritorio utilizando Tailwind CSS.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (App Router & API Routes)
- **Lenguaje:** JavaScript (ES6+)
- **Base de Datos & ORM:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) & [Mongoose](https://mongoosejs.com/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Autenticación:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`

---

## 📋 Requisitos Previos

Antes de ejecutar el proyecto localmente, asegúrate de contar con:

- **Node.js** (v18.x o superior)
- **npm** o **yarn**
- Una cuenta en **MongoDB Atlas** con una base de datos creada.

---

## ⚙️ Configuración e Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
   cd tu-repositorio

   Instalar dependencias:

    - Bash

        npm install

    - Configurar variables de entorno:
    
        Crea un archivo .env.local en la raíz del proyecto y agrega las siguientes variables:

    -   Fragmento de código

        MONGODB_URI=tu_cadena_de_conexion_mongodb_atlas
        JWT_SECRET=tu_clave_secreta_super_segura
    
    Iniciar el servidor de desarrollo:

    - Bash

    npm run dev
    
    Abrir http://localhost:3000 en el navegador.