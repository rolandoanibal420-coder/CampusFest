/* =============================================
   CAMPUSFEST 2026 — stands.js
   Página: stands.html
   Depende de: Campus_Fest_2.js
   Backend: GET/POST/PUT/DELETE /stands
============================================= */
 
/* Cache y filtros */
let _standsCache    = [];
let _filtroCategoria= '';
let _filtroBusqueda = '';
 
/* =============================================
   CATÁLOGOS DE PRESENTACIÓN
============================================= */
const NOMBRES_CAT_ST = {
  cultural:     'Cultural',
  deportiva:    'Deportiva',
  tecnologica:  'Tecnológica',
  artistica:    'Artística',
  gastronomica: 'Gastronómica',
  recreativa:   'Recreativa'
};
 
const ICONOS_CAT_ST = {
  cultural:     'fa-masks-theater',
  deportiva:    'fa-futbol',
  tecnologica:  'fa-laptop-code',
  artistica:    'fa-palette',
  gastronomica: 'fa-utensils',
  recreativa:   'fa-gamepad'
};
 
const CLASES_CAT_ST = {
  cultural:     'tag-cultural',
  deportiva:    'tag-deportiva',
  tecnologica:  'tag-tecnologica',
  artistica:    'tag-artistica',
  gastronomica: 'tag-gastronomica',
  recreativa:   'tag-recreativa'
};
 
/* =============================================
   CALLBACKS DE SESIÓN
   Sobreescriben los de Campus_Fest_2.js
============================================= */
function _onSesionAdmin() {
  document.body.classList.add('modo-admin');
  cargarStandsAdmin();
}
 
function _onSesionVisitante() {
  document.body.classList.remove('modo-admin');
  cargarStandsVisitante();
}
 
function _onSesionNula() {
  document.body.classList.remove('modo-admin');
  cargarStandsVisitante();
}
 
/* =============================================
   INICIALIZACIÓN
============================================= */
function initStands() {
  // Buscador vista visitante
  const buscadorV = document.getElementById('buscarStand');
  if (buscadorV) {
    buscadorV.addEventListener('input', () => {
      _filtroBusqueda = buscadorV.value.toLowerCase().trim();
      _aplicarFiltrosLocales();
    });
  }
 
  // Buscador vista admin
  const buscadorA = document.getElementById('buscarStandAdmin');
  if (buscadorA) {
    buscadorA.addEventListener('input', () => {
      _filtroBusqueda = buscadorA.value.toLowerCase().trim();
      _aplicarFiltrosLocales();
    });
  }
}
 
