/* =============================================
   CAMPUSFEST 2026 — Campus_Fest.js
   Universidad Cenfotec
   Páginas: Inicio, Agenda, Inscripción
============================================= */

/* ===== DATOS SIMULADOS (Etapa 1 — se reemplazan por API en Etapa 2) ===== */

const ACTIVIDADES = [
  {
    id: 1,
    nombre: "Hackathon de IA",
    categoria: "tecnologica",
    icono: "fa-laptop-code",
    fecha: "14 Jul",
    hora: "08:00",
    lugar: "Lab A-201",
    cupoMax: 30,
    cupoActual: 28,
    descripcion: "Competencia intensiva de desarrollo de soluciones usando Inteligencia Artificial. Equipos de 3-4 personas resolverán retos reales propuestos por empresas tecnológicas.",
    requisitos: "Conocimientos en Python o JavaScript. Traer laptop.",
    destacada: true
  },
  {
    id: 2,
    nombre: "Festival Gastronómico",
    categoria: "gastronomica",
    icono: "fa-utensils",
    fecha: "15 Jul",
    hora: "11:00",
    lugar: "Plaza Central",
    cupoMax: 200,
    cupoActual: 120,
    descripcion: "Degustación de platillos internacionales preparados por estudiantes y grupos gastronómicos del campus. Más de 20 puestos de comida.",
    requisitos: "Entrada libre. Consumo según disponibilidad.",
    destacada: true
  },
  {
    id: 3,
    nombre: "Exposición de Arte Digital",
    categoria: "artistica",
    icono: "fa-palette",
    fecha: "14 Jul",
    hora: "10:00",
    lugar: "Galería B",
    cupoMax: 80,
    cupoActual: 65,
    descripcion: "Muestra de obras digitales creadas por estudiantes: ilustración, diseño UX/UI, motion graphics y fotografía editorial.",
    requisitos: "No requiere inscripción para visitar. Registro para exponer.",
    destacada: true
  },
  {
    id: 4,
    nombre: "Torneo de Fútbol 5",
    categoria: "deportiva",
    icono: "fa-futbol",
    fecha: "16 Jul",
    hora: "14:00",
    lugar: "Cancha C",
    cupoMax: 60,
    cupoActual: 60,
    descripcion: "Torneo relámpago de fútbol sala entre equipos de diferentes carreras. Fase de grupos y eliminación directa.",
    requisitos: "Equipos de 5 jugadores + 2 suplentes. Ropa deportiva obligatoria.",
    destacada: false
  },
  {
    id: 5,
    nombre: "Noche de Teatro",
    categoria: "cultural",
    icono: "fa-masks-theater",
    fecha: "17 Jul",
    hora: "19:00",
    lugar: "Auditorio Principal",
    cupoMax: 120,
    cupoActual: 95,
    descripcion: "Presentación de obras breves y performance de teatro improvisado a cargo del club de teatro de la universidad.",
    requisitos: "Entrada libre hasta agotar aforo.",
    destacada: false
  },
  {
    id: 6,
    nombre: "Escape Room Tecnológico",
    categoria: "recreativa",
    icono: "fa-puzzle-piece",
    fecha: "15 Jul",
    hora: "09:00",
    lugar: "Sala C-105",
    cupoMax: 20,
    cupoActual: 16,
    descripcion: "Experiencia de escape room temática en tecnología y ciencias de la computación. Resolvé acertijos y desafíos de programación.",
    requisitos: "Grupos de máximo 4 personas. Reserva previa obligatoria.",
    destacada: false
  },
  {
    id: 7,
    nombre: "Taller de Robótica",
    categoria: "tecnologica",
    icono: "fa-robot",
    fecha: "16 Jul",
    hora: "10:00",
    lugar: "Lab A-105",
    cupoMax: 25,
    cupoActual: 20,
    descripcion: "Taller práctico de construcción y programación de robots con Arduino. Incluye competencia de obstáculos.",
    requisitos: "Sin experiencia previa requerida. Materiales incluidos.",
    destacada: false
  },
  {
    id: 8,
    nombre: "Jam de Música en Vivo",
    categoria: "artistica",
    icono: "fa-guitar",
    fecha: "18 Jul",
    hora: "18:00",
    lugar: "Terraza Norte",
    cupoMax: 150,
    cupoActual: 40,
    descripcion: "Sesión abierta de música en vivo con bandas y artistas de la comunidad universitaria. Varios géneros musicales.",
    requisitos: "Entrada libre. Para tocar: registrar banda antes del 10 de julio.",
    destacada: false
  },
  {
    id: 9,
    nombre: "Maratón de Danza",
    categoria: "cultural",
    icono: "fa-music",
    fecha: "17 Jul",
    hora: "15:00",
    lugar: "Patio Central",
    cupoMax: 50,
    cupoActual: 35,
    descripcion: "Competencia de baile urbano, tropical y folclórico. Categorías individual y grupal.",
    requisitos: "Ropa cómoda. Inscripción individual o grupal (máx 6 personas).",
    destacada: false
  }
];

