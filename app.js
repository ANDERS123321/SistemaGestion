/* ========================================================================
   SISTEMA DE GESTION ID - Monolito HTML/CSS/JS
   Logica de la aplicacion: autenticacion demo, layout (sidebar + topbar),
   navegacion y comportamiento de cada pagina.

   NOTA: Es una demo de front-end. No hay backend; la "autenticacion" y los
   datos se guardan en localStorage solo para simular el flujo.
   ======================================================================== */

const BRAND = "Sistema de Gestion";
const LOGO = "assets/logo.svg";
const AUTH_KEY = "sg_auth";
const USERS_KEY = "sg_usuarios";

/* ========================================================================
   AUTENTICACION (demo)
   ======================================================================== */
const Auth = {
    login(usuario) {
        const data = { usuario, displayName: usuario, ts: Date.now() };
        localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    },
    logout() {
        localStorage.removeItem(AUTH_KEY);
    },
    get() {
        try { return JSON.parse(localStorage.getItem(AUTH_KEY)); }
        catch { return null; }
    },
    isAuthed() { return !!this.get(); },
    displayName() {
        const a = this.get();
        return a && a.displayName ? a.displayName : "Usuario";
    },
    require() {
        if (!this.isAuthed()) {
            window.location.href = "index.html";
            return false;
        }
        return true;
    }
};

/* ========================================================================
   DATOS DEMO (usuarios)
   ======================================================================== */
function seedUsuarios() {
    if (localStorage.getItem(USERS_KEY)) return;
    const demo = [
        { codID: 1, nombre: "admin",   nomApe: "Ana Torres",       area: "ADMIN",       cc: 1001 },
        { codID: 2, nombre: "jgarcia", nomApe: "Juan Garcia",      area: "INGENIERIA",  cc: 1002 },
        { codID: 3, nombre: "mlopez",  nomApe: "Maria Lopez",      area: "DISENO",      cc: 1003 },
        { codID: 4, nombre: "crodri",  nomApe: "Carlos Rodriguez", area: "PRODUCCION",  cc: 1004 }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(demo));
}
function getUsuarios() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
}
function setUsuarios(list) {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

/* ========================================================================
   LAYOUT: inyeccion de Sidebar (NavMenu) + Topbar
   ======================================================================== */
function buildSidebar(active) {
    const item = (label, icon, grupo, abierto, subitems) => `
        <div class="app-item-menu app-item-menu-desplegable ${abierto ? "abierto" : ""}">
            <button class="nav-link nav-link-desplegable" type="button" onclick="toggleSubmenu(this)">
                <span class="app-icono ${icon}" aria-hidden="true"></span>
                ${label}
                <span class="app-icono-flecha" aria-hidden="true"></span>
            </button>
            <div class="app-submenu">
                ${subitems.map(s => `
                    <a class="nav-link nav-link-sub ${s.page === active ? "active" : ""}" href="${s.href}" onclick="cerrarMenuMovil()">
                        <span class="app-icono-punto" aria-hidden="true"></span>
                        ${s.label}
                    </a>`).join("")}
            </div>
        </div>`;

    const grupoPlanos = ["inicio", "historial", "aprobaciones"].includes(active);
    const grupoUsuarios = ["usuarios", "crear-usuario"].includes(active);

    return `
        <div class="app-barra-navegacion">
            <div class="app-contenedor-barra">
                <a href="dashboard.html"><img src="${LOGO}" alt="${BRAND}" class="app-logo" /></a>
            </div>
        </div>
        <input type="checkbox" title="Menu de navegacion" class="app-toggle-barra" />
        <div class="app-menu-desplazable">
            <nav class="app-menu-navegacion">
                ${item("Gestion Planos", "app-icono-permisos", "planos", grupoPlanos, [
                    { label: "Inicio",       href: "inicio.html",       page: "inicio" },
                    { label: "Historial",    href: "historial.html",    page: "historial" },
                    { label: "Aprobaciones", href: "aprobaciones.html", page: "aprobaciones" }
                ])}
                ${item("Administrar Usuarios", "app-icono-usuarios", "usuarios", grupoUsuarios, [
                    { label: "Listar Usuarios", href: "usuarios.html",       page: "usuarios" },
                    { label: "Crear Usuario",   href: "crear-usuario.html",  page: "crear-usuario" }
                ])}
            </nav>
        </div>`;
}

function buildTopbar() {
    return `
        <div class="app-barra-superior">
            <div class="app-usuario-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>${Auth.displayName()}</span>
            </div>
            <button class="app-btn-salir" title="Cerrar sesion" onclick="handleLogout()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
            </button>
        </div>`;
}

function initShell(active) {
    const sb = document.getElementById("sidebar");
    const tb = document.getElementById("topbar");
    if (sb) sb.innerHTML = buildSidebar(active);
    if (tb) tb.innerHTML = buildTopbar();
}

/* Funciones globales del menu (igual que el proyecto original) */
function toggleSubmenu(button) {
    const menuItem = button.closest(".app-item-menu-desplegable");
    menuItem.classList.toggle("abierto");
}
function cerrarMenuMovil() {
    const toggle = document.querySelector(".app-toggle-barra");
    if (toggle && toggle.checked) toggle.checked = false;
}
function handleLogout() {
    Auth.logout();
    window.location.href = "index.html";
}

/* ========================================================================
   PAGINA: LOGIN
   ======================================================================== */
function initLogin() {
    if (Auth.isAuthed()) { window.location.href = "dashboard.html"; return; }

    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("loginError");
    const btn = document.getElementById("loginBtn");
    const btnText = document.getElementById("loginBtnText");
    const spinner = document.getElementById("loginSpinner");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorBox.style.display = "none";

        const usuario = form.usuario.value.trim();
        const contrasena = form.contrasena.value.trim();

        if (!usuario || !contrasena) {
            errorBox.querySelector("span").textContent = "Usuario y contrasena son requeridos";
            errorBox.style.display = "flex";
            return;
        }

        // Simular verificacion
        btn.disabled = true;
        if (btnText) btnText.textContent = "Verificando...";
        if (spinner) spinner.style.display = "inline-block";

        setTimeout(() => {
            Auth.login(usuario);
            window.location.href = "dashboard.html";
        }, 900);
    });
}

