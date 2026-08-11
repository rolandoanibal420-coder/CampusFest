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


/* Referencias a las instancias de Chart.js (para destruir antes de redibujar) */
let _chartActividad = null;
let _chartCupos     = null;
let _chartSemanas   = null;


/* Cache de inscripciones y de actividades (para no re-consultar al servidor innecesariamente) */
let _inscripcionesCache = [];
let _actividadesCache = []; 

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
============================================= */
function initInscripcion() {
  poblarSelectInscripcion();
  limpiarFormInscripcion();
}

/* =============================================
   POBLAR SELECT DE ACTIVIDADES
   Muestra cupos disponibles en tiempo real
============================================= */
async function poblarSelectInscripcion() {
  const sel = document.getElementById('inpActividad');
  if (!sel) return;

  sel.innerHTML = '<option value="">— Seleccioná una actividad —</option>';

  try {
    const res = await fetch(`${API_URL}/actividades`);
    const actividades = await res.json(); // Aquí llegan los datos reales (los 2 inscritos, etc.)

    if (!res.ok) return;

    _actividadesCache = actividades; // <--- AQUÍ GUARDAMOS LOS DATOS REALES

    actividades.forEach(act => {
      const cupoMax = Number(act.cupoMax) || 0;
      const cupoActual = Number(act.cupoActual) || 0;
      const libres = Math.max(0, cupoMax - cupoActual);
      const llena = cupoActual >= cupoMax || act.estado === 'llena';

      const opt = document.createElement('option');
      opt.value = act.nombre; 
      opt.textContent = llena
        ? `${act.nombre} (Lista de espera)`
        : `${act.nombre} — ${libres} cupos disponibles`;
      sel.appendChild(opt);
    });

    // Event listener se mantiene igual
    sel.addEventListener('change', (e) => verificarCupoInscripcion(e.target.value));

    const params = new URLSearchParams(window.location.search);
    const actUrl = params.get('actividad');
    if (actUrl) {
      sel.value = actUrl;
      verificarCupoInscripcion(actUrl);
    }
  } catch (error) {
    console.error("Error al cargar actividades", error);
  }
}