/* =============================================
   GET /stands — VISTA VISITANTE
   Solo stands activos
============================================= */
async function cargarStandsVisitante() {
  const mainVisitante = document.getElementById('contenido-principal');
  const panelAdmin    = document.getElementById('panelStandsAdmin');
  if (mainVisitante) mainVisitante.style.display = 'block';
  if (panelAdmin)    panelAdmin.style.display    = 'none';
 
  const grid = document.getElementById('contenedorStands');
  if (!grid) return;
 
  grid.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Cargando stands...</p>
    </div>`;
 
  try {
    // ── HTTP GET /stands (solo activos) ────────
    const res  = await fetch(`${API_URL}/stands`);
    const data = await res.json();
 
    if (!res.ok) {
      grid.innerHTML = `<div class="col-12 text-center text-danger py-5">
        <i class="fa-solid fa-triangle-exclamation fa-2x mb-2 d-block"></i>
        Error al cargar stands: ${data.msj}
      </div>`;
      return;
    }
 
    _standsCache = data;
    _renderTarjetasVisitante(data);
 
  } catch {
    grid.innerHTML = `<div class="col-12 text-center text-danger py-5">
      <i class="fa-solid fa-triangle-exclamation fa-2x mb-2 d-block"></i>
      Sin conexión con el servidor.<br>
      <small class="text-muted">Verificá que el backend esté corriendo.</small>
    </div>`;
  }
}
 
/* Renderiza tarjetas en vista visitante */
function _renderTarjetasVisitante(data) {
  const grid = document.getElementById('contenedorStands');
  if (!grid) return;
 
  if (data.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center text-muted py-5">
      <i class="fa-solid fa-store-slash fa-2x mb-2 d-block"></i>
      No hay stands disponibles con esos criterios.
    </div>`;
    return;
  }
 
  grid.innerHTML = data.map(s => `
    <div class="col" data-categoria="${s.categoria}"
         data-nombre="${s.nombre.toLowerCase()}">
      <article class="tarjeta" aria-label="Stand: ${s.nombre}">
        <div class="tarjeta-imagen" aria-hidden="true">
          <i class="fa-solid ${ICONOS_CAT_ST[s.categoria] || 'fa-store'}"></i>
        </div>
        <div class="tarjeta-cuerpo">
          <span class="tag ${CLASES_CAT_ST[s.categoria]}">
            <i class="fa-solid ${ICONOS_CAT_ST[s.categoria]}"
               aria-hidden="true"></i>
            ${NOMBRES_CAT_ST[s.categoria]}
          </span>
          <h2 class="tarjeta-titulo">${s.nombre}</h2>
          <div class="tarjeta-meta">
            <span>
              <i class="fa-solid fa-user" aria-hidden="true"></i>
              ${s.responsable}
            </span>
            <span>
              <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
              ${s.ubicacion}
            </span>
          </div>
          <p class="mt-2" style="font-size:.9rem;line-height:1.4;
             color:var(--texto-secundario);">
            ${s.descripcion
              ? (s.descripcion.length > 100
                  ? s.descripcion.substring(0, 100) + '...'
                  : s.descripcion)
              : 'Sin descripción disponible.'}
          </p>
          <div class="d-flex justify-content-end align-items-center
                      mt-3 border-top pt-2"
               style="border-color:var(--borde) !important;">
            <button class="btn btn-primario btn-sm"
                    onclick="verDetalleStand('${s._id}')"
                    aria-label="Ver detalle de ${s.nombre}">
              <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              Ver Detalles
            </button>
          </div>
        </div>
      </article>
    </div>`).join('');
}
 
/* =============================================
   FILTROS LOCALES — Categoría + Búsqueda
============================================= */
function filtrarStandsPorCategoria(categoria) {
  _filtroCategoria = categoria;
 
  document.querySelectorAll('.btn-filtro-stand').forEach(btn => {
    const activo = btn.dataset.cat === categoria ||
                   (categoria === '' && btn.dataset.cat === 'todas');
    btn.classList.toggle('btn-primario',   activo);
    btn.classList.toggle('btn-secundario', !activo);
  });
 
  _aplicarFiltrosLocales();
}
 
function _aplicarFiltrosLocales() {
  const filtrados = _standsCache.filter(s => {
    const catOk  = !_filtroCategoria || s.categoria === _filtroCategoria;
    const busqOk = !_filtroBusqueda  ||
      s.nombre.toLowerCase().includes(_filtroBusqueda) ||
      s.responsable.toLowerCase().includes(_filtroBusqueda);
    return catOk && busqOk;
  });
 
  if (document.body.classList.contains('modo-admin')) {
    _renderTablaAdmin(filtrados);
  } else {
    _renderTarjetasVisitante(filtrados);
  }
}
 
