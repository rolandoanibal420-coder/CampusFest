/* =============================================
   CAMPUSFEST 2026 — inscripcion.js
   Lógica exclusiva de inscripcion.html
   Depende de Campus_Fest_2.js (API_URL, ACTIVIDADES,
   getSesion, esCorreoAdmin, aplicarEstadoSesion)
   Gráficos: Chart.js desde CDN
============================================= */

/* =============================================
   CUPOS REALES según el enunciado
   (sincronizados con inscripcion.model.js)
============================================= */
const CUPOS_ACTIVIDADES = {
  'Hackathon de IA':            { max: 30,  actuales: 28  },
  'Festival Gastronómico':      { max: 200, actuales: 120 },
  'Exposición de Arte Digital': { max: 80,  actuales: 65  },
  'Torneo de Fútbol 5':         { max: 60,  actuales: 60  },  // lista de espera
  'Noche de Teatro':            { max: 120, actuales: 95  },
  'Escape Room Tecnológico':    { max: 20,  actuales: 16  },
  'Taller de Robótica':         { max: 25,  actuales: 20  },
  'Jam de Música en Vivo':      { max: 150, actuales: 40  },
  'Maratón de Danza':           { max: 50,  actuales: 35  }
};

/* Referencias a las instancias de Chart.js (para destruir antes de redibujar) */
let _chartActividad = null;
let _chartCupos     = null;
let _chartSemanas   = null;

/* Cache de inscripciones para filtrado sin re-fetch */
let _inscripcionesCache = [];

/* =============================================
   CALLBACKS DE SESIÓN — sobreescriben los de
   Campus_Fest_2.js para esta página específica
============================================= */

// Se ejecuta cuando hay sesión de ADMINISTRADOR
function _onSesionAdmin() {
  const formMain   = document.getElementById('mainInscripcion');
  const panelAdmin = document.getElementById('panelAdmin');
  if (formMain)   formMain.style.display   = 'none';
  if (panelAdmin) panelAdmin.style.display = 'block';
  cargarPanelAdmin();
}

// Se ejecuta cuando hay sesión de VISITANTE
function _onSesionVisitante() {
  const formMain   = document.getElementById('mainInscripcion');
  const panelAdmin = document.getElementById('panelAdmin');
  if (formMain)   formMain.style.display   = 'block';
  if (panelAdmin) panelAdmin.style.display = 'none';
}

// Se ejecuta cuando NO hay sesión
function _onSesionNula() {
  _onSesionVisitante();
}

/* =============================================
   INICIALIZACIÓN
   Se llama desde DOMContentLoaded (único punto)
============================================= */
function initInscripcion() {
  poblarSelectInscripcion();
  limpiarFormInscripcion();
  // aplicarEstadoSesion() ya fue llamado en Campus_Fest_2.js
  // y disparará _onSesionAdmin() o _onSesionVisitante() según corresponda
}

/* =============================================
   POBLAR SELECT DE ACTIVIDADES
   Muestra cupos disponibles en tiempo real
============================================= */
function poblarSelectInscripcion() {
  const sel = document.getElementById('inpActividad');
  if (!sel) return;

  sel.innerHTML = '<option value="">— Seleccioná una actividad —</option>';

  Object.entries(CUPOS_ACTIVIDADES).forEach(([nombre, datos]) => {
    const libres  = datos.max - datos.actuales;
    const llena   = libres <= 0;
    const opt     = document.createElement('option');
    opt.value     = nombre;
    opt.textContent = llena
      ? `${nombre} (Lista de espera)`
      : `${nombre} — ${libres} cupos disponibles`;
    sel.appendChild(opt);
  });

  // Preseleccionar si viene por ?actividad= en la URL
  const params = new URLSearchParams(window.location.search);
  const actUrl = params.get('actividad');
  if (actUrl) {
    sel.value = actUrl;
    verificarCupoInscripcion(actUrl);
  }
}