/* =============================================
   ALERTA DINÁMICA DE CUPOS
============================================= */
/* =============================================
   ALERTA DINÁMICA DE CUPOS (Corregida)
============================================= */
function verificarCupoInscripcion(nombre) {
  const al = document.getElementById('alertaCupo');
  const tx = document.getElementById('alertaCupoTexto');
  if (!al || !tx || !nombre) {
    if (al) al.style.display = 'none';
    return;
  }

  // Buscamos la actividad en nuestro caché dinámico
  const actividad = _actividadesCache.find(a => a.nombre === nombre);
  
  // Si no encontramos la actividad (o no hay caché aún), ocultamos la alerta
  if (!actividad) {
    al.style.display = 'none';
    return;
  }

  const max = Number(actividad.cupoMax) || 0;
  const actuales = Number(actividad.cupoActual) || 0;
  const libres = Math.max(0, max - actuales);
  const pct = (actuales / max) * 100;

  if (libres <= 0) {
    tx.textContent = `"${nombre}" no tiene cupos disponibles. Tu inscripción quedará en lista de espera.`;
    al.style.display = 'flex';
    al.style.background = 'linear-gradient(135deg,#fff3cd,#ffeaa7)';
    al.style.borderColor = '#ffc63e';
    al.style.color = '#7a4800';
  } else if (pct >= 80) {
    tx.textContent = `¡Solo quedan ${libres} cupos para "${nombre}"! Inscribite pronto.`;
    al.style.display = 'flex';
    al.style.background = 'linear-gradient(135deg,#d4edda,#c3e6cb)';
    al.style.borderColor = '#4aa147';
    al.style.color = '#1a5a1a';
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

/* =============================================
   POST /inscripciones — Enviar formulario
============================================= */
async function enviarInscripcion() {
  const nombre    = document.getElementById('inpNombre').value.trim();
  const ident     = document.getElementById('inpIdentificacion').value.trim();
  const correo    = document.getElementById('inpCorreo').value.trim();
  const tel       = document.getElementById('inpTelefono').value.trim();
  const carrera   = document.getElementById('inpCarrera').value.trim();
  const actividad = document.getElementById('inpActividad').value;
  const coment    = document.getElementById('inpComentarios')?.value.trim() || '';

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
    const res  = await fetch(`${API_URL}/inscripciones`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nombre, identificacion: ident, correo, telefono: tel, carrera, actividad, comentarios: coment })
    });
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ icon: 'error', title: 'Error', text: data.msj || 'No se pudo enviar la inscripción.' });
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
============================================= */
async function cargarPanelAdmin() {
  await Promise.all([
    cargarTablaInscripciones(),
    cargarEstadisticas()
  ]);
}

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

  const params = new URLSearchParams();
  if (filtros.q)         params.append('q',         filtros.q);
  if (filtros.actividad) params.append('actividad',  filtros.actividad);
  if (filtros.estado)    params.append('estado',     filtros.estado);
  const qs = params.toString() ? '?' + params.toString() : '';

  try {
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

  const BADGE_CLASE = { pendiente: 'bg-warning text-dark', confirmada: 'bg-success', cancelada: 'bg-danger' };
  const BADGE_LABEL = { pendiente: 'Pendiente', confirmada: 'Confirmada', cancelada: 'Cancelada' };
  const BADGE_ICONO = { pendiente: 'fa-clock', confirmada: 'fa-circle-check', cancelada: 'fa-circle-xmark' };

  tbody.innerHTML = data.map(i => {
    const badgeEstado = i.estado === 'pendiente'
      ? `<button type="button"
                 class="badge border-0 ${BADGE_CLASE.pendiente}"
                 style="cursor:pointer;font-size:.8rem;padding:.35em .65em;"
                 onclick="confirmarInscripcion('${i._id}','${_esc(i.nombre)}')"
                 title="Clic para confirmar esta inscripción">
           <i class="fa-solid fa-clock"></i> Pendiente
           <i class="fa-solid fa-hand-pointer ms-1" style="font-size:.7rem;opacity:.7;"></i>
         </button>`
      : `<span class="badge ${BADGE_CLASE[i.estado] || 'bg-secondary'}" style="font-size:.8rem;">
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
                onclick="verComentarios('${_esc(i.nombre)}','${_esc(i.comentarios || 'Sin comentarios adicionales.')}')" title="Ver comentarios">
          <i class="fa-solid fa-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-warning me-1"
                onclick="abrirModalEditarInscripcion('${i._id}','${_esc(i.nombre)}','${_esc(i.identificacion)}','${_esc(i.correo)}','${_esc(i.telefono)}','${_esc(i.carrera)}','${_esc(i.actividad)}','${i.estado}','${_esc(i.comentarios || '')}')" title="Editar">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger"
                onclick="eliminarInscripcion('${i._id}','${_esc(i.nombre)}')" title="Eliminar">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>`;
  }).join('');
}

function verComentarios(nombre, comentarios) {
  Swal.fire({ title: `Comentarios — ${nombre}`, text: comentarios || 'Sin comentarios adicionales.', icon: 'info', confirmButtonColor: '#006AEA', confirmButtonText: 'Cerrar' });
}