/* =============================================
   MODAL VER DETALLE — GET /stands/:id
============================================= */
async function verDetalleStand(id) {
  try {
    const res = await fetch(`${API_URL}/stands/${id}`);
    const s   = await res.json();
    if (!res.ok) return;
 
    document.getElementById('modalTag').innerHTML = `
      <span class="tag ${CLASES_CAT_ST[s.categoria]}">
        <i class="fa-solid ${ICONOS_CAT_ST[s.categoria]}"></i>
        ${NOMBRES_CAT_ST[s.categoria]}
      </span>`;
    document.getElementById('modalTitulo').textContent = s.nombre;
    document.getElementById('modalEstado').innerHTML   =
      `<span class="estado-pill ${s.estado === 'activo'
        ? 'estado-disponible' : 'estado-cancelado'}">
         ${s.estado === 'activo' ? 'Activo' : 'Cancelado'}
       </span>`;
 
    document.getElementById('modalCuerpo').innerHTML = `
      <div class="modal-campo">
        <div class="modal-campo-label">
          <i class="fa-solid fa-user"></i> Responsable
        </div>
        <div class="modal-campo-valor fw-bold">${s.responsable}</div>
      </div>
      <div class="modal-campo">
        <div class="modal-campo-label">
          <i class="fa-solid fa-location-dot"></i> Ubicación
        </div>
        <div class="modal-campo-valor fw-bold">${s.ubicacion}</div>
      </div>
      <div class="modal-campo">
        <div class="modal-campo-label">
          <i class="fa-solid fa-align-left"></i> Descripción
        </div>
        <div class="modal-campo-valor">
          ${s.descripcion || 'Sin descripción disponible.'}
        </div>
      </div>`;
 
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalDetalle')
    ).show();
 
  } catch {
    Swal.fire({
      icon: 'error', title: 'Error',
      text: 'No se pudo cargar el detalle del stand.',
      confirmButtonColor: '#006AEA'
    });
  }
}
 
/* =============================================
   GET /stands?todas=true — VISTA ADMIN
   Incluye todos los estados
============================================= */
async function cargarStandsAdmin() {
  const mainVisitante = document.getElementById('contenido-principal');
  const panelAdmin    = document.getElementById('panelStandsAdmin');
 
  if (mainVisitante) mainVisitante.style.display = 'none';
  if (panelAdmin)    panelAdmin.style.display    = 'block';
 
  const tbody = document.getElementById('tablaStandsCuerpo');
  if (!tbody) return;
 
  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted mb-0">Cargando stands desde MongoDB...</p>
      </td>
    </tr>`;
 
  try {
    // ── HTTP GET /stands?todas=true + estadísticas ─
    const [resStands, resStats] = await Promise.all([
      fetch(`${API_URL}/stands?todas=true`),
      fetch(`${API_URL}/stands/estadisticas`)
    ]);
 
    const stands = await resStands.json();
    const stats  = await resStats.json();
 
    if (!resStands.ok) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">
        Error: ${stands.msj}
      </td></tr>`;
      return;
    }
 
    _standsCache = stands;
 
    // Actualizar tarjetas de resumen
    _setEl('resumenStTotal',     stats.totales?.total     || 0);
    _setEl('resumenStActivos',   stats.totales?.activos   || 0);
    _setEl('resumenStCancelados',stats.totales?.cancelados|| 0);
 
    _renderTablaAdmin(stands);
 
  } catch {
    tbody.innerHTML = `
      <tr><td colspan="6" class="text-center text-danger py-4">
        <i class="fa-solid fa-triangle-exclamation fa-2x mb-2 d-block"></i>
        Sin conexión con el servidor.
      </td></tr>`;
  }
}
 
