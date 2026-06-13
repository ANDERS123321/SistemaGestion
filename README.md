# Sistema de Gestion ID — Monolito (HTML / CSS / JS)

Replica visual del sistema de gestion original (hecho en C#/Blazor), reconstruida
como un **monolito de front-end** usando unicamente **HTML, CSS y JavaScript**.
No incluye datos ni marcas reales: todo el contenido es generico de demostracion.

## Como ejecutarlo

1. Abre `index.html` en tu navegador (doble clic).
2. En el login ingresa **cualquier** usuario y contrasena (es una demo).
3. Navega por el menu lateral.

> Recomendado: abrirlo con la extension **Live Server** de VS Code para evitar
> cualquier restriccion del protocolo `file://`. Tambien funciona abriendo el
> archivo directamente.

## Requisitos

- Conexion a internet la primera vez: Bootstrap 5 y Bootstrap Icons se cargan
  desde CDN (igual que el proyecto original usaba Bootstrap). Los estilos propios
  (`css/app.css`, `css/login.css`) son 100% locales.

## Estructura

```
SistemaGestionMonolito/
├── index.html           # Login (pantalla de inicio)
├── dashboard.html       # Pagina de bienvenida
├── inicio.html          # Gestion Planos: filtros + tabla de resultados
├── historial.html       # Historial de planos
├── aprobaciones.html    # Aprobaciones (con modal de confirmacion)
├── usuarios.html        # Administrar usuarios (listar / editar / eliminar)
├── crear-usuario.html   # Formulario de creacion de usuario
├── css/
│   ├── app.css          # Framework de estilos (layout, sidebar, topbar, tablas, filtros...)
│   └── login.css        # Estilos de la pantalla de login
├── js/
│   └── app.js           # Auth demo, inyeccion de sidebar/topbar y logica de cada pagina
└── assets/
    └── logo.svg         # Logo generico (sin marca real)
```

## Notas tecnicas

- **Autenticacion**: simulada con `localStorage`. No hay backend; el login solo
  guarda una sesion local y redirige al dashboard.
- **Usuarios**: datos de ejemplo guardados en `localStorage` (se pueden crear,
  editar y eliminar; persisten en el navegador).
- **Sidebar y topbar**: se inyectan por JavaScript (`initShell`) para evitar
  duplicar el HTML en cada pagina.
- El diseno (colores, tipografias, animaciones, espaciados) replica el sistema
  original: sidebar con gradiente azul, submenus desplegables, loader animado,
  tablas compactas y login de dos paneles.
