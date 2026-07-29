/* =============================================
   CAMPUSFEST 2026 — Campus_Fest_2.js
   Universidad Cenfotec
   Backend: Express + MongoDB Atlas
   Auth:  POST /usuarios/registro | POST /usuarios/login
   Admin: GET  /usuarios | DELETE /usuarios/:id | PUT /usuarios/:id
============================================= */

const API_URL = 'http://localhost:3000/api';

/* =============================================
   DATOS LOCALES — Actividades y Agenda
   (no están en MongoDB, se mantienen en JS)
============================================= */
const ACTIVIDADES = [
  { id:1, nombre:"Hackathon de IA",          categoria:"tecnologica",  icono:"fa-laptop-code",  fecha:"14 Jul", hora:"08:00", lugar:"Lab A-201",         cupoMax:30,  cupoActual:28,  descripcion:"Competencia intensiva de desarrollo de soluciones usando Inteligencia Artificial. Equipos de 3-4 personas resolverán retos reales propuestos por empresas tecnológicas.", requisitos:"Conocimientos en Python o JavaScript. Traer laptop.",                          destacada:true  },
  { id:2, nombre:"Festival Gastronómico",    categoria:"gastronomica", icono:"fa-utensils",      fecha:"15 Jul", hora:"11:00", lugar:"Plaza Central",      cupoMax:200, cupoActual:120, descripcion:"Degustación de platillos internacionales preparados por estudiantes y grupos gastronómicos del campus. Más de 20 puestos de comida.",                                 requisitos:"Entrada libre. Consumo según disponibilidad.",                              destacada:true  },
  { id:3, nombre:"Exposición de Arte Digital",categoria:"artistica",   icono:"fa-palette",       fecha:"14 Jul", hora:"10:00", lugar:"Galería B",           cupoMax:80,  cupoActual:65,  descripcion:"Muestra de obras digitales creadas por estudiantes: ilustración, diseño UX/UI, motion graphics y fotografía editorial.",                                               requisitos:"No requiere inscripción para visitar. Registro para exponer.",              destacada:true  },
  { id:4, nombre:"Torneo de Fútbol 5",       categoria:"deportiva",    icono:"fa-futbol",        fecha:"16 Jul", hora:"14:00", lugar:"Cancha C",            cupoMax:60,  cupoActual:60,  descripcion:"Torneo relámpago de fútbol sala entre equipos de diferentes carreras.",                                                                                               requisitos:"Equipos de 5 jugadores + 2 suplentes. Ropa deportiva obligatoria.",        destacada:false },
  { id:5, nombre:"Noche de Teatro",          categoria:"cultural",     icono:"fa-masks-theater", fecha:"17 Jul", hora:"19:00", lugar:"Auditorio Principal", cupoMax:120, cupoActual:95,  descripcion:"Presentación de obras breves y performance de teatro improvisado.",                                                                                                    requisitos:"Entrada libre hasta agotar aforo.",                                         destacada:false },
  { id:6, nombre:"Escape Room Tecnológico",  categoria:"recreativa",   icono:"fa-puzzle-piece",  fecha:"15 Jul", hora:"09:00", lugar:"Sala C-105",          cupoMax:20,  cupoActual:16,  descripcion:"Experiencia de escape room temática en tecnología y ciencias de la computación.",                                                                                      requisitos:"Grupos de máximo 4 personas. Reserva previa obligatoria.",                  destacada:false },
  { id:7, nombre:"Taller de Robótica",       categoria:"tecnologica",  icono:"fa-robot",         fecha:"16 Jul", hora:"10:00", lugar:"Lab A-105",           cupoMax:25,  cupoActual:20,  descripcion:"Taller práctico de construcción y programación de robots con Arduino.",                                                                                                 requisitos:"Sin experiencia previa requerida. Materiales incluidos.",                   destacada:false },
  { id:8, nombre:"Jam de Música en Vivo",    categoria:"artistica",    icono:"fa-guitar",        fecha:"18 Jul", hora:"18:00", lugar:"Terraza Norte",       cupoMax:150, cupoActual:40,  descripcion:"Sesión abierta de música en vivo con bandas y artistas de la comunidad universitaria.",                                                                                 requisitos:"Entrada libre. Para tocar: registrar banda antes del 10 de julio.",         destacada:false },
  { id:9, nombre:"Maratón de Danza",         categoria:"cultural",     icono:"fa-music",         fecha:"17 Jul", hora:"15:00", lugar:"Patio Central",       cupoMax:50,  cupoActual:35,  descripcion:"Competencia de baile urbano, tropical y folclórico. Categorías individual y grupal.",                                                                                   requisitos:"Ropa cómoda. Inscripción individual o grupal (máx 6 personas).",            destacada:false }
];