/* ========================================================================
   PAGINA: INICIO (Gestion Planos)
   ======================================================================== */
const PLANOS_DEMO = [
    { fecha: "2026-05-21", descripcion: "Plano de estructura principal", id: "PL-2026-001", tamano: "A1", revision: "A", subRevision: "1", dibujante: "Juan Garcia",      estado: "Aprobado" },
    { fecha: "2026-05-19", descripcion: "Detalle de ensamble",          id: "PL-2026-002", tamano: "A2", revision: "B", subRevision: "2", dibujante: "Maria Lopez",      estado: "En Revision" },
    { fecha: "2026-05-15", descripcion: "Plano de instalacion electrica", id: "PL-2026-003", tamano: "A0", revision: "A", subRevision: "1", dibujante: "Carlos Rodriguez", estado: "Aprobado" },
    { fecha: "2026-05-10", descripcion: "Esquema hidraulico",           id: "PL-2026-004", tamano: "A3", revision: "C", subRevision: "3", dibujante: "Ana Torres",       estado: "Pendiente" }
];

function estadoBadge(estado) {
    const map = { "Aprobado": "aprobado", "En Revision": "revision", "Pendiente": "pendiente", "Rechazado": "rechazado" };
    const k = map[estado] || "pendiente";
    return `<span class="estado-badge estado-${k}"><span class="dot"></span>${estado}</span>`;
}

function fmtFecha(f) {
    if (!f) return "";
    const partes = String(f).split("-");
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : f;
}

function renderPlanosRows(lista) {
    const tbody = document.getElementById("planosBody");
    if (!lista.length) {
        tbody.innerHTML = `
            <tr><td colspan="10">
                <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    No se encontraron resultados. Intenta con otros filtros.
                </div>
            </td></tr>`;
        return;
    }
    tbody.innerHTML = lista.map(p => `
        <tr>
            <td class="text-center"><input type="checkbox" class="form-check-input" /></td>
            <td class="text-center">${fmtFecha(p.fecha)}</td>
            <td>${p.descripcion}</td>
            <td class="text-center"><span class="id-chip">${p.id}</span></td>
            <td class="text-center">${p.tamano}</td>
            <td class="text-center">${p.revision}</td>
            <td class="text-center">${p.subRevision}</td>
            <td>${p.dibujante}</td>
            <td class="text-center"><button class="btn btn-sm btn-outline-primary btn-compact" title="Ver">Ver</button></td>
            <td class="text-center">${estadoBadge(p.estado)}</td>
        </tr>`).join("");
}