/* =============================================
   ALERTA DINÁMICA DE CUPOS
============================================= */
function verificarCupoInscripcion(nombre) {
  const al = document.getElementById('alertaCupo');
  const tx = document.getElementById('alertaCupoTexto');
  if (!al || !tx) return;

  if (!nombre || !CUPOS_ACTIVIDADES[nombre]) {
    al.style.display = 'none';
    return;
  }

  const { max, actuales } = CUPOS_ACTIVIDADES[nombre];
  const libres = max - actuales;
  const pct    = (actuales / max) * 100;

  if (libres <= 0) {
    tx.textContent    = `"${nombre}" no tiene cupos disponibles. Tu inscripción quedará en lista de espera.`;
    al.style.display  = 'flex';
    al.style.background    = 'linear-gradient(135deg,#fff3cd,#ffeaa7)';
    al.style.borderColor   = '#ffc63e';
    al.style.color         = '#7a4800';
  } else if (pct >= 80) {
    tx.textContent    = `¡Solo quedan ${libres} cupos para "${nombre}"! Inscribite pronto.`;
    al.style.display  = 'flex';
    al.style.background    = 'linear-gradient(135deg,#d4edda,#c3e6cb)';
    al.style.borderColor   = '#4aa147';
    al.style.color         = '#1a5a1a';
  } else {
    al.style.display = 'none';
  }
}

/* =============================================
   LIMPIAR FORMULARIO VISITANTE
============================================= */
function limpiarFormInscripcion() {
  ['inpNombre','inpIdentificacion','inpCorreo',
   'inpTelefono','inpCarrera','inpComentarios'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const sel = document.getElementById('inpActividad');
  if (sel) sel.value = '';
  const al  = document.getElementById('alertaCupo');
  if (al) al.style.display = 'none';
  ['inpNombre','inpIdentificacion','inpCorreo',
   'inpTelefono','inpCarrera','inpActividad'].forEach(id => {
    document.getElementById(id)?.classList.remove('is-invalid');
  });
}

/* mostrarVistaPorRol() fue reemplazada por los
   callbacks _onSesionAdmin / _onSesionVisitante / _onSesionNula
   que Campus_Fest_2.js llama automáticamente */

/* =============================================
   POST /inscripciones — Enviar formulario
   HTTP POST → MongoDB
============================================= */
async function enviarInscripcion() {
  const nombre   = document.getElementById('inpNombre').value.trim();
  const ident    = document.getElementById('inpIdentificacion').value.trim();
  const correo   = document.getElementById('inpCorreo').value.trim();
  const tel      = document.getElementById('inpTelefono').value.trim();
  const carrera  = document.getElementById('inpCarrera').value.trim();
  const actividad= document.getElementById('inpActividad').value;
  const coment   = document.getElementById('inpComentarios')?.value.trim() || '';

  // Limpiar errores previos
  ['inpNombre','inpIdentificacion','inpCorreo',
   'inpTelefono','inpCarrera','inpActividad'].forEach(id => {
    document.getElementById(id)?.classList.remove('is-invalid');
  });

  const err = [];
  if (!nombre)   { err.push('Nombre completo');        document.getElementById('inpNombre').classList.add('is-invalid'); }
  if (!ident)    { err.push('Identificación');         document.getElementById('inpIdentificacion').classList.add('is-invalid'); }
  if (!correo || !correo.includes('@') || !correo.includes('.')) {
    err.push('Correo electrónico válido');
    document.getElementById('inpCorreo').classList.add('is-invalid');
  }
  if (!tel)      { err.push('Teléfono');               document.getElementById('inpTelefono').classList.add('is-invalid'); }
  if (!carrera)  { err.push('Carrera o grupo');        document.getElementById('inpCarrera').classList.add('is-invalid'); }
  if (!actividad){ err.push('Actividad');              document.getElementById('inpActividad').classList.add('is-invalid'); }

  if (err.length) {
    Swal.fire({
      icon: 'error', title: 'Campos incompletos',
      html: `<ul style="text-align:left;margin-top:.5rem">${err.map(e => `<li>${e}</li>`).join('')}</ul>`,
      confirmButtonColor: '#006AEA'
    });
    return;
  }

  Swal.fire({ title: 'Enviando inscripción...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  try {
    // ── HTTP POST /inscripciones ───────────────
    const res  = await fetch(`${API_URL}/inscripciones`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nombre, identificacion: ident, correo, telefono: tel, carrera, actividad, comentarios: coment })
    });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ icon: 'error', title: 'Error', text: data.msj, confirmButtonColor: '#006AEA' });
      return;
    }

    if (data.listaEspera) {
      Swal.fire({
        icon: 'info', title: 'Lista de Espera',
        html: `<p><strong>"${actividad}"</strong> está llena.</p>
               <p style="margin-top:.75rem;">Quedaste en la <strong>lista de espera</strong>.
               Te notificamos a <strong>${correo}</strong> si se habilitan cupos.</p>`,
        confirmButtonColor: '#ffc63e', confirmButtonText: 'Entendido'
      });
    } else {
      Swal.fire({
        icon: 'success', title: '¡Inscripción registrada!',
        html: `<p>¡Hola, <strong>${nombre}</strong>!</p>
               <p style="margin-top:.5rem;">Tu inscripción en <strong>"${actividad}"</strong>
               fue enviada. Estado: <strong>Pendiente</strong> (el admin la confirmará).</p>
               <p style="font-size:.85rem;color:#666;margin-top:.5rem;">
               Confirmación a <strong>${correo}</strong></p>`,
        confirmButtonColor: '#006AEA', confirmButtonText: 'Volver al inicio'
      }).then(r => { if (r.isConfirmed) window.location.href = 'inicio.html'; });

      limpiarFormInscripcion();
    }

  } catch {
    Swal.fire({
      icon: 'error', title: 'Sin conexión',
      text: 'Verificá que el servidor esté corriendo en localhost:3000.',
      confirmButtonColor: '#006AEA'
    });
  }
}