const AGENDA = [
  { dia:"Lunes 14 de Julio",     eventos:[ {hora:"08:00",nombre:"Hackathon de IA — Inicio",          lugar:"Lab A-201",          categoria:"tecnologica", estado:"disponible"}, {hora:"10:00",nombre:"Exposición de Arte Digital",    lugar:"Galería B",          categoria:"artistica",   estado:"disponible"}, {hora:"14:00",nombre:"Ceremonia de Apertura",         lugar:"Auditorio Principal",categoria:"cultural",    estado:"disponible"}, {hora:"19:00",nombre:"Inauguración de Stands",        lugar:"Plaza Central",      categoria:"recreativa",  estado:"disponible"} ] },
  { dia:"Martes 15 de Julio",    eventos:[ {hora:"09:00",nombre:"Escape Room Tecnológico",            lugar:"Sala C-105",         categoria:"recreativa",  estado:"disponible"}, {hora:"11:00",nombre:"Festival Gastronómico",         lugar:"Plaza Central",      categoria:"gastronomica",estado:"disponible"}, {hora:"16:00",nombre:"Hackathon de IA — Presentaciones",lugar:"Lab A-201",       categoria:"tecnologica", estado:"lleno"     } ] },
  { dia:"Miércoles 16 de Julio", eventos:[ {hora:"10:00",nombre:"Taller de Robótica",                lugar:"Lab A-105",          categoria:"tecnologica", estado:"disponible"}, {hora:"14:00",nombre:"Torneo de Fútbol 5",            lugar:"Cancha C",           categoria:"deportiva",   estado:"lleno"     }, {hora:"17:00",nombre:"Charlas de Emprendimiento",    lugar:"Sala B-201",         categoria:"cultural",    estado:"disponible"} ] },
  { dia:"Jueves 17 de Julio",    eventos:[ {hora:"10:00",nombre:"Workshop UX/UI",                    lugar:"Lab Diseño",         categoria:"tecnologica", estado:"disponible"}, {hora:"15:00",nombre:"Maratón de Danza",              lugar:"Patio Central",      categoria:"cultural",    estado:"disponible"}, {hora:"19:00",nombre:"Noche de Teatro",              lugar:"Auditorio Principal",categoria:"cultural",    estado:"disponible"} ] },
  { dia:"Viernes 18 de Julio",   eventos:[ {hora:"10:00",nombre:"Feria de Proyectos Finales",        lugar:"Pabellón A",         categoria:"tecnologica", estado:"disponible"}, {hora:"14:00",nombre:"Premiaciones Hackathon",        lugar:"Auditorio Principal",categoria:"tecnologica", estado:"cancelado"  }, {hora:"18:00",nombre:"Jam de Música en Vivo",        lugar:"Terraza Norte",      categoria:"artistica",   estado:"disponible"}, {hora:"20:00",nombre:"Clausura CampusFest 2026",     lugar:"Plaza Central",      categoria:"cultural",    estado:"disponible"} ] }
];

/* =============================================
   SESIÓN LOCAL
============================================= */
const DOMINIO_ADMIN = '@ucenfotec.ac.cr';

function getSesion()           { return JSON.parse(localStorage.getItem('cf_sesion') || 'null'); }
function guardarSesion(u)      { localStorage.setItem('cf_sesion', JSON.stringify(u)); }
function cerrarSesionStorage() { localStorage.removeItem('cf_sesion'); }
function esCorreoAdmin(c)      { return c.trim().toLowerCase().endsWith(DOMINIO_ADMIN); }

/* =============================================
   MODO OSCURO
============================================= */
function initModoOscuro() {
  const sw = document.getElementById('switchModo');
  if (!sw) return;
  if (localStorage.getItem('modoOscuro') === 'true') {
    document.body.classList.add('modo-oscuro');
    sw.checked = true;
  }
  sw.addEventListener('change', () => {
    const on = sw.checked;
    document.body.classList.toggle('modo-oscuro', on);
    localStorage.setItem('modoOscuro', on);
  });
}

/* =============================================
   ESTADO DE SESIÓN — navbar + vistas
============================================= */
function aplicarEstadoSesion() {
  const sesion = getSesion();
  const btn    = document.getElementById('btnSesion');
  const badge  = document.getElementById('badgeAdmin');
  if (!btn) return;

  if (!sesion) {
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i> Iniciar sesión';
    btn.classList.remove('sesion-activa');
    btn.onclick = abrirModalAuth;
    document.body.classList.remove('modo-admin');
    if (badge) badge.classList.remove('visible');
    // Callback opcional: cada página define _onSesionNula() si necesita limpiar algo
    if (typeof _onSesionNula === 'function') _onSesionNula();
    return;
  }

  const primerNombre = sesion.nombre.split(' ')[0];
  btn.innerHTML = `<i class="fa-solid fa-circle-user" aria-hidden="true"></i> ${primerNombre} &nbsp;<small style="opacity:.7;font-size:.72rem;">(Cerrar sesión)</small>`;
  btn.classList.add('sesion-activa');
  btn.onclick = confirmarCerrarSesion;

  if (esCorreoAdmin(sesion.correo)) {
    document.body.classList.add('modo-admin');
    if (badge) badge.classList.add('visible');
    // Callback opcional: cada página define _onSesionAdmin() con su propia lógica
    if (typeof _onSesionAdmin === 'function') _onSesionAdmin();
  } else {
    document.body.classList.remove('modo-admin');
    if (badge) badge.classList.remove('visible');
    // Callback opcional: cada página define _onSesionVisitante() si necesita algo
    if (typeof _onSesionVisitante === 'function') _onSesionVisitante();
  }
}

/* ── Callbacks de sesión para inicio.html ──────
   Solo se definen si los elementos existen en la página.
   inscripcion.html define los suyos en inscripcion.js.
───────────────────────────────────────────── */
function _onSesionAdmin() {
  // inicio.html: oculta actividades, muestra tabla de usuarios
  const sec  = document.getElementById('seccionUsuarios');
  const dest = document.getElementById('seccionDestacadas');
  if (sec)  { sec.style.display  = 'block'; cargarTablaUsuarios(); }
  if (dest) dest.style.display = 'none';
}

function _onSesionVisitante() {
  // inicio.html: oculta tabla de usuarios, muestra actividades
  const sec  = document.getElementById('seccionUsuarios');
  const dest = document.getElementById('seccionDestacadas');
  if (sec)  sec.style.display  = 'none';
  if (dest) dest.style.display = '';
}

function _onSesionNula() {
  // inicio.html: igual que visitante
  _onSesionVisitante();
}