/* Renderiza filas de la tabla admin */
function _renderTablaAdmin(data) {
  const tbody = document.getElementById('tablaStandsCuerpo');
  const info  = document.getElementById('tablaStandsInfo');
  if (!tbody) return;
 
  if (info) info.textContent =
    `Mostrando ${data.length} de ${_standsCache.length} stands`;
 
  if (data.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="6" class="text-center text-muted py-5">
        <i class="fa-solid fa-store-slash fa-2x mb-2 d-block"></i>
        No se encontraron stands con esos criterios.
      </td></tr>`;
    return;
  }
 
  const BADGE_ESTADO = {
    activo:    'bg-success',
    cancelado: 'bg-danger'
  };
  const LABEL_ESTADO = {
    activo:    'Activo',
    cancelado: 'Cancelado'
  };
 
  tbody.innerHTML = data.map(s => `
    <tr>
      <td class="ps-3 fw-bold">${s.nombre}</td>
      <td>${s.responsable}</td>
      <td>${s.ubicacion}</td>
      <td>
        <span class="tag ${CLASES_CAT_ST[s.categoria]} mb-0"
              style="font-size:.75rem;">
          <i class="fa-solid ${ICONOS_CAT_ST[s.categoria]}"></i>
          ${NOMBRES_CAT_ST[s.categoria]}
        </span>
      </td>
      <td>
        <span class="badge ${BADGE_ESTADO[s.estado] || 'bg-secondary'}">
          ${LABEL_ESTADO[s.estado] || s.estado}
        </span>
      </td>
      <td class="text-center pe-3">
        <button class="btn btn-sm btn-outline-primary me-1"
                onclick="verDetalleStand('${s._id}')"
                title="Ver detalle"
                aria-label="Ver detalle de ${s.nombre}">
          <i class="fa-solid fa-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-warning me-1"
                onclick="abrirModalEditarStand('${s._id}')"
                title="Editar"
                aria-label="Editar ${s.nombre}">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger"
                onclick="eliminarStand('${s._id}','${_esc(s.nombre)}')"
                title="Eliminar permanentemente"
                aria-label="Eliminar ${s.nombre}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>`).join('');
}
 
/* =============================================
   MODAL — NUEVO STAND (admin)
   POST /stands
============================================= */
function abrirModalNuevoStand() {
  const titulo = document.getElementById('modalAdminTitulo');
  const cuerpo = document.getElementById('modalAdminCuerpo');
  if (!cuerpo) return;
 
  if (titulo) titulo.innerHTML =
    '<i class="fa-solid fa-plus"></i> Nuevo Stand';
 
  cuerpo.innerHTML = _formStand(null);
 
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById('modalAdmin')
  ).show();
}
 
/* =============================================
   MODAL — EDITAR STAND (admin)
   GET /stands/:id → PUT /stands/:id
============================================= */
async function abrirModalEditarStand(id) {
  try {
    const res = await fetch(`${API_URL}/stands/${id}`);
    const s   = await res.json();
    if (!res.ok) return;
 
    const titulo = document.getElementById('modalAdminTitulo');
    const cuerpo = document.getElementById('modalAdminCuerpo');
    if (!cuerpo) return;
 
    if (titulo) titulo.innerHTML =
      '<i class="fa-solid fa-pen"></i> Editar Stand';
 
    cuerpo.innerHTML = _formStand(s);
 
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalAdmin')
    ).show();
 
  } catch {
    Swal.fire({
      icon: 'error', title: 'Error',
      text: 'No se pudo cargar el stand para editar.',
      confirmButtonColor: '#006AEA'
    });
  }
}
 