/* =============================================
   PANEL ADMINISTRADOR
   Carga tarjetas de resumen + tabla + gráficos
============================================= */
async function cargarPanelAdmin() {
  await Promise.all([
    cargarTablaInscripciones(),
    cargarEstadisticas()
  ]);
}

/* ─────────────────────────────────────────────
   GET /inscripciones — Tabla de inscripciones
───────────────────────────────────────────── */
async function cargarTablaInscripciones(filtros = {}) {
  const tbody = document.getElementById('tablaInscripcionesCuerpo');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="7" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted mb-0">Cargando inscripciones...</p>
      </td>
    </tr>`;

  // Construir query string
  const params = new URLSearchParams();
  if (filtros.q)         params.append('q',         filtros.q);
  if (filtros.actividad) params.append('actividad',  filtros.actividad);
  if (filtros.estado)    params.append('estado',     filtros.estado);
  const qs = params.toString() ? '?' + params.toString() : '';

  try {
    // ── HTTP GET /inscripciones ────────────────
    const res  = await fetch(`${API_URL}/inscripciones${qs}`);
    const data = await res.json();

    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">Error: ${data.msj}</td></tr>`;
      return;
    }

    _inscripcionesCache = data;
    _renderTablaInscripciones(data);

  } catch {
    tbody.innerHTML = `
      <tr><td colspan="7" class="text-center text-danger py-4">
        <i class="fa-solid fa-triangle-exclamation fa-2x mb-2 d-block"></i>
        Sin conexión con el servidor.
      </td></tr>`;
  }
}