/* =============================================
   MODAL AUTH — abrir / tabs
============================================= */
function abrirModalAuth() {
  limpiarCamposAuth();   // limpia valores antes de abrir
  cambiarTab('login');
  const el = document.getElementById('modalAuth');
  if (el) bootstrap.Modal.getOrCreateInstance(el).show();
}

function cambiarTab(cual) {
  ['login','registro'].forEach(t => {
    const tab   = document.getElementById('tab'   + _cap(t));
    const panel = document.getElementById('panel' + _cap(t));
    if (!tab || !panel) return;
    const on = (t === cual);
    tab.classList.toggle('activo', on);
    panel.classList.toggle('activo', on);
    tab.setAttribute('aria-selected', on);
  });
  limpiarCamposAuth();   // limpia valores Y errores al cambiar de tab
}

function _cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* Limpia solo los bordes de error (is-invalid) */
function limpiarErroresAuth() {
  document.querySelectorAll('#modalAuth .is-invalid')
    .forEach(el => el.classList.remove('is-invalid'));
}

/* Limpia valores de todos los campos del modal + hints + errores */
function limpiarCamposAuth() {
  // Campos de LOGIN
  ['loginCedula', 'loginCorreo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Campos de REGISTRO
  ['regNombre', 'regCedula', 'regTelefono', 'regCarrera', 'regCorreo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Hints de dominio
  ['loginDominioHint', 'regDominioHint'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.className = 'dominio-hint dominio-no'; }
  });

  // Quitar marcas de error
  limpiarErroresAuth();
}

function marcarInvalido(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('is-invalid');
}

/* ── Hints dinámicos de dominio ── */
function mostrarHintRegistro(val) {
  const h = document.getElementById('regDominioHint');
  if (!h) return;
  if (!val) { h.textContent = ''; return; }
  if (esCorreoAdmin(val)) {
    h.className = 'dominio-hint dominio-admin';
    h.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Correo institucional — rol <strong>Administrador</strong>';
  } else {
    h.className = 'dominio-hint dominio-no';
    h.innerHTML = '<i class="fa-solid fa-circle-info"></i> Correo no institucional — rol <strong>Visitante</strong>';
  }
}

function mostrarHintLogin(val) {
  const h = document.getElementById('loginDominioHint');
  if (!h) return;
  if (!val) { h.textContent = ''; return; }
  if (esCorreoAdmin(val)) {
    h.className = 'dominio-hint dominio-admin';
    h.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Acceso de <strong>Administrador</strong>';
  } else {
    h.className = 'dominio-hint dominio-no';
    h.innerHTML = '<i class="fa-solid fa-circle-info"></i> Acceso de <strong>Visitante</strong>';
  }
}

/* =============================================
   POST /usuarios/registro — HTTP POST → MongoDB
============================================= */
async function procesarRegistro() {
  limpiarErroresAuth();
  const nombre  = document.getElementById('regNombre').value.trim();
  const cedula  = document.getElementById('regCedula').value.trim();
  const tel     = document.getElementById('regTelefono').value.trim();
  const carrera = document.getElementById('regCarrera').value.trim();
  const correo  = document.getElementById('regCorreo').value.trim().toLowerCase();

  let ok = true;
  if (!nombre)  { marcarInvalido('regNombre');   ok = false; }
  if (!cedula)  { marcarInvalido('regCedula');   ok = false; }
  if (!tel)     { marcarInvalido('regTelefono'); ok = false; }
  if (!carrera) { marcarInvalido('regCarrera');  ok = false; }
  if (!correo || !correo.includes('@') || !correo.includes('.')) { marcarInvalido('regCorreo'); ok = false; }

  if (!ok) {
    Swal.fire({ icon:'warning', title:'Campos incompletos', text:'Completá todos los campos obligatorios.', confirmButtonColor:'#006AEA' });
    return;
  }

  Swal.fire({ title:'Registrando...', allowOutsideClick:false, didOpen:() => Swal.showLoading() });

  try {
    const res  = await fetch(`${API_URL}/usuarios/registro`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ nombre, identificacion:cedula, telefono:tel, carrera, correo })
    });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ icon:'error', title:'Error al registrarse', text:data.msj, confirmButtonColor:'#006AEA' });
      if (res.status === 409) cambiarTab('login');
      return;
    }

    guardarSesion(data);
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAuth')).hide();
    aplicarEstadoSesion();

    Swal.fire({
      icon:'success',
      title: data.rol === 'admin' ? '¡Bienvenido, Administrador!' : '¡Registro exitoso!',
      html:`<p>Hola, <strong>${data.nombre}</strong>.</p>
            <p style="margin-top:.5rem;">Rol asignado: <strong>${data.rol === 'admin' ? 'Administrador' : 'Visitante'}</strong></p>`,
      confirmButtonColor:'#006AEA', timer:3000, timerProgressBar:true
    });

  } catch {
    Swal.fire({ icon:'error', title:'Sin conexión', text:'Verificá que el servidor esté corriendo en localhost:3000.', confirmButtonColor:'#006AEA' });
  }
}