function initInicio() {
    let resultados = [...PLANOS_DEMO];
    renderPlanosRows(resultados);
    document.getElementById("planosContador").textContent = `${resultados.length} registro(s) encontrado(s)`;

    const tbody = document.getElementById("planosBody");
    const contador = document.getElementById("planosContador");
    const btnBuscar = document.getElementById("btnBuscar");

    function buscarConLoader() {
        btnBuscar.disabled = true;
        tbody.innerHTML = `
            <tr class="app-loader-overlay-local">
                <td colspan="10">
                    <div class="app-loader-container">
                        <div class="app-loader-spinner"></div>
                        <p class="app-loader-text">Buscando<span class="app-loader-dots"></span></p>
                    </div>
                </td>
            </tr>`;

        setTimeout(() => {
            const desc = (document.getElementById("fDescripcion").value || "").toLowerCase();
            const idp = (document.getElementById("fIdPlano").value || "").toLowerCase();
            const tam = document.getElementById("fTamano").value;
            const dib = (document.getElementById("fDibujante").value || "").toLowerCase();

            resultados = PLANOS_DEMO.filter(p =>
                (!desc || p.descripcion.toLowerCase().includes(desc)) &&
                (!idp || p.id.toLowerCase().includes(idp)) &&
                (!tam || p.tamano === tam) &&
                (!dib || p.dibujante.toLowerCase().includes(dib))
            );
            renderPlanosRows(resultados);
            contador.textContent = `${resultados.length} registro(s) encontrado(s)`;
            btnBuscar.disabled = false;
        }, 900);
    }

    btnBuscar.addEventListener("click", buscarConLoader);

    document.getElementById("btnLimpiar").addEventListener("click", () => {
        document.querySelectorAll("#filtrosPlanos input, #filtrosPlanos select").forEach(el => el.value = "");
        resultados = [...PLANOS_DEMO];
        renderPlanosRows(resultados);
        contador.textContent = `${resultados.length} registro(s) encontrado(s)`;
    });

    // Boton "Agregar plano" (demo)
    const addInput = document.getElementById("fileUploaderPlano");
    const addLabel = document.getElementById("btnAgregarPlano");
    if (addInput) {
        addInput.addEventListener("change", () => {
            if (addInput.files.length) {
                addLabel.classList.add("app-archivo-seleccionado");
                addLabel.querySelector("span").textContent = "Archivo seleccionado";
            }
        });
    }
}

/* ========================================================================
   PAGINA: USUARIOS
   ======================================================================== */
function renderUsuarios() {
    const usuarios = getUsuarios();
    const tbody = document.getElementById("usuariosBody");
    const total = document.getElementById("usuariosTotal");

    if (!usuarios.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No hay usuarios registrados</td></tr>`;
        if (total) total.textContent = "0";
        return;
    }

    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td><span class="badge bg-primary">${u.codID}</span></td>
            <td><strong>${u.nombre}</strong></td>
            <td>${u.nomApe}</td>
            <td><span class="badge bg-info text-dark">${u.area}</span></td>
            <td>${Number(u.cc).toLocaleString("es")}</td>
            <td class="text-center">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-sm btn-warning" onclick="abrirEditarUsuario(${u.codID})" title="Editar usuario">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.codID})" title="Eliminar usuario">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            </td>
        </tr>`).join("");

    if (total) total.textContent = String(usuarios.length);
}

function abrirEditarUsuario(codID) {
    const u = getUsuarios().find(x => x.codID === codID);
    if (!u) return;
    document.getElementById("editCodID").value = u.codID;
    document.getElementById("editUsuario").value = u.nombre;
    document.getElementById("editNomApe").value = u.nomApe;
    document.getElementById("editArea").value = u.area;
    document.getElementById("editCC").value = u.cc;
    document.getElementById("modalEditarUsuario").style.display = "flex";
}

function cerrarEditarUsuario() {
    document.getElementById("modalEditarUsuario").style.display = "none";
}