const AGENDA = [
  {
    dia: "Lunes 14 de Julio",
    eventos: [
      { hora: "08:00", nombre: "Hackathon de IA — Inicio", lugar: "Lab A-201", categoria: "tecnologica", estado: "disponible" },
      { hora: "10:00", nombre: "Exposición de Arte Digital", lugar: "Galería B", categoria: "artistica", estado: "disponible" },
      { hora: "14:00", nombre: "Ceremonia de Apertura", lugar: "Auditorio Principal", categoria: "cultural", estado: "disponible" },
      { hora: "19:00", nombre: "Inauguración de Stands", lugar: "Plaza Central", categoria: "recreativa", estado: "disponible" }
    ]
  },
  {
    dia: "Martes 15 de Julio",
    eventos: [
      { hora: "09:00", nombre: "Escape Room Tecnológico", lugar: "Sala C-105", categoria: "recreativa", estado: "disponible" },
      { hora: "11:00", nombre: "Festival Gastronómico", lugar: "Plaza Central", categoria: "gastronomica", estado: "disponible" },
      { hora: "16:00", nombre: "Hackathon de IA — Presentaciones", lugar: "Lab A-201", categoria: "tecnologica", estado: "lleno" }
    ]
  },
  {
    dia: "Miércoles 16 de Julio",
    eventos: [
      { hora: "10:00", nombre: "Taller de Robótica", lugar: "Lab A-105", categoria: "tecnologica", estado: "disponible" },
      { hora: "14:00", nombre: "Torneo de Fútbol 5", lugar: "Cancha C", categoria: "deportiva", estado: "lleno" },
      { hora: "17:00", nombre: "Charlas de Emprendimiento", lugar: "Sala B-201", categoria: "cultural", estado: "disponible" }
    ]
  },
  {
    dia: "Jueves 17 de Julio",
    eventos: [
      { hora: "10:00", nombre: "Workshop UX/UI", lugar: "Lab Diseño", categoria: "tecnologica", estado: "disponible" },
      { hora: "15:00", nombre: "Maratón de Danza", lugar: "Patio Central", categoria: "cultural", estado: "disponible" },
      { hora: "19:00", nombre: "Noche de Teatro", lugar: "Auditorio Principal", categoria: "cultural", estado: "disponible" }
    ]
  },
  {
    dia: "Viernes 18 de Julio",
    eventos: [
      { hora: "10:00", nombre: "Feria de Proyectos Finales", lugar: "Pabellón A", categoria: "tecnologica", estado: "disponible" },
      { hora: "14:00", nombre: "Premiaciones Hackathon", lugar: "Auditorio Principal", categoria: "tecnologica", estado: "cancelado" },
      { hora: "18:00", nombre: "Jam de Música en Vivo", lugar: "Terraza Norte", categoria: "artistica", estado: "disponible" },
      { hora: "20:00", nombre: "Clausura CampusFest 2026", lugar: "Plaza Central", categoria: "cultural", estado: "disponible" }
    ]
  }
];

/* ===== ESTADO GLOBAL ===== */
let modoAdmin = false;

/* =============================================
   MODO ADMINISTRADOR
   (RF-ADM-01/02/03: alternar vista, mostrar
   controles adicionales y gestión de cupos)
============================================= */