/* Renderiza las filas de la tabla */
function _renderTablaInscripciones(data) {
  const tbody  = document.getElementById('tablaInscripcionesCuerpo');
  const info   = document.getElementById('tablaInscripcionesInfo');
  if (!tbody) return;

  if (info) info.textContent = `Mostrando ${data.length} de ${_inscripcionesCache.length} registros`;

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7" class="text-center text-muted py-5">
        <i class="fa-solid fa-clipboard-list fa-2x mb-2 d-block"></i>
        No se encontraron inscripciones con esos criterios.
      </td></tr>`;
    return;
  }

  const BADGE_CLASE = {
    pendiente:  'bg-warning text-dark',
    confirmada: 'bg-success',
    cancelada:  'bg-danger'
  };
  const BADGE_LABEL = {
    pendiente:  'Pendiente',
    confirmada: 'Confirmada',
    cancelada:  'Cancelada'
  };
  const BADGE_ICONO = {
    pendiente:  'fa-clock',
    confirmada: 'fa-circle-check',
    cancelada:  'fa-circle-xmark'
  };

  tbody.innerHTML = data.map(i => {
    // Badge de estado:
    // pendiente  → botón clickeable con icono de mano (llama confirmarInscripcion)
    // confirmada → badge verde estático
    // cancelada  → badge rojo estático
    const badgeEstado = i.estado === 'pendiente'
      ? `<button type="button"
                 class="badge border-0 ${BADGE_CLASE.pendiente}"
                 style="cursor:pointer;font-size:.8rem;padding:.35em .65em;"
                 onclick="confirmarInscripcion('${i._id}','${_esc(i.nombre)}')"
                 title="Clic para confirmar esta inscripción"
                 aria-label="Confirmar inscripción de ${i.nombre}">
           <i class="fa-solid fa-clock"></i> Pendiente
           <i class="fa-solid fa-hand-pointer ms-1" style="font-size:.7rem;opacity:.7;"></i>
         </button>`
      : `<span class="badge ${BADGE_CLASE[i.estado] || 'bg-secondary'}"
               style="font-size:.8rem;">
           <i class="fa-solid ${BADGE_ICONO[i.estado] || 'fa-circle'}"></i>
           ${BADGE_LABEL[i.estado] || i.estado}
         </span>`;

    return `
    <tr>
      <td class="ps-3 fw-bold">${i.nombre}</td>
      <td>${i.identificacion}</td>
      <td><a href="mailto:${i.correo}" style="color:var(--azul-principal)">${i.correo}</a></td>
      <td>${i.actividad}</td>
      <td>${badgeEstado}</td>
      <td class="text-center pe-3">
        <button class="btn btn-sm btn-outline-info me-1"
                onclick="verComentarios('${_esc(i.nombre)}','${_esc(i.comentarios || 'Sin comentarios adicionales.')}')"
                aria-label="Ver comentarios de ${i.nombre}" title="Ver comentarios">
          <i class="fa-solid fa-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-warning me-1"
                onclick="abrirModalEditarInscripcion('${i._id}','${_esc(i.nombre)}','${_esc(i.identificacion)}','${_esc(i.correo)}','${_esc(i.telefono)}','${_esc(i.carrera)}','${_esc(i.actividad)}','${i.estado}','${_esc(i.comentarios || '')}')"
                aria-label="Editar inscripción de ${i.nombre}" title="Editar">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger"
                onclick="eliminarInscripcion('${i._id}','${_esc(i.nombre)}')"
                aria-label="Eliminar inscripción de ${i.nombre}" title="Eliminar">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   Ver comentarios (ojo)
───────────────────────────────────────────── */
function verComentarios(nombre, comentarios) {
  Swal.fire({
    title: `Comentarios — ${nombre}`,
    text:  comentarios || 'Sin comentarios adicionales.',
    icon:  'info',
    confirmButtonColor: '#006AEA',
    confirmButtonText: 'Cerrar'
  });
}

/* ─────────────────────────────────────────────
   Confirmar inscripción desde el badge
   PUT /inscripciones/:id  →  estado: 'confirmada'
───────────────────────────────────────────── */
async function confirmarInscripcion(id, nombre) {
  const result = await Swal.fire({
    icon:  'question',
    title: '¿Confirmar inscripción?',
    html:  `¿Deseás confirmar la inscripción de <strong>${nombre}</strong>?
            <br><small class="text-muted d-block mt-1">
              El estado cambiará de <strong>Pendiente</strong> a
              <span style="color:#198754;font-weight:700;">Confirmada</span>.
            </small>`,
    showCancelButton:    true,
    confirmButtonColor:  '#198754',
    cancelButtonColor:   '#7c7b75',
    confirmButtonText:   '<i class="fa-solid fa-circle-check"></i> Sí, confirmar',
    cancelButtonText:    'No, cancelar',
    reverseButtons:      true
  });

  if (!result.isConfirmed) return;

  // Buscar el registro completo en cache para no perder los demás campos
  const inscripcion = _inscripcionesCache.find(i => i._id === id);
  if (!inscripcion) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se encontró la inscripción en el cache. Actualizá la tabla.', confirmButtonColor: '#006AEA' });
    return;
  }

  Swal.fire({ title: 'Confirmando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  try {
    // ── HTTP PUT /inscripciones/:id ────────────
    const res  = await fetch(`${API_URL}/inscripciones/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        nombre:         inscripcion.nombre,
        identificacion: inscripcion.identificacion,
        correo:         inscripcion.correo,
        telefono:       inscripcion.telefono,
        carrera:        inscripcion.carrera,
        actividad:      inscripcion.actividad,
        comentarios:    inscripcion.comentarios || '',
        estado:         'confirmada'   // ← único campo que cambia
      })
    });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ icon: 'error', title: 'Error al confirmar', text: data.msj, confirmButtonColor: '#006AEA' });
      return;
    }

    // Actualizar cache local para que el filtro refleje el nuevo estado sin re-fetch
    const idx = _inscripcionesCache.findIndex(i => i._id === id);
    if (idx !== -1) _inscripcionesCache[idx].estado = 'confirmada';

    Swal.fire({
      icon:  'success',
      title: '¡Inscripción confirmada!',
      html:  `<p>La inscripción de <strong>${nombre}</strong> fue confirmada exitosamente.</p>
              <p style="margin-top:.5rem;">
                El estado cambió a
                <span class="badge bg-success ms-1">
                  <i class="fa-solid fa-circle-check"></i> Confirmada
                </span>
              </p>`,
      confirmButtonColor: '#198754',
      timer:  2500,
      timerProgressBar: true
    });

    // Recargar tabla Y estadísticas para reflejar el cambio en los gráficos y tarjetas
    await cargarPanelAdmin();

  } catch {
    Swal.fire({ icon: 'error', title: 'Sin conexión', text: 'No se pudo conectar con el servidor.', confirmButtonColor: '#006AEA' });
  }
}

/* ─────────────────────────────────────────────
   Filtrar tabla (sin re-fetch)
───────────────────────────────────────────── */
function aplicarFiltrosTabla() {
  const q         = document.getElementById('buscarInscripcion')?.value.toLowerCase() || '';
  const actividad = document.getElementById('filtroActividad')?.value || '';
  const estado    = document.getElementById('filtroEstado')?.value    || '';

  const filtrados = _inscripcionesCache.filter(i => {
    const textoOk = !q ||
      i.nombre.toLowerCase().includes(q) ||
      i.correo.toLowerCase().includes(q) ||
      i.identificacion.toLowerCase().includes(q);
    const actOk   = !actividad || i.actividad === actividad;
    const estOk   = !estado    || i.estado    === estado;
    return textoOk && actOk && estOk;
  });

  _renderTablaInscripciones(filtrados);
}

/* ─────────────────────────────────────────────
   DELETE /inscripciones/:id
───────────────────────────────────────────── */
async function eliminarInscripcion(id, nombre) {
  const result = await Swal.fire({
    icon: 'warning', title: '¿Eliminar inscripción?',
    html: `¿Seguro que querés eliminar la inscripción de <strong>${nombre}</strong>?<br>
           <small class="text-muted">Esta acción no se puede deshacer.</small>`,
    showCancelButton: true,
    confirmButtonColor: '#d2232a', cancelButtonColor: '#7c7b75',
    confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
  });
  if (!result.isConfirmed) return;

  try {
    // ── HTTP DELETE /inscripciones/:id ─────────
    const res  = await fetch(`${API_URL}/inscripciones/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ icon: 'error', title: 'Error', text: data.msj, confirmButtonColor: '#006AEA' });
      return;
    }

    Swal.fire({
      icon: 'success', title: 'Inscripción eliminada',
      text: `La inscripción de ${nombre} fue eliminada.`,
      confirmButtonColor: '#006AEA', timer: 2000, timerProgressBar: true
    });
    cargarPanelAdmin();

  } catch {
    Swal.fire({ icon: 'error', title: 'Sin conexión', text: 'No se pudo conectar con el servidor.', confirmButtonColor: '#006AEA' });
  }
}