/* =============================================
   POST /usuarios/login — HTTP POST → MongoDB
============================================= */
async function procesarLogin() {
  limpiarErroresAuth();
  const cedula = document.getElementById('loginCedula').value.trim();
  const correo = document.getElementById('loginCorreo').value.trim().toLowerCase();

  let ok = true;
  if (!cedula) { marcarInvalido('loginCedula');  ok = false; }
  if (!correo || !correo.includes('@')) { marcarInvalido('loginCorreo'); ok = false; }

  if (!ok) {
    Swal.fire({ icon:'warning', title:'Campos incompletos', text:'Ingresá tu cédula y correo.', confirmButtonColor:'#006AEA' });
    return;
  }

  Swal.fire({ title:'Verificando...', allowOutsideClick:false, didOpen:() => Swal.showLoading() });

  try {
    const res  = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ identificacion:cedula, correo })
    });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ icon:'error', title:'Credenciales incorrectas', text:data.msj, confirmButtonColor:'#006AEA' });
      return;
    }

    guardarSesion(data);
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAuth')).hide();
    aplicarEstadoSesion();

    Swal.fire({
      icon:'success',
      title: data.rol === 'admin' ? '¡Bienvenido, Administrador!' : '¡Bienvenido!',
      html:`<p>Hola de nuevo, <strong>${data.nombre.split(' ')[0]}</strong>.</p>
            <p style="margin-top:.5rem;font-size:.9rem;color:#666;">
              Sesión iniciada como <strong>${data.rol === 'admin' ? 'Administrador' : 'Visitante'}</strong>
            </p>`,
      confirmButtonColor:'#006AEA', timer:2500, timerProgressBar:true
    });

  } catch {
    Swal.fire({ icon:'error', title:'Sin conexión', text:'Verificá que el servidor esté corriendo en localhost:3000.', confirmButtonColor:'#006AEA' });
  }
}

/* =============================================
   CERRAR SESIÓN
============================================= */
function confirmarCerrarSesion() {
  Swal.fire({
    icon:'question', title:'Cerrar sesión', text:'¿Querés cerrar tu sesión actual?',
    showCancelButton:true, confirmButtonColor:'#d2232a', cancelButtonColor:'#7c7b75',
    confirmButtonText:'Sí, salir', cancelButtonText:'Cancelar'
  }).then(r => {
    if (r.isConfirmed) {
      cerrarSesionStorage();
      aplicarEstadoSesion();
      Swal.fire({ icon:'info', title:'Sesión cerrada', text:'Hasta pronto.', confirmButtonColor:'#006AEA', timer:1800, showConfirmButton:false, toast:true, position:'top-end' });
    }
  });
}

/* =============================================
   GET /usuarios — Tabla de usuarios (admin)
   Se llama automáticamente al detectar sesión admin.
   Guarda los datos en _usuariosCache para el filtro.
============================================= */
let _usuariosCache = [];   // Cache para búsqueda/filtro sin re-fetch