async function confirmarInscripcion(id, nombre) {
  const result = await Swal.fire({
    icon: 'question', title: '¿Confirmar inscripción?',
    html: `¿Deseás confirmar la inscripción de <strong>${nombre}</strong>?`,
    showCancelButton: true, confirmButtonColor: '#198754', cancelButtonColor: '#7c7b75', confirmButtonText: 'Sí, confirmar', cancelButtonText: 'No, cancelar'
  });

  if (!result.isConfirmed) return;

  const inscripcion = _inscripcionesCache.find(i => i._id === id);
  if (!inscripcion) return;

  Swal.fire({ title: 'Confirmando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  try {
    const res = await fetch(`${API_URL}/inscripciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...inscripcion, estado: 'confirmada' })
    });

    if (!res.ok) {
      Swal.fire({ icon: 'error', title: 'Error al confirmar', confirmButtonColor: '#006AEA' });
      return;
    }

    // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
    await cargarPanelAdmin();       // Recarga la tabla y estadísticas
    await poblarSelectInscripcion(); // Vuelve a pedir las actividades al servidor para actualizar los cupos
    // ---------------------------------

    Swal.fire({ icon: 'success', title: '¡Inscripción confirmada!', timer: 2000 });

  } catch {
    Swal.fire({ icon: 'error', title: 'Sin conexión', confirmButtonColor: '#006AEA' });
  }
}
function aplicarFiltrosTabla() {
  const q         = document.getElementById('buscarInscripcion')?.value.toLowerCase() || '';
  const actividad = document.getElementById('filtroActividad')?.value || '';
  const estado    = document.getElementById('filtroEstado')?.value    || '';

  const filtrados = _inscripcionesCache.filter(i => {
    const textoOk = !q || i.nombre.toLowerCase().includes(q) || i.correo.toLowerCase().includes(q) || i.identificacion.toLowerCase().includes(q);
    const actOk   = !actividad || i.actividad === actividad;
    const estOk   = !estado    || i.estado    === estado;
    return textoOk && actOk && estOk;
  });

  _renderTablaInscripciones(filtrados);
}

async function eliminarInscripcion(id, nombre) {
  const result = await Swal.fire({
    icon: 'warning', title: '¿Eliminar inscripción?',
    html: `¿Seguro que querés eliminar la inscripción de <strong>${nombre}</strong>?`,
    showCancelButton: true, confirmButtonColor: '#d2232a', cancelButtonColor: '#7c7b75'
  });
  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`${API_URL}/inscripciones/${id}`, { method: 'DELETE' });
    if (!res.ok) return;

    // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
    await cargarPanelAdmin();
    await poblarSelectInscripcion(); // Actualiza los cupos disponibles tras liberar el espacio
    // ---------------------------------

    Swal.fire({ icon: 'success', title: 'Inscripción eliminada', timer: 2000 });
  } catch {
    Swal.fire({ icon: 'error', title: 'Sin conexión' });
  }
}

function abrirModalEditarInscripcion(id, nombre, identificacion, correo, telefono, carrera, actividad, estado, comentarios) {
  const cuerpo = document.getElementById('modalAdminCuerpo');
  const titulo = document.getElementById('modalAdminTitulo');
  if (!cuerpo) return;

  if (titulo) titulo.innerHTML = '<i class="fa-solid fa-pen"></i> Editar Inscripción';

  // Usamos _actividadesCache si ya está cargado, de lo contrario extraemos las actividades únicas del caché de inscripciones
  let listaNombresActividades = _actividadesCache.map(a => a.nombre);
  if (listaNombresActividades.length === 0) {
    listaNombresActividades = [...new Set(_inscripcionesCache.map(i => i.actividad))];
  }

  const opActividades = listaNombresActividades
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
    Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Completá todos los campos obligatorios.' });
    return;
  }

  Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

  try {
    const res  = await fetch(`${API_URL}/inscripciones/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nombre, identificacion, correo, telefono, carrera, actividad, estado, comentarios })
    });

    if (!res.ok) return;

    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAdmin')).hide();
    
    // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
    await cargarPanelAdmin();
    await poblarSelectInscripcion(); // Refresca los cupos en memoria/interfaz
    // ---------------------------------

    Swal.fire({ icon: 'success', title: 'Inscripción actualizada', timer: 2000 });

  } catch {
    Swal.fire({ icon: 'error', title: 'Sin conexión' });
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
  const datos = porSemana && porSemana.length > 0 ? porSemana : [
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
        borderColor:    '#006AEA',
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
   INICIALIZACIÓN DE LA VISTA DE INSCRIPCIÓN
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initInscripcion();
});