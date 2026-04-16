# Sistema de Acceso Gatekeeper

Un sistema de validación de acceso robusto y automatizado diseñado para verificar credenciales de usuarios, enfocado específicamente en dominios institucionales (ej. ITSES) y folios de pago. El sistema garantiza un procesamiento seguro, eficiente y preciso mediante flujos automatizados de validación, interactuando con una interfaz web moderna.

## Arquitectura del Sistema (Orden de Flujo)

La aplicación sigue un flujo estructurado con las siguientes herramientas:

1. **Frontend (Capa de Cliente)**: La interacción del usuario ocurre aquí. Desarrollado en **React 19** y **Vite**, estilizado con **Tailwind CSS 4** y animado en 3D (para visualizaciones del gafete) mediante **GSAP**.
2. **Backend (API Intermediaria)**: Las solicitudes viajan hacia el servidor **Node.js** con **Express**. El backend sirve endpoints RESTful y gestiona la comunicación segura.
3. **Automatización y Lógica (Workflows)**: El backend dispara webhooks hacia **n8n**, donde reside la lógica principal: se evalúa condicionalmente el dominio del correo institucional y la validez del folio de pago de forma asíncrona.
4. **Base de Datos (Persistencia)**: Dentro del flujo de n8n (o a través del backend), se ejecutan consultas primarias hacia **PostgreSQL** para validar los registros y actualizar el estatus de acceso.

### Herramientas Utilizadas
- **Frontend:** React 19, Vite, Tailwind CSS 4, GSAP.
- **Backend:** Node.js, Express.
- **Base de Datos:** PostgreSQL (mediante cliente `pg`).
- **Automatización:** n8n.

## Características

* **Flujo de Validación de Credenciales**: Integración con n8n para verificaciones lógicas en múltiples pasos.
* **Verificación de Dominio y Pago**: Controles estrictos para permitir únicamente dominios de correo institucionales y folios verídicos.
* **Notificaciones por Correo Automatizadas**: Envío transaccional y personalizado para notificar aprobación o rechazo de accesos.
* **Estados Dinámicos de UI**: Transiciones fluidas usando GSAP desde estados neutros a estados de "Procesando", "Aceptado" o "Rechazado" en 3D.
* **Interoperabilidad RESTful**: Comunicación efectiva y acoplada entre eventos de React, triggers de n8n y consultas SQL.

## Requisitos Previos

Antes de inicializar el sistema, asegúrate de contar con:
* Node.js (v18.0.0 o superior recomendado)
* PostgreSQL
* n8n (puede ser montado en Docker o instalado vía npm global)

## Instalación

1. **Posicionarse en el directorio principal**:
    ```bash
    cd gatekeeper-system
    ```

2. **Instalar dependencias del Backend**:
    ```bash
    cd backend
    npm install
    ```

3. **Instalar dependencias del Frontend**:
    ```bash
    cd ../frontend
    npm install
    ```

## Configuración

1. **Configuración de Base de Datos**:
    Inicia una instancia de PostgreSQL y configura las variables de entorno. Crea un archivo `.env` en la carpeta `backend` con lo siguiente:
    ```env
    DB_USER=tu_usuario_postgres
    DB_PASSWORD=tu_password_postgres
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=nombre_de_bd
    PORT=3000
    ```

2. **Configuración del n8n**:
    * Inicia tu instancia de n8n.
    * Importa el archivo de flujo desde `n8n/workflow.json` a tu entorno de n8n.
    * Configura las credenciales de PostgreSQL y SMTP en los nodos específicos para tu cuenta y ambiente.

## Ejecución de la Aplicación

1. **Iniciar el Backend**:
    Desde la carpeta `backend`, corre el servidor Express:
    ```bash
    node index.js
    ```

2. **Iniciar el Frontend**:
    Desde la carpeta `frontend`, levanta el proyecto de React y Vite:
    ```bash
    npm run dev
    ```

## Pautas de Desarrollo

* **Estándares de UI/UX**: Se usa una paleta estricta de tonos Gold (Dorado) y Navy (Azul Marino). Todo componente nuevo de React debe alinearse con Tailwind CSS para consistencia visual.
* **Animaciones**: GSAP controla el giro de las tarjetas 3D y las transiciones complejas. Evita aplicar pseudo-clases o transiciones CSS estándar sobre elementos manipulados por GSAP para evitar conflictos.

## Estructura del Proyecto

* `/backend` - API de Express, rutas expuestas y configuraciones de bd.
* `/frontend` - Aplicación React 19, Vite y estilos con Tailwind CSS.
* `/n8n` - Flujos pre-configurados (.json) para importación de herramientas automatizadas.
* `/db` - Scripts y migraciones para levantar PostgreSQL.

## Licencia

Este proyecto está bajo la Licencia **MIT**. Eres libre de utilizarlo, modificarlo y distribuirlo para fines académicos, educativos o personales.
# sistema-acceso-gatekeeper