function guardarEdicionUsuario(e) {
    e.preventDefault();
    const codID = parseInt(document.getElementById("editCodID").value, 10);
    const usuarios = getUsuarios();
    const idx = usuarios.findIndex(x => x.codID === codID);
    if (idx >= 0) {
        usuarios[idx].nombre = document.getElementById("editUsuario").value.trim();
        usuarios[idx].nomApe = document.getElementById("editNomApe").value.trim();
        usuarios[idx].area = document.getElementById("editArea").value.trim();
        usuarios[idx].cc = parseInt(document.getElementById("editCC").value, 10) || 0;
        setUsuarios(usuarios);
    }
    cerrarEditarUsuario();
    renderUsuarios();
}

function eliminarUsuario(codID) {
    if (!confirm("¿Deseas eliminar este usuario? Esta accion no se puede deshacer.")) return;
    setUsuarios(getUsuarios().filter(x => x.codID !== codID));
    renderUsuarios();
}

function initUsuarios() {
    seedUsuarios();
    renderUsuarios();
    const form = document.getElementById("formEditarUsuario");
    if (form) form.addEventListener("submit", guardarEdicionUsuario);
}

/* ========================================================================
   PAGINA: CREAR USUARIO
   ======================================================================== */
function initCrearUsuario() {
    seedUsuarios();
    const form = document.getElementById("formCrearUsuario");
    const exito = document.getElementById("crearExito");
    const error = document.getElementById("crearError");

    // Toggle ver contrasena
    document.querySelectorAll("[data-toggle-pass]").forEach(btn => {
        btn.addEventListener("click", () => {
            const input = document.getElementById(btn.dataset.togglePass);
            const icon = btn.querySelector("i");
            if (input.type === "password") {
                input.type = "text";
                icon.className = "bi bi-eye-slash";
            } else {
                input.type = "password";
                icon.className = "bi bi-eye";
            }
        });
    });

    document.getElementById("btnLimpiarUsuario").addEventListener("click", () => {
        form.reset();
        exito.style.display = "none";
        error.style.display = "none";
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        exito.style.display = "none";
        error.style.display = "none";

        const usuario = form.usuario.value.trim();
        const nomApe = form.nomape.value.trim();
        const area = form.area.value.trim();
        const cc = parseInt(form.cc.value, 10);
        const pass = form.contrasena.value;
        const confirm = form.confirmar.value;

        if (usuario.length < 3) { return showCrearError(error, "El usuario debe tener al menos 3 caracteres"); }
        if (!nomApe) { return showCrearError(error, "El nombre y apellido es requerido"); }
        if (!area) { return showCrearError(error, "El area es requerida"); }
        if (pass.length < 6) { return showCrearError(error, "La contrasena debe tener al menos 6 caracteres"); }
        if (pass !== confirm) { return showCrearError(error, "Las contrasenas no coinciden"); }

        const usuarios = getUsuarios();
        const nuevoId = usuarios.reduce((m, u) => Math.max(m, u.codID), 0) + 1;
        usuarios.push({ codID: nuevoId, nombre: usuario, nomApe, area, cc: cc || 0 });
        setUsuarios(usuarios);

        exito.querySelector("span").textContent = "Usuario creado correctamente. Redirigiendo...";
        exito.style.display = "block";
        form.reset();
        setTimeout(() => { window.location.href = "usuarios.html"; }, 1500);
    });
}
function showCrearError(box, msg) {
    box.querySelector("span").textContent = msg;
    box.style.display = "block";
}

/* ========================================================================
   PAGINA: APROBACIONES (modal)
   ======================================================================== */
function initAprobaciones() {
    window.abrirRevision = function () {
        document.getElementById("modalAprobacion").style.display = "flex";
    };
    window.cerrarAprobacion = function () {
        document.getElementById("modalAprobacion").style.display = "none";
    };
    window.confirmarAprobacion = function () {
        window.cerrarAprobacion();
    };
}

/* ========================================================================
   BOOTSTRAP DE LA PAGINA
   ======================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;

    if (page === "login") { initLogin(); return; }

    // Resto de paginas: requieren sesion + shell
    if (!Auth.require()) return;
    initShell(page);

    switch (page) {
        case "inicio":        initInicio(); break;
        case "usuarios":      initUsuarios(); break;
        case "crear-usuario": initCrearUsuario(); break;
        case "aprobaciones":  initAprobaciones(); break;
        // dashboard e historial no requieren logica adicional
    }
});