/* ─────────────────────────────────────────────
   PUT /inscripciones/:id — Modal edición
───────────────────────────────────────────── */
function abrirModalEditarInscripcion(id, nombre, identificacion, correo, telefono, carrera, actividad, estado, comentarios) {
  const cuerpo = document.getElementById('modalAdminCuerpo');
  const titulo = document.getElementById('modalAdminTitulo');
  if (!cuerpo) return;

  if (titulo) titulo.innerHTML = '<i class="fa-solid fa-pen"></i> Editar Inscripción';

  const opActividades = Object.keys(CUPOS_ACTIVIDADES)
    .map(a => `<option value="${a}" ${a === actividad ? 'selected' : ''}>${a}</option>`)
    .join('');

  const opEstados = ['pendiente','confirmada','cancelada']
    .map(e => `<option value="${e}" ${e === estado ? 'selected' : ''}>${e.charAt(0).toUpperCase() + e.slice(1)}</option>`)
    .join('');

  cuerpo.innerHTML = `
    <div class="mb-3">
      <label class="form-label">Nombre completo <span class="requerido">*</span></label>
      <input type="text" id="editInsNombre" class="form-control" value="${nombre}" />
    </div>
    <div class="row g-3 mb-3">
      <div class="col-md-6">
        <label class="form-label">Identificación <span class="requerido">*</span></label>
        <input type="text" id="editInsIdentificacion" class="form-control" value="${identificacion}" />
      </div>
      <div class="col-md-6">
        <label class="form-label">Teléfono <span class="requerido">*</span></label>
        <input type="tel" id="editInsTelefono" class="form-control" value="${telefono}" />
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Correo electrónico <span class="requerido">*</span></label>
      <input type="email" id="editInsCorreo" class="form-control" value="${correo}" />
    </div>
    <div class="mb-3">
      <label class="form-label">Carrera o grupo <span class="requerido">*</span></label>
      <input type="text" id="editInsCarrera" class="form-control" value="${carrera}" />
    </div>
    <div class="row g-3 mb-3">
      <div class="col-md-8">
        <label class="form-label">Actividad <span class="requerido">*</span></label>
        <select id="editInsActividad" class="form-select">${opActividades}</select>
      </div>
      <div class="col-md-4">
        <label class="form-label">Estado <span class="requerido">*</span></label>
        <select id="editInsEstado" class="form-select">${opEstados}</select>
      </div>
    </div>
    <div class="mb-4">
      <label class="form-label">Comentarios adicionales</label>
      <textarea id="editInsComentarios" class="form-control" rows="3">${comentarios}</textarea>
    </div>
    <button type="button" class="btn btn-primario w-100 justify-content-center"
            onclick="guardarEdicionInscripcion('${id}')">
      <i class="fa-solid fa-floppy-disk"></i> Guardar cambios
    </button>`;

  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAdmin')).show();
}

