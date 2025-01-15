# Sistema de Mantenimiento

## Instrucciones para levantar la aplicación

### Prerrequisitos

Asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/) (versión 6 o superior)
- [Git](https://git-scm.com/)

### Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/A1EXF6A/Sistema_de_mantenimiento
    ```

2. Navega al directorio del proyecto:

    ```bash
    cd SistemaDeMantenimiento
    ```

3. Navega al directorio del servidor:

    ```bash
    cd server
    ```

4. Instala las dependencias del servidor:

    ```bash
    npm install
    ```

4. Vuelve al directorio raíz y navega al directorio del front:

    ```bash
    cd ..
    cd front-end-sistema
    npm install
    ```

3. Instala las dependencias del front:

    ```bash
    npm install
    ```

### Configuración

1. Revisa el archivo `.env` en el servidor del proyecto y configura las variables de entorno necesarias según tu configuración.

### Ejecución

1. Inicia el servidor:

    ```bash
    cd server
    npm run start
    ```

2. Inicia la página:

    ```bash
    cd front-end-sistema
    npm run start
    ```

2. Abre tu navegador y visita `http://localhost:5173` para ver la aplicación en funcionamiento.