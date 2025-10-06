# Bimbonet

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Bimbonet

Aplicación web desarrollada en Angular 17 con soporte para Server-Side Rendering (SSR) mediante Express.  
El proyecto integra PrimeNG, Bootstrap 5, Google Maps y ngx-translate  para ofrecer una interfaz moderna, responsiva y multilenguaje.

---

## Tecnologías principales

| Tecnología | Descripción |
|-------------|-------------|
| Angular 17 | Framework principal del proyecto |
| Angular Material / CDK | Componentes y utilidades de diseño |
| PrimeNG 17 | Librería de componentes UI avanzados |
| Bootstrap 5.3 | Sistema de estilos y diseño responsivo |
| ngx-translate | Soporte de internacionalización (i18n) |
| Google Maps | Integración con mapas interactivos |


## Scripts disponibles

| Comando | Descripción |
|----------|-------------|
| `npm start` | Inicia el servidor de desarrollo (ng serve) |
| `npm run build` | Compila la aplicación para producción |
| `npm run watch` | Compila en modo desarrollo con recarga automática |
| `npm run serve:ssr:Bimbonet` | Ejecuta la versión SSR del proyecto usando Express |

---

## Características principales

- Autenticación mediante formularios reactivos y almacenamiento en LocalStorage.  
- Gestión de estado usando LocalStorage en lugar de NgRx, anque tambien se puede utilizar, pero por el tamaño de la app se opto por usar el local storage.  
- Soporte multilenguaje con ngx-translate (Español e Inglés).  
- Tablas dinámicas mediante PrimeNG Table.  
- Integración de mapas con @angular/google-maps.  
- Interfaz moderna con estilos combinados de PrimeNG y Bootstrap.  
- Renderizado del lado del servidor (SSR) para mejorar el SEO y rendimiento.

---

## Instalación y ejecución local

1. Clona el repositorio:
    git clone https://github.com/Lguerrero97/bimbonet.git
2. Accede al directorio del proyecto:
    cd bimbonet
3. Instala las dependencias:
    npm install
4. Ejecuta el servidor de desarrollo:
    npm start
5. Abre el navegador en:
    http://localhost:4200/

## Archivos de traducción
    src/assets/i18n/
    ├── en.json
    └── es.json

1. Ejemplo de uso en un template:
  <h2>{{ 'DASHBOARD.TITLE' | translate }}</h2>