/* Genera HTML del formulario (nuevo y editar) */
function _formStand(s) {
  const v = s || {};
 
  const opsCat = [
    ['cultural',     'Cultural'],
    ['deportiva',    'Deportiva'],
    ['tecnologica',  'Tecnológica'],
    ['artistica',    'Artística'],
    ['gastronomica', 'Gastronómica'],
    ['recreativa',   'Recreativa']
  ].map(([val, lbl]) =>
    `<option value="${val}" ${v.categoria === val ? 'selected' : ''}>
       ${lbl}
     </option>`
  ).join('');
 
  const opsEstado = ['activo', 'cancelado']
    .map(e =>
      `<option value="${e}" ${v.estado === e ? 'selected' : ''}>
         ${e.charAt(0).toUpperCase() + e.slice(1)}
       </option>`
    ).join('');
 
  return `
    <!-- Nombre -->
    <div class="mb-3">
      <label class="form-label">
        Nombre del stand <span class="requerido">*</span>
      </label>
      <div class="input-group">
        <span class="input-group-text">
          <i class="fa-solid fa-store" aria-hidden="true"></i>
        </span>
        <input type="text" id="fStNombre" class="form-control"
               placeholder="Ej: Detección de Plagas con IoT"
               value="${v.nombre || ''}" />
      </div>
    </div>
 
    <!-- Responsable -->
    <div class="mb-3">
      <label class="form-label">
        Responsable <span class="requerido">*</span>
      </label>
      <div class="input-group">
        <span class="input-group-text">
          <i class="fa-solid fa-user" aria-hidden="true"></i>
        </span>
        <input type="text" id="fStResponsable" class="form-control"
               placeholder="Ej: Grupo Desarrollador 3"
               value="${v.responsable || ''}" />
      </div>
    </div>
 
    <!-- Ubicación -->
    <div class="mb-3">
      <label class="form-label">
        Ubicación <span class="requerido">*</span>
      </label>
      <div class="input-group">
        <span class="input-group-text">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
        </span>
        <input type="text" id="fStUbicacion" class="form-control"
               placeholder="Ej: Stand A-10 (Pasillo Norte)"
               value="${v.ubicacion || ''}" />
      </div>
    </div>
 
    <!-- Categoría -->
    <div class="mb-3">
      <label class="form-label">
        Categoría <span class="requerido">*</span>
      </label>
      <div class="input-group">
        <span class="input-group-text">
          <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
        </span>
        <select id="fStCategoria" class="form-select">
          <option value="">— Seleccioná una categoría —</option>
          ${opsCat}
        </select>
      </div>
    </div>
 
    <!-- Descripción -->
    <div class="mb-3">
      <label class="form-label">Descripción</label>
      <textarea id="fStDescripcion" class="form-control" rows="3"
                placeholder="Descripción del stand y sus actividades...">${v.descripcion || ''}</textarea>
    </div>
 
    <!-- Estado (solo en edición) -->
    ${s ? `
    <div class="mb-4">
      <label class="form-label">Estado</label>
      <select id="fStEstado" class="form-select">
        ${opsEstado}
      </select>
    </div>` : ''}
 
    <!-- Botón guardar -->
    <button type="button"
            class="btn btn-primario w-100 justify-content-center"
            onclick="${s
              ? `guardarEdicionStand('${s._id}')`
              : 'guardarNuevoStand()'}">
      <i class="fa-solid fa-floppy-disk"></i>
      ${s ? 'Guardar cambios' : 'Registrar stand'}
    </button>`;
}
 
/* Leer campos del formulario */
function _leerFormStand() {
  return {
    nombre:      document.getElementById('fStNombre')?.value.trim()      || '',
    responsable: document.getElementById('fStResponsable')?.value.trim() || '',
    ubicacion:   document.getElementById('fStUbicacion')?.value.trim()   || '',
    categoria:   document.getElementById('fStCategoria')?.value          || '',
    descripcion: document.getElementById('fStDescripcion')?.value.trim() || '',
    estado:      document.getElementById('fStEstado')?.value             || 'activo'
  };
}
 
/* Validar campos obligatorios */
function _validarFormStand(datos) {
  const requeridos = [
    ['nombre',      'fStNombre'],
    ['responsable', 'fStResponsable'],
    ['ubicacion',   'fStUbicacion'],
    ['categoria',   'fStCategoria']
  ];
  let ok = true;
  requeridos.forEach(([campo, id]) => {
    const el = document.getElementById(id);
    if (!datos[campo]) {
      if (el) el.classList.add('is-invalid');
      ok = false;
    } else {
      if (el) el.classList.remove('is-invalid');
    }
  });
  return ok;
}
 