async function guardarEdicionInscripcion(id) {
  const nombre         = document.getElementById('editInsNombre').value.trim();
  const identificacion = document.getElementById('editInsIdentificacion').value.trim();
  const correo         = document.getElementById('editInsCorreo').value.trim().toLowerCase();
  const telefono       = document.getElementById('editInsTelefono').value.trim();
  const carrera        = document.getElementById('editInsCarrera').value.trim();
  const actividad      = document.getElementById('editInsActividad').value;
  const estado         = document.getElementById('editInsEstado').value;
  const comentarios    = document.getElementById('editInsComentarios').value.trim();

  if (!nombre || !identificacion || !correo || !telefono || !carrera || !actividad || !estado) {
    Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Completá todos los campos obligatorios.', confirmButtonColor: '#006AEA' });
    return;
  }

  Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  try {
    // ── HTTP PUT /inscripciones/:id ────────────
    const res  = await fetch(`${API_URL}/inscripciones/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nombre, identificacion, correo, telefono, carrera, actividad, estado, comentarios })
    });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ icon: 'error', title: 'Error al actualizar', text: data.msj, confirmButtonColor: '#006AEA' });
      return;
    }

    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAdmin')).hide();
    Swal.fire({
      icon: 'success', title: 'Inscripción actualizada',
      text: `La inscripción de ${data.nombre} fue actualizada correctamente.`,
      confirmButtonColor: '#006AEA', timer: 2000, timerProgressBar: true
    });
    cargarPanelAdmin();

  } catch {
    Swal.fire({ icon: 'error', title: 'Sin conexión', text: 'No se pudo conectar con el servidor.', confirmButtonColor: '#006AEA' });
  }
}

/* ─────────────────────────────────────────────
   GET /inscripciones/estadisticas — Gráficos
   Actualiza tarjetas resumen + 3 Chart.js
───────────────────────────────────────────── */
async function cargarEstadisticas() {
  try {
    // ── HTTP GET /inscripciones/estadisticas ───
    const res  = await fetch(`${API_URL}/inscripciones/estadisticas`);
    const data = await res.json();

    if (!res.ok) return;

    const { porActividad, totales, porSemana } = data;

    // Tarjetas de resumen
    _setEl('resumenTotal',       totales.total);
    _setEl('resumenPendientes',  totales.pendientes);
    _setEl('resumenConfirmadas', totales.confirmadas);
    _setEl('resumenCuposLlenos', porActividad.filter(a => a.disponibles === 0).length);

    // Gráfico 1 — Inscripciones por actividad (barras horizontales)
    _dibujarGraficoActividad(porActividad);

    // Gráfico 2 — Ocupación de cupos (barras apiladas)
    _dibujarGraficoCupos(porActividad);

    // Gráfico 3 — Inscripciones semanales (línea)
    _dibujarGraficoSemanas(porSemana);

  } catch {
    console.warn('No se pudieron cargar las estadísticas de inscripciones.');
  }
}

function _setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* Gráfico 1 — Inscripciones por actividad */
function _dibujarGraficoActividad(porActividad) {
  const ctx = document.getElementById('graficoActividad');
  if (!ctx) return;

  if (_chartActividad) _chartActividad.destroy();

  // Abreviaciones para el eje Y
  const labels = porActividad.map(a => {
    const palabras = a.actividad.split(' ');
    return palabras.length > 3 ? palabras.slice(0, 3).join(' ') + '…' : a.actividad;
  });

  _chartActividad = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Inscritos',
        data: porActividad.map(a => a.inscritos),
        backgroundColor: '#006AEA',
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  });
}

/* Gráfico 2 — Ocupación de cupos (barras apiladas: inscritos + disponibles) */
function _dibujarGraficoCupos(porActividad) {
  const ctx = document.getElementById('graficoCupos');
  if (!ctx) return;

  if (_chartCupos) _chartCupos.destroy();

  const labels = porActividad.map(a => {
    const p = a.actividad.split(' ');
    return p.length > 2 ? p.slice(0, 2).join(' ') + '…' : a.actividad;
  });

  _chartCupos = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Inscritos',
          data: porActividad.map(a => a.inscritos),
          backgroundColor: '#006AEA',
          borderRadius: 4
        },
        {
          label: 'Disponibles',
          data: porActividad.map(a => a.disponibles),
          backgroundColor: '#cfe2ff',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  });
}

/* Gráfico 3 — Inscripciones por semana (línea) */
function _dibujarGraficoSemanas(porSemana) {
  const ctx = document.getElementById('graficoSemanas');
  if (!ctx) return;

  if (_chartSemanas) _chartSemanas.destroy();

  // Si no hay datos reales, mostrar datos de ejemplo
  const datos = porSemana.length > 0 ? porSemana : [
    { semana: 'Sem 1', cantidad: 0 },
    { semana: 'Sem 2', cantidad: 0 }
  ];

  _chartSemanas = new Chart(ctx, {
    type: 'line',
    data: {
      labels: datos.map(d => d.semana),
      datasets: [{
        label: 'Inscripciones',
        data: datos.map(d => d.cantidad),
        borderColor:     '#006AEA',
        backgroundColor: 'rgba(0,106,234,0.1)',
        fill:   true,
        tension: 0.4,
        pointBackgroundColor: '#164a98',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  });
}

/* ─────────────────────────────────────────────
   Utilidad interna — escapar comillas simples
───────────────────────────────────────────── */
function _esc(s) { return (s || '').replace(/'/g, "\\'"); }

/* =============================================
   INICIALIZACIÓN
   Campus_Fest_2.js ya llama aplicarEstadoSesion()
   en su propio DOMContentLoaded. Los callbacks
   _onSesionAdmin / _onSesionVisitante / _onSesionNula
   definidos arriba se ejecutarán automáticamente.
   Solo necesitamos inicializar el formulario aquí.
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initInscripcion();
});

// ==========================================
// LÓGICA DE CONTACTO Y SOPORTE DINÁMICO
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
  // Inicializar la carga de mensajes del administrador si estamos en contacto.html
  if (document.getElementById("tablaMensajes")) {
    cargarMensajesAdmin();
  }
});

// Procesar y guardar nuevas consultas desde el formulario
function procesarContacto(event) {
  event.preventDefault();

  const nombre = document.getElementById("txtNombreContacto").value.trim();
  const correo = document.getElementById("txtCorreoContacto").value.trim();
  const asunto = document.getElementById("txtAsunto").value.trim();
  const mensaje = document.getElementById("txtMensaje").value.trim();

  if (!nombre || !correo || !asunto || !mensaje) {
    Swal.fire("Campos incompletos", "Por favor completa todos los campos del formulario.", "warning");
    return;
  }

  let mensajes = JSON.parse(localStorage.getItem("campusfest_mensajes")) || [];
  
  const nuevoMensaje = {
    id: Date.now(),
    nombre,
    correo,
    asunto,
    mensaje
  };

  mensajes.push(nuevoMensaje);
  localStorage.setItem("campusfest_mensajes", JSON.stringify(mensajes));

  Swal.fire({
    icon: "success",
    title: "¡Mensaje enviado!",
    text: "Tu consulta ha sido enviada con éxito al equipo organizador.",
    timer: 2000,
    showConfirmButton: false
  });

  document.getElementById("formContacto").reset();
  cargarMensajesAdmin();
}

// Cargar dinámicamente las consultas en la tabla del panel administrador
function cargarMensajesAdmin() {
  const tbody = document.getElementById("tablaMensajes");
  if (!tbody) return;

  let mensajes = JSON.parse(localStorage.getItem("campusfest_mensajes")) || [];

  // Datos base por defecto si la bandeja está vacía
  if (mensajes.length === 0) {
    mensajes = [
      {
        id: 1,
        nombre: "Vero Alfaro",
        correo: "valfaroa@cenfotec.ac.cr",
        asunto: "Duda con Stand",
        mensaje: "¿Aún hay espacio para colocar un banner extra en el stand A-10?"
      }
    ];
    localStorage.setItem("campusfest_mensajes", JSON.stringify(mensajes));
  }

  tbody.innerHTML = "";

  mensajes.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.correo}</td>
      <td>${item.asunto}</td>
      <td>${item.mensaje}</td>
      <td>
        <button class="btn btn-primario btn-sm py-0 px-2" onclick="responderMensaje(${item.id})">
          <i class="fa-solid fa-reply"></i> Responder
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Ventana interactiva para que el administrador responda el mensaje
async function responderMensaje(id) {
  let mensajes = JSON.parse(localStorage.getItem("campusfest_mensajes")) || [];
  const mensajeObj = mensajes.find(m => m.id === id);

  if (!mensajeObj) return;

  const { value: respuesta } = await Swal.fire({
    title: `Responder a ${mensajeObj.nombre}`,
    input: 'textarea',
    inputLabel: `Asunto: "${mensajeObj.asunto}"`,
    inputPlaceholder: 'Escribe tu respuesta aquí para enviarla al usuario...',
    inputAttributes: {
      'aria-label': 'Escribe tu respuesta aquí'
    },
    showCancelButton: true,
    confirmButtonText: 'Enviar Respuesta',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#0d6efd'
  });

  if (respuesta) {
    // Remover de pendientes al ser respondido
    mensajes = mensajes.filter(m => m.id !== id);
    localStorage.setItem("campusfest_mensajes", JSON.stringify(mensajes));

    Swal.fire(
      '¡Respuesta Enviada!',
      `La respuesta se ha enviado correctamente a ${mensajeObj.correo}.`,
      'success'
    );

    cargarMensajesAdmin();
  }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarActividadesEnSelect();
});

async function cargarActividadesEnSelect() {
    try {
        const response = await fetch('http://localhost:3000/api/actividades');
        const actividades = await response.json();

        // Reemplaza 'selectActividad' por el ID real que tenga tu <select> en inscripcion.html
        const selectElement = document.getElementById('selectActividad') || document.querySelector('select[name="actividad"], select');
        
        if (!selectElement) return;

        // Mantener la opción por defecto
        selectElement.innerHTML = '<option value="">— Seleccioná una actividad —</option>';

        actividades.forEach(act => {
            const option = document.createElement('option');
            option.value = act._id || act.nombre; // Usamos el ID o el nombre según prefieras
            
            // Calculamos cupos disponibles si aplica
            const cuposDisponibles = act.cupoMax - (act.cupoActual || 0);
            option.textContent = `${act.nombre} — ${cuposDisponibles > 0 ? cuposDisponibles + ' cupos disponibles' : 'Cupos llenos'}`;
            
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar las actividades en el formulario de inscripción:", error);
    }
}