async function cargarTablaUsuarios() {
  const secUsuarios   = document.getElementById('seccionUsuarios');
  const secDestacadas = document.getElementById('seccionDestacadas');
  if (!secUsuarios) return;   // No estamos en inicio.html

  // Intercambiar secciones
  if (secDestacadas) secDestacadas.style.display = 'none';
  secUsuarios.style.display = 'block';

  const tbody = document.getElementById('tablaUsuariosCuerpo');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="7" class="text-center py-5">
        <div class="spinner-border text-primary" role="status" aria-label="Cargando"></div>
        <p class="mt-2 text-muted mb-0">Cargando usuarios desde MongoDB...</p>
      </td>
    </tr>`;

  try {
    // ── HTTP GET /usuarios ─────────────────────
    const res  = await fetch(`${API_URL}/usuarios`);
    const data = await res.json();

    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">
        <i class="fa-solid fa-triangle-exclamation fa-2x mb-2 d-block"></i>
        Error al obtener usuarios: ${data.msj}
      </td></tr>`;
      return;
    }

    _usuariosCache = data;
    _renderFilaUsuarios(data);
    _actualizarContadores(data);

  } catch {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger py-5">
          <i class="fa-solid fa-triangle-exclamation fa-2x mb-2 d-block"></i>
          Sin conexión con el servidor.<br>
          <small class="text-muted">Verificá que el backend esté corriendo en localhost:3000</small>
        </td>
      </tr>`;
  }
}

/* Renderiza filas de la tabla con los datos recibidos */
function _renderFilaUsuarios(data) {
  const tbody   = document.getElementById('tablaUsuariosCuerpo');
  const infoEl  = document.getElementById('tablaInfo');
  if (!tbody) return;

  if (infoEl) infoEl.textContent = `Mostrando ${data.length} de ${_usuariosCache.length} registros`;

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted py-5">
          <i class="fa-solid fa-users-slash fa-2x mb-2 d-block"></i>
          No se encontraron usuarios con esos criterios.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = data.map(u => `
    <tr>
      <td class="ps-4 fw-bold">${u.nombre}</td>
      <td>${u.identificacion}</td>
      <td>
        <a href="mailto:${u.correo}" class="text-decoration-none"
           style="color:var(--azul-principal);">${u.correo}</a>
      </td>
      <td>${u.telefono}</td>
      <td>${u.carrera}</td>
      <td class="text-center">
        <span class="badge ${u.rol === 'admin' ? 'bg-warning text-dark' : 'bg-primary'}">
          <i class="fa-solid ${u.rol === 'admin' ? 'fa-shield-halved' : 'fa-user'}"></i>
          ${u.rol === 'admin' ? 'Admin' : 'Visitante'}
        </span>
      </td>
      <td class="text-center pe-4">
        <button class="btn btn-sm btn-outline-warning me-1"
                onclick="abrirModalEditar('${u._id}','${_esc(u.nombre)}','${_esc(u.identificacion)}','${_esc(u.telefono)}','${_esc(u.carrera)}','${_esc(u.correo)}')"
                aria-label="Editar usuario ${u.nombre}">
          <i class="fa-solid fa-pen" aria-hidden="true"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger"
                onclick="eliminarUsuario('${u._id}','${_esc(u.nombre)}')"
                aria-label="Eliminar usuario ${u.nombre}">
          <i class="fa-solid fa-trash" aria-hidden="true"></i>
        </button>
      </td>
    </tr>`).join('');
}

/* Actualiza las tarjetas de resumen */
function _actualizarContadores(data) {
  const admins    = data.filter(u => u.rol === 'admin').length;
  const visitantes= data.filter(u => u.rol === 'visitante').length;
  const el = id => document.getElementById(id);
  if (el('contadorUsuarios')) el('contadorUsuarios').textContent = data.length;
  if (el('resumenTotal'))     el('resumenTotal').textContent     = data.length;
  if (el('resumenAdmins'))    el('resumenAdmins').textContent    = admins;
  if (el('resumenVisitantes'))el('resumenVisitantes').textContent= visitantes;
}

/* Filtra la tabla por texto libre + selector de rol (sin re-fetch) */
function filtrarTablaUsuarios(texto) {
  const rol  = document.getElementById('filtroRol')?.value || '';
  const q    = (texto || '').toLowerCase();
  const filtrados = _usuariosCache.filter(u => {
    const coincideTexto = !q ||
      u.nombre.toLowerCase().includes(q) ||
      u.correo.toLowerCase().includes(q) ||
      u.carrera.toLowerCase().includes(q) ||
      u.identificacion.toLowerCase().includes(q);
    const coincideRol = !rol || u.rol === rol;
    return coincideTexto && coincideRol;
  });
  _renderFilaUsuarios(filtrados);
}

/* Escapa comillas simples para evitar romper los onclick inline */
function _esc(s) { return (s || '').replace(/'/g, "\\'"); }

/* =============================================
   DELETE /usuarios/:id — HTTP DELETE
============================================= */
async function eliminarUsuario(id, nombre) {
  const result = await Swal.fire({
    icon:'warning', title:'¿Eliminar usuario?',
    html:`¿Seguro que querés eliminar a <strong>${nombre}</strong>?<br><small class="text-muted">Esta acción no se puede deshacer.</small>`,
    showCancelButton:true, confirmButtonColor:'#d2232a', cancelButtonColor:'#7c7b75',
    confirmButtonText:'Sí, eliminar', cancelButtonText:'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    const res  = await fetch(`${API_URL}/usuarios/${id}`, { method:'DELETE' });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ icon:'error', title:'Error', text:data.msj, confirmButtonColor:'#006AEA' });
      return;
    }

    Swal.fire({ icon:'success', title:'Usuario eliminado', text:`${nombre} fue eliminado correctamente.`, confirmButtonColor:'#006AEA', timer:2000, timerProgressBar:true });
    cargarTablaUsuarios();

  } catch {
    Swal.fire({ icon:'error', title:'Sin conexión', text:'No se pudo conectar con el servidor.', confirmButtonColor:'#006AEA' });
  }
}

/* =============================================
   PUT /usuarios/:id — Modal edición
============================================= */
function abrirModalEditar(id, nombre, identificacion, telefono, carrera, correo) {
  const cuerpo = document.getElementById('modalAdminCuerpo');
  const titulo = document.getElementById('modalAdminTitulo');
  if (!cuerpo) return;
  if (titulo) titulo.innerHTML = '<i class="fa-solid fa-pen"></i> Editar Usuario';

  cuerpo.innerHTML = `
    <div class="mb-3">
      <label class="form-label">Nombre completo <span class="requerido">*</span></label>
      <input type="text" id="editNombre" class="form-control" value="${nombre}" />
    </div>
    <div class="row g-3 mb-3">
      <div class="col-md-6">
        <label class="form-label">Identificación <span class="requerido">*</span></label>
        <input type="text" id="editCedula" class="form-control" value="${identificacion}" />
      </div>
      <div class="col-md-6">
        <label class="form-label">Teléfono <span class="requerido">*</span></label>
        <input type="tel" id="editTelefono" class="form-control" value="${telefono}" />
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Carrera <span class="requerido">*</span></label>
      <input type="text" id="editCarrera" class="form-control" value="${carrera}" />
    </div>
    <div class="mb-4">
      <label class="form-label">Correo electrónico <span class="requerido">*</span></label>
      <input type="email" id="editCorreo" class="form-control" value="${correo}"
             oninput="mostrarHintEditar(this.value)" />
      <p class="dominio-hint" id="editDominioHint"></p>
    </div>
    <button type="button" class="btn btn-primario w-100 justify-content-center"
            onclick="guardarEdicion('${id}')">
      <i class="fa-solid fa-floppy-disk"></i> Guardar cambios
    </button>`;

  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAdmin')).show();
}

function mostrarHintEditar(val) {
  const h = document.getElementById('editDominioHint');
  if (!h || !val) return;
  if (esCorreoAdmin(val)) {
    h.className = 'dominio-hint dominio-admin';
    h.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Correo institucional — rol <strong>Administrador</strong>';
  } else {
    h.className = 'dominio-hint dominio-no';
    h.innerHTML = '<i class="fa-solid fa-circle-info"></i> Correo no institucional — rol <strong>Visitante</strong>';
  }
}

async function guardarEdicion(id) {
  const nombre         = document.getElementById('editNombre').value.trim();
  const identificacion = document.getElementById('editCedula').value.trim();
  const telefono       = document.getElementById('editTelefono').value.trim();
  const carrera        = document.getElementById('editCarrera').value.trim();
  const correo         = document.getElementById('editCorreo').value.trim().toLowerCase();

  if (!nombre || !identificacion || !telefono || !carrera || !correo) {
    Swal.fire({ icon:'warning', title:'Campos incompletos', text:'Completá todos los campos.', confirmButtonColor:'#006AEA' });
    return;
  }

  Swal.fire({ title:'Guardando...', allowOutsideClick:false, didOpen:() => Swal.showLoading() });

  try {
    const res  = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ nombre, identificacion, telefono, carrera, correo })
    });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ icon:'error', title:'Error al actualizar', text:data.msj, confirmButtonColor:'#006AEA' });
      return;
    }

    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAdmin')).hide();
    Swal.fire({ icon:'success', title:'Usuario actualizado', text:`${data.nombre} fue actualizado correctamente.`, confirmButtonColor:'#006AEA', timer:2000, timerProgressBar:true });
    cargarTablaUsuarios();

  } catch {
    Swal.fire({ icon:'error', title:'Sin conexión', text:'No se pudo conectar con el servidor.', confirmButtonColor:'#006AEA' });
  }
}

/* =============================================
   UTILIDADES — Cupos y Categorías
============================================= */
function getCupoInfo(act) {
  const pct = (act.cupoActual / act.cupoMax) * 100;
  let clase='cupo-ok', estadoLabel='Disponible', estadoClase='estado-disponible';
  if (pct >= 100) { clase='cupo-lleno'; estadoLabel='Lleno';       estadoClase='estado-lleno'; }
  else if (pct >= 80) { clase='cupo-alerta'; estadoLabel='Casi lleno'; estadoClase='estado-lleno'; }
  return { pct, libre: act.cupoMax - act.cupoActual, clase, estadoLabel, estadoClase };
}

const NOMBRES_CAT = { cultural:'Cultural', deportiva:'Deportiva', tecnologica:'Tecnológica', artistica:'Artística', gastronomica:'Gastronómica', recreativa:'Recreativa' };
const ICONOS_CAT  = { cultural:'fa-masks-theater', deportiva:'fa-futbol', tecnologica:'fa-laptop-code', artistica:'fa-palette', gastronomica:'fa-utensils', recreativa:'fa-gamepad' };
const CLASES_CAT  = { cultural:'tag-cultural', deportiva:'tag-deportiva', tecnologica:'tag-tecnologica', artistica:'tag-artistica', gastronomica:'tag-gastronomica', recreativa:'tag-recreativa' };

function getCategoriaTag(cat) {
  return `<span class="tag ${CLASES_CAT[cat]}"><i class="fa-solid ${ICONOS_CAT[cat]}" aria-hidden="true"></i> ${NOMBRES_CAT[cat]}</span>`;
}

/* =============================================
   RENDER — Tarjeta actividad
============================================= */
function renderTarjetaActividad(act) {
  const ci = getCupoInfo(act);
  return `
    <div class="col-12 col-md-6 col-lg-4">
      <article class="tarjeta">
        <div class="tarjeta-imagen" aria-hidden="true"><i class="fa-solid ${act.icono}"></i></div>
        <div class="tarjeta-cuerpo">
          ${getCategoriaTag(act.categoria)}
          <h3 class="tarjeta-titulo">${act.nombre}</h3>
          <div class="tarjeta-meta">
            <span><i class="fa-regular fa-calendar"></i> ${act.fecha}</span>
            <span><i class="fa-regular fa-clock"></i> ${act.hora}</span>
            <span><i class="fa-solid fa-location-dot"></i> ${act.lugar}</span>
          </div>
          ${ci.pct >= 80 && ci.pct < 100 ? `<div class="alerta-baja-disponibilidad" role="alert"><i class="fa-solid fa-triangle-exclamation"></i> ¡Quedan solo ${ci.libre} cupos!</div>` : ''}
          <div class="cupo-barra"><div class="cupo-progreso ${ci.clase}" style="width:${Math.min(ci.pct,100)}%"></div></div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span style="font-size:.78rem;color:var(--texto-secundario);">${act.cupoActual}/${act.cupoMax} inscritos</span>
            <span class="estado-pill ${ci.estadoClase}">${ci.estadoLabel}</span>
          </div>
          <button type="button" class="btn btn-primario btn-sm"
                  data-bs-toggle="modal" data-bs-target="#modalDetalle"
                  onclick="abrirDetalle(${act.id})">
            <i class="fa-solid fa-magnifying-glass"></i> Ver detalle
          </button>
        </div>
      </article>
    </div>`;
}

function renderDestacadas() {
  const g = document.getElementById('actividadesDestacadas');
  if (g) g.innerHTML = ACTIVIDADES.filter(a => a.destacada).slice(0,3).map(renderTarjetaActividad).join('');
}

/* =============================================
   MODAL DETALLE ACTIVIDAD
============================================= */
function abrirDetalle(id) {
  const act = ACTIVIDADES.find(a => a.id === id);
  if (!act) return;
  const ci = getCupoInfo(act);
  document.getElementById('modalTag').innerHTML      = getCategoriaTag(act.categoria);
  document.getElementById('modalTitulo').textContent = act.nombre;
  document.getElementById('modalEstado').innerHTML   = `<span class="estado-pill ${ci.estadoClase}">${ci.estadoLabel}</span>`;
  document.getElementById('modalCuerpo').innerHTML   = `
    <div class="modal-campo"><div class="modal-campo-label">Descripción</div><div class="modal-campo-valor">${act.descripcion}</div></div>
    <div class="row g-3">
      <div class="col-6"><div class="modal-campo"><div class="modal-campo-label"><i class="fa-regular fa-calendar"></i> Fecha</div><div class="modal-campo-valor fw-bold">${act.fecha}, 2026</div></div></div>
      <div class="col-6"><div class="modal-campo"><div class="modal-campo-label"><i class="fa-regular fa-clock"></i> Hora</div><div class="modal-campo-valor fw-bold">${act.hora} hrs</div></div></div>
      <div class="col-6"><div class="modal-campo"><div class="modal-campo-label"><i class="fa-solid fa-location-dot"></i> Lugar</div><div class="modal-campo-valor fw-bold">${act.lugar}</div></div></div>
      <div class="col-6"><div class="modal-campo"><div class="modal-campo-label"><i class="fa-solid fa-users"></i> Cupos</div><div class="modal-campo-valor fw-bold">${ci.libre > 0 ? ci.libre + ' disponibles' : 'Agotados'} de ${act.cupoMax}</div></div></div>
    </div>
    <div class="modal-campo"><div class="modal-campo-label"><i class="fa-solid fa-clipboard-list"></i> Requisitos</div><div class="modal-campo-valor">${act.requisitos}</div></div>
    <button type="button" class="btn ${ci.libre > 0 ? 'btn-primario':'btn-acento'} w-100 justify-content-center"
            data-bs-dismiss="modal"
            onclick="window.location.href='inscripcion.html?actividad=${act.id}'">
      ${ci.libre > 0 ? '<i class="fa-solid fa-pen-to-square"></i> Inscribirme' : '<i class="fa-solid fa-list-check"></i> Lista de espera'}
    </button>`;
}

/* =============================================
   RENDER — Agenda
============================================= */
const EST_CLS = { disponible:'estado-disponible', lleno:'estado-lleno', cancelado:'estado-cancelado' };
const EST_ICO = { disponible:'fa-circle-check',   lleno:'fa-circle-exclamation', cancelado:'fa-circle-xmark' };
const EST_LBL = { disponible:'Disponible',         lleno:'Lleno',                 cancelado:'Cancelado' };

function renderAgenda() {
  const c = document.getElementById('agendaContenido');
  if (!c) return;
  c.innerHTML = AGENDA.map(d => `
    <div class="agenda-grupo-fecha"><i class="fa-regular fa-calendar-days"></i> ${d.dia}</div>
    ${d.eventos.map(e => `
    <div class="agenda-fila">
      <div class="agenda-hora">${e.hora}</div>
      <div><div class="agenda-nombre">${e.nombre}</div>
           <div class="agenda-lugar"><i class="fa-solid fa-location-dot"></i> ${e.lugar}</div></div>
      <div>${getCategoriaTag(e.categoria)}</div>
      <div><span class="estado-pill ${EST_CLS[e.estado]}"><i class="fa-solid ${EST_ICO[e.estado]}"></i> ${EST_LBL[e.estado]}</span></div>
      <div class="admin-controles">
        <button class="btn btn-secundario btn-sm" onclick="editarEvento('${e.nombre}')"><i class="fa-solid fa-pen"></i></button>
      </div>
    </div>`).join('')}`).join('');
}

/* =============================================
   FORMULARIO DE INSCRIPCIÓN
============================================= */
function poblarSelectActividades() {
  const sel = document.getElementById('inpActividad');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Seleccioná una actividad —</option>';
  ACTIVIDADES.forEach(a => {
    const ci  = getCupoInfo(a);
    const opt = document.createElement('option');
    opt.value       = a.id;
    opt.textContent = ci.pct >= 100 ? `${a.nombre} (Lista de espera)` : `${a.nombre} — ${ci.libre} cupos`;
    sel.appendChild(opt);
  });
  const actId = new URLSearchParams(window.location.search).get('actividad');
  if (actId) { sel.value = actId; verificarCupoActividad(actId); }
}

function verificarCupoActividad(id) {
  const al = document.getElementById('alertaCupo');
  const tx = document.getElementById('alertaCupoTexto');
  if (!al || !tx || !id) { if (al) al.style.display='none'; return; }
  const act = ACTIVIDADES.find(a => a.id == id);
  if (!act) return;
  const ci = getCupoInfo(act);
  if      (ci.pct >= 100) { tx.textContent=`"${act.nombre}" no tiene cupos. Quedás en lista de espera.`; al.style.display='flex'; }
  else if (ci.pct >= 80)  { tx.textContent=`¡Solo quedan ${ci.libre} cupos para "${act.nombre}"!`;       al.style.display='flex'; }
  else                    { al.style.display='none'; }
}

function enviarInscripcion() {
  const nombre  = document.getElementById('inpNombre').value.trim();
  const ident   = document.getElementById('inpIdentificacion').value.trim();
  const correo  = document.getElementById('inpCorreo').value.trim();
  const tel     = document.getElementById('inpTelefono').value.trim();
  const carrera = document.getElementById('inpCarrera').value.trim();
  const actId   = document.getElementById('inpActividad').value;
  ['inpNombre','inpIdentificacion','inpCorreo','inpTelefono','inpCarrera','inpActividad'].forEach(i => document.getElementById(i)?.classList.remove('is-invalid'));
  const err = [];
  if (!nombre)  { err.push('Nombre');         document.getElementById('inpNombre').classList.add('is-invalid'); }
  if (!ident)   { err.push('Identificación'); document.getElementById('inpIdentificacion').classList.add('is-invalid'); }
  if (!correo || !correo.includes('@')) { err.push('Correo'); document.getElementById('inpCorreo').classList.add('is-invalid'); }
  if (!tel)     { err.push('Teléfono');       document.getElementById('inpTelefono').classList.add('is-invalid'); }
  if (!carrera) { err.push('Carrera');        document.getElementById('inpCarrera').classList.add('is-invalid'); }
  if (!actId)   { err.push('Actividad');      document.getElementById('inpActividad').classList.add('is-invalid'); }
  if (err.length) { Swal.fire({ icon:'error', title:'Campos incompletos', html:`<ul style="text-align:left">${err.map(e=>`<li>${e}</li>`).join('')}</ul>`, confirmButtonColor:'#006AEA' }); return; }
  const act = ACTIVIDADES.find(a => a.id == actId);
  const ci  = getCupoInfo(act);
  if (ci.pct >= 100) {
    Swal.fire({ icon:'info', title:'Lista de Espera', html:`<p><strong>"${act.nombre}"</strong> está llena.</p><p>Te notificamos a <strong>${correo}</strong> si se habilitan cupos.</p>`, confirmButtonColor:'#ffc63e' });
  } else {
    Swal.fire({ icon:'success', title:'¡Inscripción Confirmada!', html:`<p>¡Hola, <strong>${nombre}</strong>!</p><p>Inscripción en <strong>"${act.nombre}"</strong> confirmada.</p>`, confirmButtonColor:'#006AEA', confirmButtonText:'Volver al inicio' }).then(r => { if (r.isConfirmed) window.location.href='inicio.html'; });
    act.cupoActual = Math.min(act.cupoActual + 1, act.cupoMax);
    poblarSelectActividades();
  }
}

/* =============================================
   PANEL ADMIN — Formularios de Agenda/Actividad
============================================= */
function mostrarFormAgenda() {
  const opDias = AGENDA.map(d=>`<option>${d.dia}</option>`).join('');
  const opCats = Object.entries(NOMBRES_CAT).map(([v,n])=>`<option value="${v}">${n}</option>`).join('');
  document.getElementById('modalAdminCuerpo').innerHTML = `
    <div class="mb-3"><label class="form-label">Nombre del evento <span class="requerido">*</span></label><input class="form-control" /></div>
    <div class="row g-3 mb-3">
      <div class="col-6"><label class="form-label">Día <span class="requerido">*</span></label><select class="form-select">${opDias}</select></div>
      <div class="col-6"><label class="form-label">Hora <span class="requerido">*</span></label><input type="time" class="form-control" /></div>
    </div>
    <div class="mb-3"><label class="form-label">Lugar <span class="requerido">*</span></label><input class="form-control" /></div>
    <div class="mb-3"><label class="form-label">Categoría</label><select class="form-select"><option value="">Seleccioná...</option>${opCats}</select></div>
    <button type="button" class="btn btn-primario w-100 justify-content-center" onclick="guardadoExitoso('modalAdmin')"><i class="fa-solid fa-floppy-disk"></i> Agregar a Agenda</button>`;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAdmin')).show();
}

function mostrarFormActividad() {
  const opCats = Object.entries(NOMBRES_CAT).map(([v,n])=>`<option value="${v}">${n}</option>`).join('');
  document.getElementById('modalAdminCuerpo').innerHTML = `
    <div class="mb-3"><label class="form-label">Nombre <span class="requerido">*</span></label><input class="form-control" /></div>
    <div class="mb-3"><label class="form-label">Categoría <span class="requerido">*</span></label><select class="form-select"><option value="">Seleccioná...</option>${opCats}</select></div>
    <div class="row g-3 mb-3">
      <div class="col-6"><label class="form-label">Fecha <span class="requerido">*</span></label><input type="date" class="form-control" /></div>
      <div class="col-6"><label class="form-label">Hora <span class="requerido">*</span></label><input type="time" class="form-control" /></div>
    </div>
    <div class="mb-3"><label class="form-label">Lugar <span class="requerido">*</span></label><input class="form-control" /></div>
    <div class="mb-3"><label class="form-label">Cupos máximos <span class="requerido">*</span></label><input type="number" min="1" class="form-control" /></div>
    <div class="mb-3"><label class="form-label">Descripción</label><textarea class="form-control" rows="3"></textarea></div>
    <button type="button" class="btn btn-primario w-100 justify-content-center" onclick="guardadoExitoso('modalAdmin')"><i class="fa-solid fa-floppy-disk"></i> Guardar Actividad</button>`;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAdmin')).show();
}

function guardadoExitoso(modalId) {
  bootstrap.Modal.getOrCreateInstance(document.getElementById(modalId)).hide();
  Swal.fire({ icon:'success', title:'Guardado', text:'El registro fue guardado exitosamente.', confirmButtonColor:'#006AEA', timer:2000, showConfirmButton:false, toast:true, position:'top-end' });
}

function editarEvento(nombre) {
  Swal.fire({ icon:'info', title:'Editar Evento', text:`Editando: "${nombre}"`, confirmButtonColor:'#006AEA' });
}

/* =============================================
   INICIALIZACIÓN
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initModoOscuro();

  // renderDestacadas y renderAgenda solo existen en sus páginas
  // poblarSelectActividades usa #inpActividad de inicio — no confundir con
  // #inpActividad de inscripcion.html que lo maneja inscripcion.js
  renderDestacadas();
  renderAgenda();

  // poblarSelectActividades solo actúa si existe actividadesDestacadas (inicio.html)
  // En inscripcion.html lo hace poblarSelectInscripcion() de inscripcion.js
  if (document.getElementById('actividadesDestacadas')) {
    poblarSelectActividades();
  }

  // aplicarEstadoSesion dispara _onSesionAdmin / _onSesionVisitante / _onSesionNula
  // Cada página define esos callbacks en su propio JS antes de este punto
  aplicarEstadoSesion();
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function procesarContacto(event) {
    event.preventDefault();
    const form = document.getElementById('formContacto');
    
    // Validación nativa de HTML5/Bootstrap
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const datosContacto = {
        nombre: document.getElementById("txtNombreContacto").value,
        correo: document.getElementById("txtCorreoContacto").value,
        asunto: document.getElementById("txtAsunto").value,
        mensaje: document.getElementById("txtMensaje").value
    };

    try {
        const response = await fetch("http://localhost:3000/api/contactos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosContacto)
        });

        if (response.ok) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Tu mensaje fue enviado y guardado correctamente.',
                icon: 'success'
            });
            form.reset();
            form.classList.remove('was-validated');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detalle || "Error al guardar");
        }
    } catch (error) {
        Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
    }
}