/* =============================================
   POST /stands — Guardar nuevo stand
============================================= */
async function guardarNuevoStand() {
  const datos = _leerFormStand();
  if (!_validarFormStand(datos)) {
    Swal.fire({
      icon: 'warning', title: 'Campos incompletos',
      text: 'Completá todos los campos obligatorios.',
      confirmButtonColor: '#006AEA'
    });
    return;
  }
 
  Swal.fire({
    title: 'Guardando...', allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });
 
  try {
    // ── HTTP POST /stands ──────────────────────
    const res  = await fetch(`${API_URL}/stands`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(datos)
    });
    const data = await res.json();
 
    if (!res.ok) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: data.msj, confirmButtonColor: '#006AEA'
      });
      return;
    }
 
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalAdmin')
    ).hide();
 
    Swal.fire({
      icon: 'success', title: '¡Stand registrado!',
      text: `"${data.nombre}" fue agregado correctamente.`,
      confirmButtonColor: '#006AEA',
      timer: 2500, timerProgressBar: true
    });
 
    cargarStandsAdmin();
 
  } catch {
    Swal.fire({
      icon: 'error', title: 'Sin conexión',
      text: 'Verificá que el servidor esté corriendo.',
      confirmButtonColor: '#006AEA'
    });
  }
}
 
/* =============================================
   PUT /stands/:id — Guardar edición
============================================= */
async function guardarEdicionStand(id) {
  const datos = _leerFormStand();
  if (!_validarFormStand(datos)) {
    Swal.fire({
      icon: 'warning', title: 'Campos incompletos',
      text: 'Completá todos los campos obligatorios.',
      confirmButtonColor: '#006AEA'
    });
    return;
  }
 
  Swal.fire({
    title: 'Guardando...', allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });
 
  try {
    // ── HTTP PUT /stands/:id ───────────────────
    const res  = await fetch(`${API_URL}/stands/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(datos)
    });
    const data = await res.json();
 
    if (!res.ok) {
      Swal.fire({
        icon: 'error', title: 'Error al actualizar',
        text: data.msj, confirmButtonColor: '#006AEA'
      });
      return;
    }
 
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById('modalAdmin')
    ).hide();
 
    Swal.fire({
      icon: 'success', title: 'Stand actualizado',
      text: `"${data.nombre}" fue actualizado correctamente.`,
      confirmButtonColor: '#006AEA',
      timer: 2500, timerProgressBar: true
    });
 
    cargarStandsAdmin();
 
  } catch {
    Swal.fire({
      icon: 'error', title: 'Sin conexión',
      text: 'Verificá que el servidor esté corriendo.',
      confirmButtonColor: '#006AEA'
    });
  }
}
 
/* =============================================
   DELETE /stands/:id — Eliminar permanentemente
============================================= */
async function eliminarStand(id, nombre) {
  const result = await Swal.fire({
    icon: 'warning',
    title: '¿Eliminar stand?',
    html: `¿Seguro que querés eliminar <strong>"${nombre}"</strong>?
           <br><small class="text-muted d-block mt-1">
             Esta acción es permanente y no se puede deshacer.
           </small>`,
    showCancelButton:   true,
    confirmButtonColor: '#d2232a',
    cancelButtonColor:  '#7c7b75',
    confirmButtonText:  '<i class="fa-solid fa-trash"></i> Sí, eliminar',
    cancelButtonText:   'Cancelar'
  });
 
  if (!result.isConfirmed) return;
 
  try {
    // ── HTTP DELETE /stands/:id ────────────────
    const res  = await fetch(`${API_URL}/stands/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
 
    if (!res.ok) {
      Swal.fire({
        icon: 'error', title: 'Error',
        text: data.msj, confirmButtonColor: '#006AEA'
      });
      return;
    }
 
    Swal.fire({
      icon: 'success', title: 'Stand eliminado',
      text: `"${nombre}" fue eliminado permanentemente.`,
      confirmButtonColor: '#006AEA',
      timer: 2000, timerProgressBar: true
    });
 
    cargarStandsAdmin();
 
  } catch {
    Swal.fire({
      icon: 'error', title: 'Sin conexión',
      text: 'No se pudo conectar con el servidor.',
      confirmButtonColor: '#006AEA'
    });
  }
}
 
/* =============================================
   UTILIDADES
============================================= */
function _setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
 
function _esc(s) { return (s || '').replace(/'/g, "\\'"); }
 
/* =============================================
   INICIALIZACIÓN
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initStands();
});