/** Alterna entre vista visitante y vista administrador */
function toggleAdmin() {

  
  modoAdmin = !modoAdmin;
  const btn   = document.getElementById('btnAdminToggle');
  const badge = document.getElementById('badgeAdmin');
  

  if (modoAdmin) {
    document.body.classList.add('modo-admin');
    btn.innerHTML = '<i class="fa-solid fa-user" aria-hidden="true"></i> Vista Visitante';
    btn.classList.add('admin-activo');
    btn.setAttribute('aria-pressed', 'true');
    badge.classList.add('visible');
    Swal.fire({
      icon: 'success',
      title: 'Modo Administrador',
      text: 'Ahora tenés acceso a los controles de gestión.',
      confirmButtonColor: '#006AEA',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  } else {
    document.body.classList.remove('modo-admin');
    btn.innerHTML = '<i class="fa-solid fa-gear" aria-hidden="true"></i> Vista Admin';
    btn.classList.remove('admin-activo');
    btn.setAttribute('aria-pressed', 'false');
    badge.classList.remove('visible');
    Swal.fire({
      icon: 'info',
      title: 'Vista Visitante',
      text: 'Volviste a la vista de visitante.',
      confirmButtonColor: '#006AEA',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
    
  }
  
}

function toggleAdmin_1() {

    const panelAdmin = document.getElementById("panelAdmin");
    const formulario = document.querySelector(".form-wrapper");
    const badge = document.getElementById("badgeAdmin");

    const adminActivo = panelAdmin.style.display === "block";

    if (adminActivo) {

        panelAdmin.style.display = "none";
        formulario.style.display = "block";
        badge.style.display = "none";

    } else {

        panelAdmin.style.display = "block";
        formulario.style.display = "none";
        badge.style.display = "flex";

    }
}


/* =============================================
   UTILIDADES — CUPOS Y CATEGORÍAS
============================================= */

/**
 * Calcula el estado de cupos de una actividad.
 * @param {Object} act - Objeto actividad
 * @returns {Object} Porcentaje, cupos libres, clases CSS y etiquetas
 */
function getCupoInfo(act) {
  const pct   = (act.cupoActual / act.cupoMax) * 100;
  const libre = act.cupoMax - act.cupoActual;
  let clase       = 'cupo-ok';
  let estadoLabel = 'Disponible';
  let estadoClase = 'estado-disponible';

  if (pct >= 100) {
    clase = 'cupo-lleno';
    estadoLabel = 'Lleno';
    estadoClase = 'estado-lleno';
  } else if (pct >= 80) {
    clase = 'cupo-alerta';
    estadoLabel = 'Casi lleno';
    estadoClase = 'estado-lleno';
  }

  return { pct, libre, clase, estadoLabel, estadoClase };
}

const NOMBRES_CATEGORIA = {
  cultural:     'Cultural',
  deportiva:    'Deportiva',
  tecnologica:  'Tecnológica',
  artistica:    'Artística',
  gastronomica: 'Gastronómica',
  recreativa:   'Recreativa'
};

const ICONOS_CATEGORIA = {
  cultural:     'fa-masks-theater',
  deportiva:    'fa-futbol',
  tecnologica:  'fa-laptop-code',
  artistica:    'fa-palette',
  gastronomica: 'fa-utensils',
  recreativa:   'fa-gamepad'
};

/**
 * Genera el HTML de un tag de categoría con ícono (RF-ACC-02: ícono +
 * texto para no depender solo del color, compatible con daltonismo).
 * @param {string} cat - Clave de categoría
 * @returns {string} HTML del tag
 */
function getCategoriaTag(cat) {
  const clases = {
    cultural:     'tag-cultural',
    deportiva:    'tag-deportiva',
    tecnologica:  'tag-tecnologica',
    artistica:    'tag-artistica',
    gastronomica: 'tag-gastronomica',
    recreativa:   'tag-recreativa'
  };
  return `<span class="tag ${clases[cat]}" aria-label="Categoría: ${NOMBRES_CATEGORIA[cat]}">
            <i class="fa-solid ${ICONOS_CATEGORIA[cat]}" aria-hidden="true"></i> ${NOMBRES_CATEGORIA[cat]}
          </span>`;
}

/* =============================================
   RENDER — TARJETA DE ACTIVIDAD (Inicio)
============================================= */

/**
 * Genera el HTML de una tarjeta de actividad destacada.
 * @param {Object} act - Objeto actividad
 * @returns {string} HTML de la tarjeta
 */
function renderTarjetaActividad(act) {
  const ci    = getCupoInfo(act);
  const libre = act.cupoMax - act.cupoActual;
  const alertaBaja = ci.pct >= 80 && ci.pct < 100;

  return `
    <div class="col-12 col-md-6 col-lg-4">
      <article class="tarjeta" aria-label="Actividad: ${act.nombre}">
        <div class="tarjeta-imagen" aria-hidden="true"><i class="fa-solid ${act.icono}"></i></div>
        <div class="tarjeta-cuerpo">
          ${getCategoriaTag(act.categoria)}
          <h3 class="tarjeta-titulo">${act.nombre}</h3>
          <div class="tarjeta-meta">
            <span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${act.fecha}</span>
            <span><i class="fa-regular fa-clock" aria-hidden="true"></i> ${act.hora}</span>
            <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${act.lugar}</span>
          </div>
          ${alertaBaja
            ? `<div class="alerta-baja-disponibilidad" role="alert"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> ¡Quedan solo ${libre} cupos!</div>`
            : ''}
          <div class="cupo-barra" aria-label="Disponibilidad: ${act.cupoActual} de ${act.cupoMax} cupos ocupados">
            <div class="cupo-progreso ${ci.clase}" style="width:${Math.min(ci.pct, 100)}%"></div>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span style="font-size:0.78rem; color:var(--texto-secundario);">${act.cupoActual}/${act.cupoMax} inscritos</span>
            <span class="estado-pill ${ci.estadoClase}">${ci.estadoLabel}</span>
          </div>
          <div class="d-flex gap-2 flex-wrap">
            <button type="button" class="btn btn-primario btn-sm"
                    data-bs-toggle="modal" data-bs-target="#modalDetalle"
                    onclick="abrirDetalle(${act.id})"
                    aria-label="Ver detalle de ${act.nombre}">
              <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Ver detalle
            </button>
            <div class="admin-controles">
              <button type="button" class="btn btn-secundario btn-sm"
                      onclick="editarActividad(${act.id})"
                      aria-label="Editar ${act.nombre}">
                <i class="fa-solid fa-pen" aria-hidden="true"></i> Editar
              </button>
              <button type="button" class="btn btn-peligro btn-sm"
                      onclick="cancelarActividad(${act.id})"
                      aria-label="Cancelar ${act.nombre}">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i> Cancelar
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>`;
}

/** Renderiza las 3 actividades destacadas en la página de inicio (RF-FE-01.6) */
function renderDestacadas() {
  const grid = document.getElementById('actividadesDestacadas');
  if (!grid) return;
  const destacadas = ACTIVIDADES.filter(a => a.destacada).slice(0, 3);
  grid.innerHTML = destacadas.map(renderTarjetaActividad).join('');
}

/* =============================================
   MODAL — DETALLE DE ACTIVIDAD
============================================= */

/**
 * Abre el modal con el detalle de una actividad (RF-FE-03).
 * @param {number} id - ID de la actividad
 */
function abrirDetalle(id) {
  const act = ACTIVIDADES.find(a => a.id === id);
  if (!act) return;

  const ci    = getCupoInfo(act);
  const libre = act.cupoMax - act.cupoActual;

  document.getElementById('modalTag').innerHTML      = getCategoriaTag(act.categoria);
  document.getElementById('modalTitulo').textContent = act.nombre;
  document.getElementById('modalEstado').innerHTML   = `<span class="estado-pill ${ci.estadoClase}">${ci.estadoLabel}</span>`;

  document.getElementById('modalCuerpo').innerHTML = `
    <div class="modal-campo">
      <div class="modal-campo-label">Descripción</div>
      <div class="modal-campo-valor">${act.descripcion}</div>
    </div>
    <div class="row g-3">
      <div class="col-6">
        <div class="modal-campo">
          <div class="modal-campo-label"><i class="fa-regular fa-calendar" aria-hidden="true"></i> Fecha</div>
          <div class="modal-campo-valor fw-bold">${act.fecha}, 2026</div>
        </div>
      </div>
      <div class="col-6">
        <div class="modal-campo">
          <div class="modal-campo-label"><i class="fa-regular fa-clock" aria-hidden="true"></i> Hora</div>
          <div class="modal-campo-valor fw-bold">${act.hora} hrs</div>
        </div>
      </div>
      <div class="col-6">
        <div class="modal-campo">
          <div class="modal-campo-label"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Lugar</div>
          <div class="modal-campo-valor fw-bold">${act.lugar}</div>
        </div>
      </div>
      <div class="col-6">
        <div class="modal-campo">
          <div class="modal-campo-label"><i class="fa-solid fa-users" aria-hidden="true"></i> Cupos</div>
          <div class="modal-campo-valor fw-bold">
            ${libre > 0 ? libre + ' disponibles' : 'Agotados'} de ${act.cupoMax}
          </div>
        </div>
      </div>
    </div>
    <div class="modal-campo">
      <div class="modal-campo-label"><i class="fa-solid fa-clipboard-list" aria-hidden="true"></i> Requisitos</div>
      <div class="modal-campo-valor">${act.requisitos}</div>
    </div>
    ${ci.pct >= 80 && ci.pct < 100
      ? `<div class="alerta-cupo" role="alert"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> ¡Quedan solo ${libre} cupos disponibles!</div>`
      : ''}
    <button type="button" class="btn ${libre > 0 ? 'btn-primario' : 'btn-acento'} w-100 justify-content-center"
            data-bs-dismiss="modal"
            onclick="irAInscripcionDesdeModal(${act.id})"
            aria-label="${libre > 0 ? 'Inscribirse en ' + act.nombre : 'Unirse a lista de espera de ' + act.nombre}">
      ${libre > 0
        ? '<i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Inscribirme en esta actividad'
        : '<i class="fa-solid fa-list-check" aria-hidden="true"></i> Unirme a lista de espera'}
    </button>`;
}

/**
 * Guarda el ID de la actividad y redirige a inscripcion.html con
 * el query param correspondiente para preseleccionarla (RF-FE-03.2).
 * @param {number} id - ID de la actividad
 */
function irAInscripcionDesdeModal(id) {
  window.location.href = `inscripcion.html?actividad=${id}`;
}

/* =============================================
   RENDER — AGENDA (RF-05)
============================================= */

const ESTADO_CLASES = {
  disponible: 'estado-disponible',
  lleno:      'estado-lleno',
  cancelado:  'estado-cancelado'
};

const ESTADO_ICONOS = {
  disponible: 'fa-circle-check',
  lleno:      'fa-circle-exclamation',
  cancelado:  'fa-circle-xmark'
};

const ESTADO_LABELS = {
  disponible: 'Disponible',
  lleno:      'Lleno',
  cancelado:  'Cancelado'
};

/** Renderiza la agenda cronológica del festival */
function renderAgenda() {
  const cont = document.getElementById('agendaContenido');
  if (!cont) return;

  let html = '';

  AGENDA.forEach(dia => {
    html += `<div class="agenda-grupo-fecha" role="rowgroup" aria-label="Eventos del ${dia.dia}">
               <i class="fa-regular fa-calendar-days" aria-hidden="true"></i> ${dia.dia}
             </div>`;

    dia.eventos.forEach(ev => {
      html += `
        <div class="agenda-fila" role="row" aria-label="${ev.hora} — ${ev.nombre}">
          <div class="agenda-hora" aria-label="Hora: ${ev.hora}">${ev.hora}</div>
          <div>
            <div class="agenda-nombre">${ev.nombre}</div>
            <div class="agenda-lugar" aria-label="Lugar: ${ev.lugar}">
              <i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${ev.lugar}
            </div>
          </div>
          <div>${getCategoriaTag(ev.categoria)}</div>
          <div>
            <span class="estado-pill ${ESTADO_CLASES[ev.estado]}"
                  aria-label="Estado: ${ESTADO_LABELS[ev.estado]}">
              <i class="fa-solid ${ESTADO_ICONOS[ev.estado]}" aria-hidden="true"></i> ${ESTADO_LABELS[ev.estado]}
            </span>
          </div>
          <div class="admin-controles" style="gap:0.4rem;">
            <button type="button" class="btn btn-secundario btn-sm"
                    onclick="editarEvento('${ev.nombre}')"
                    aria-label="Editar evento ${ev.nombre}">
              <i class="fa-solid fa-pen" aria-hidden="true"></i>
            </button>
          </div>
        </div>`;
    });
  });

  cont.innerHTML = html;
}

/* =============================================
   FORMULARIO DE INSCRIPCIÓN (RF-04, RF-CUPOS)
============================================= */

/** Puebla el select de actividades con todas las disponibles */
function poblarSelectActividades() {
  const sel = document.getElementById('inpActividad');
  if (!sel) return;

  sel.innerHTML = '<option value="">— Seleccioná una actividad —</option>';

  ACTIVIDADES.forEach(a => {
    const ci    = getCupoInfo(a);
    const libre = a.cupoMax - a.cupoActual;
    const label = ci.pct >= 100
      ? `${a.nombre} (Lista de espera)`
      : `${a.nombre} — ${libre} cupos`;

    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = label;
    sel.appendChild(opt);
  });

  // Preseleccionar actividad si viene desde el detalle (?actividad=ID)
  const params = new URLSearchParams(window.location.search);
  const actId  = params.get('actividad');
  if (actId && ACTIVIDADES.some(a => a.id == actId)) {
    sel.value = actId;
    verificarCupoActividad(actId);
  }
}

/**
 * Muestra una alerta de cupos según la actividad seleccionada (RF-CUPOS-01/02).
 * @param {string|number} id - ID de la actividad seleccionada
 */
function verificarCupoActividad(id) {
  const alertaEl = document.getElementById('alertaCupo');
  const textoEl  = document.getElementById('alertaCupoTexto');
  if (!alertaEl || !textoEl) return;

  if (!id) {
    alertaEl.style.display = 'none';
    return;
  }

  const act = ACTIVIDADES.find(a => a.id == id);
  if (!act) return;

  const ci    = getCupoInfo(act);
  const libre = act.cupoMax - act.cupoActual;

  if (ci.pct >= 100) {
    textoEl.textContent = `"${act.nombre}" no tiene cupos. Tu registro quedará en lista de espera.`;
    alertaEl.style.display = 'flex';
    alertaEl.style.background = 'linear-gradient(135deg, #fff3cd, #ffeaa7)';
    alertaEl.style.borderColor = '#ffc63e';
    alertaEl.style.color = '#7a4800';
  } else if (ci.pct >= 80) {
    textoEl.textContent = `¡Solo quedan ${libre} cupos para "${act.nombre}"! Inscribite pronto.`;
    alertaEl.style.display = 'flex';
    alertaEl.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
    alertaEl.style.borderColor = '#4aa147';
    alertaEl.style.color = '#1a5a1a';
  } else {
    alertaEl.style.display = 'none';
  }
}

/** Valida y procesa el envío del formulario de inscripción (RF-FE-04) */
function enviarInscripcion() {
  const nombre  = document.getElementById('inpNombre').value.trim();
  const ident   = document.getElementById('inpIdentificacion').value.trim();
  const correo  = document.getElementById('inpCorreo').value.trim();
  const tel     = document.getElementById('inpTelefono').value.trim();
  const carrera = document.getElementById('inpCarrera').value.trim();
  const actId   = document.getElementById('inpActividad').value;

  // Limpiar errores previos
  ['inpNombre', 'inpIdentificacion', 'inpCorreo', 'inpTelefono', 'inpCarrera', 'inpActividad']
    .forEach(id => document.getElementById(id).classList.remove('is-invalid'));

  const errores = [];
  if (!nombre)  { errores.push('Nombre completo'); document.getElementById('inpNombre').classList.add('is-invalid'); }
  if (!ident)   { errores.push('Identificación'); document.getElementById('inpIdentificacion').classList.add('is-invalid'); }
  if (!correo || !correo.includes('@') || !correo.includes('.')) {
    errores.push('Correo electrónico válido');
    document.getElementById('inpCorreo').classList.add('is-invalid');
  }
  if (!tel)     { errores.push('Teléfono'); document.getElementById('inpTelefono').classList.add('is-invalid'); }
  if (!carrera) { errores.push('Carrera o grupo'); document.getElementById('inpCarrera').classList.add('is-invalid'); }
  if (!actId)   { errores.push('Actividad seleccionada'); document.getElementById('inpActividad').classList.add('is-invalid'); }

  if (errores.length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Campos incompletos',
      html: `Por favor completá:<br><ul style="text-align:left; margin-top:0.5rem;">${errores.map(e => `<li>${e}</li>`).join('')}</ul>`,
      confirmButtonColor: '#006AEA',
      confirmButtonText: 'Entendido'
    });
    return;
  }

  const act = ACTIVIDADES.find(a => a.id == actId);
  const ci  = getCupoInfo(act);

  if (ci.pct >= 100) {
    Swal.fire({
      icon: 'info',
      title: 'Lista de Espera',
      html: `<p>La actividad <strong>"${act.nombre}"</strong> está llena.</p>
             <p style="margin-top:0.75rem;">Tu registro ha sido guardado en la <strong>lista de espera</strong>.
             Serás notificado a <strong>${correo}</strong> si se habilitan cupos.</p>`,
      confirmButtonColor: '#ffc63e',
      confirmButtonText: 'Aceptar'
    });
  } else {
    Swal.fire({
      icon: 'success',
      title: '¡Inscripción Confirmada!',
      html: `<p>¡Hola, <strong>${nombre}</strong>!</p>
             <p style="margin-top:0.5rem;">Tu inscripción en <strong>"${act.nombre}"</strong> ha sido confirmada.</p>
             <p style="margin-top:0.5rem; font-size:0.9rem; color:#666;">
               Se enviará confirmación a <strong>${correo}</strong>
             </p>`,
      confirmButtonColor: '#006AEA',
      confirmButtonText: 'Volver al inicio'
    }).then(r => {
      if (r.isConfirmed) window.location.href = 'inicio.html';
    });

    // Simular incremento de cupo
    act.cupoActual = Math.min(act.cupoActual + 1, act.cupoMax);
    poblarSelectActividades();
  }
}

/* =============================================
   PANEL ADMINISTRADOR — ACCIONES (RF-ADM)
============================================= */

/**
 * Inicia la edición de una actividad (admin).
 * @param {number} id - ID de la actividad
 */
function editarActividad(id) {
  const act = ACTIVIDADES.find(a => a.id === id);
  Swal.fire({
    icon: 'info',
    title: 'Editar Actividad',
    text: `Editando: "${act.nombre}"`,
    confirmButtonColor: '#006AEA'
  });
}

/**
 * Solicita confirmación para cancelar una actividad.
 * @param {number} id - ID de la actividad
 */
function cancelarActividad(id) {
  const act = ACTIVIDADES.find(a => a.id === id);
  Swal.fire({
    icon: 'warning',
    title: 'Cancelar Actividad',
    text: `¿Cancelar "${act.nombre}"?`,
    showCancelButton: true,
    confirmButtonColor: '#d2232a',
    cancelButtonColor: '#7c7b75',
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No'
  }).then(r => {
    if (r.isConfirmed) {
      Swal.fire({ icon: 'success', title: 'Actividad cancelada', confirmButtonColor: '#006AEA' });
    }
  });
}

/**
 * Edita un evento de agenda (admin).
 * @param {string} nombre - Nombre del evento
 */
function editarEvento(nombre) {
  Swal.fire({
    icon: 'info',
    title: 'Editar Evento',
    text: `Editando: "${nombre}"`,
    confirmButtonColor: '#006AEA'
  });
}

/**
 * Abre el modal admin para agregar un evento a la agenda (RF-FE-05.4).
 */
function mostrarFormAgenda() {
  const opcionesCategoria = Object.entries(NOMBRES_CATEGORIA)
    .map(([valor, nombre]) => `<option value="${valor}">${nombre}</option>`).join('');
  const opcionesDias = AGENDA.map(d => `<option>${d.dia}</option>`).join('');

  document.getElementById('modalAdminCuerpo').innerHTML = `
    <div class="mb-3">
      <label class="form-label">Nombre del evento <span class="requerido">*</span></label>
      <input class="form-control" />
    </div>
    <div class="row g-3 mb-3">
      <div class="col-6">
        <label class="form-label">Día <span class="requerido">*</span></label>
        <select class="form-select">${opcionesDias}</select>
      </div>
      <div class="col-6">
        <label class="form-label">Hora <span class="requerido">*</span></label>
        <input type="time" class="form-control" />
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Lugar <span class="requerido">*</span></label>
      <input class="form-control" />
    </div>
    <div class="mb-3">
      <label class="form-label">Categoría</label>
      <select class="form-select"><option value="">Seleccioná...</option>${opcionesCategoria}</select>
    </div>
    <button type="button" class="btn btn-primario w-100 justify-content-center" onclick="guardadoExitoso('modalAdmin')">
      <i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Agregar a Agenda
    </button>`;

  const modalEl = document.getElementById('modalAdmin');
  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

/**
 * Abre el modal admin para registrar una nueva actividad (RF-ADM-02/03).
 */
function mostrarFormActividad() {
  const opcionesCategoria = Object.entries(NOMBRES_CATEGORIA)
    .map(([valor, nombre]) => `<option value="${valor}">${nombre}</option>`).join('');

  document.getElementById('modalAdminCuerpo').innerHTML = `
    <div class="mb-3">
      <label class="form-label">Nombre de la actividad <span class="requerido">*</span></label>
      <input class="form-control" placeholder="Ej: Taller de Fotografía" />
    </div>
    <div class="mb-3">
      <label class="form-label">Categoría <span class="requerido">*</span></label>
      <select class="form-select"><option value="">Seleccioná...</option>${opcionesCategoria}</select>
    </div>
    <div class="row g-3 mb-3">
      <div class="col-6">
        <label class="form-label">Fecha <span class="requerido">*</span></label>
        <input type="date" class="form-control" />
      </div>
      <div class="col-6">
        <label class="form-label">Hora <span class="requerido">*</span></label>
        <input type="time" class="form-control" />
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Lugar <span class="requerido">*</span></label>
      <input class="form-control" placeholder="Ej: Auditorio Principal" />
    </div>
    <div class="mb-3">
      <label class="form-label">Cupos máximos <span class="requerido">*</span></label>
      <input type="number" class="form-control" placeholder="Ej: 30" min="1" />
    </div>
    <div class="mb-3">
      <label class="form-label">Descripción</label>
      <textarea class="form-control" rows="3" placeholder="Descripción de la actividad..."></textarea>
    </div>
    <button type="button" class="btn btn-primario w-100 justify-content-center" onclick="guardadoExitoso('modalAdmin')">
      <i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Guardar Actividad
    </button>`;

  const modalEl = document.getElementById('modalAdmin');
  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

/**
 * Cierra el modal admin indicado y muestra confirmación de guardado.
 * @param {string} modalId - ID del modal a cerrar
 */
function guardadoExitoso(modalId) {
  const modalEl = document.getElementById(modalId);
  bootstrap.Modal.getOrCreateInstance(modalEl).hide();
  Swal.fire({
    icon: 'success',
    title: 'Guardado',
    text: 'El registro fue guardado exitosamente.',
    confirmButtonColor: '#006AEA',
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  });
}

/* =============================================
   INICIALIZACIÓN POR PÁGINA
   Cada página llama solo a las funciones que
   correspondan a sus elementos presentes en el DOM.
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  renderDestacadas();
  renderAgenda();
  poblarSelectActividades();

  // Resaltar el enlace de navegación activo según el archivo actual
  const pagina = window.location.pathname.split('/').pop() || 'inicio.html';
  document.querySelectorAll('.nav-principal .nav-link').forEach(link => {
    if (link.getAttribute('href') === pagina) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
});