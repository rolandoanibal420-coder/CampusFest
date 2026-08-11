/* =============================================
   CAMPUSFEST 2026 — agenda.js
   Página: agenda.html
   Depende de: Campus_Fest_2.js
   Lee actividades desde GET /actividades?todas=true
   Las agrupa por fecha y las renderiza en la tabla
============================================= */

/* =============================================
   CATÁLOGOS
============================================= */
const NOMBRES_CAT_AG = {
  cultural:     'Cultural',
  deportiva:    'Deportiva',
  tecnologica:  'Tecnológica',
  artistica:    'Artística',
  gastronomica: 'Gastronómica',
  recreativa:   'Recreativa'
};

const ICONOS_CAT_AG = {
  cultural:     'fa-masks-theater',
  deportiva:    'fa-futbol',
  tecnologica:  'fa-laptop-code',
  artistica:    'fa-palette',
  gastronomica: 'fa-utensils',
  recreativa:   'fa-gamepad'
};

const CLASES_CAT_AG = {
  cultural:     'tag-cultural',
  deportiva:    'tag-deportiva',
  tecnologica:  'tag-tecnologica',
  artistica:    'tag-artistica',
  gastronomica: 'tag-gastronomica',
  recreativa:   'tag-recreativa'
};

/* =============================================
   CALLBACKS DE SESIÓN
   La agenda muestra lo mismo para admin y
   visitante — solo cambia qué actividades ve:
   Admin     → todas (activas + llenas + canceladas)
   Visitante → activas y llenas (sin canceladas)
============================================= */
function _onSesionAdmin() {
  cargarAgenda(true);    // true = incluir canceladas
}

function _onSesionVisitante() {
  cargarAgenda(false);   // false = solo activas y llenas
}

function _onSesionNula() {
  cargarAgenda(false);
}

/* =============================================
   INICIALIZACIÓN
============================================= */
function initAgenda() {
  // Botón actualizar (admin)
  const btnActualizar = document.getElementById('btnActualizarAgenda');
  if (btnActualizar) {
    btnActualizar.addEventListener('click', () => {
      const esAdmin = typeof getSesion === 'function' &&
                      getSesion() &&
                      typeof esCorreoAdmin === 'function' &&
                      esCorreoAdmin(getSesion().correo);
      cargarAgenda(esAdmin);
    });
  }
}

/* =============================================
   GET /actividades — Carga y agrupa por fecha
   @param {boolean} conCanceladas — true solo admin
============================================= */
async function cargarAgenda(conCanceladas = false) {
  const contenedor = document.getElementById('agendaContenido');
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Cargando agenda desde MongoDB...</p>
    </div>`;

  try {
    // Admin ve todas; visitante solo activas y llenas
    const qs  = conCanceladas ? '?todas=true' : '';
    const res = await fetch(`${API_URL}/actividades${qs}`);
    const data= await res.json();

    if (!res.ok) {
      contenedor.innerHTML = `
        <div class="text-center text-danger py-5">
          <i class="fa-solid fa-triangle-exclamation fa-2x mb-2 d-block"></i>
          Error al cargar la agenda: ${data.msj}
        </div>`;
      return;
    }

    if (data.length === 0) {
      contenedor.innerHTML = `
        <div class="text-center text-muted py-5">
          <i class="fa-regular fa-calendar-xmark fa-2x mb-2 d-block"></i>
          No hay actividades registradas aún.
        </div>`;
      return;
    }

    // Ordenar por fecha y hora
    data.sort((a, b) => {
      const fa = a.fecha + ' ' + a.hora;
      const fb = b.fecha + ' ' + b.hora;
      return fa.localeCompare(fb);
    });

    // Agrupar por fecha
    const grupos = {};
    data.forEach(act => {
      const key = act.fecha || 'Sin fecha';
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(act);
    });

    // Renderizar
    contenedor.innerHTML = Object.entries(grupos)
      .map(([fecha, actividades]) => _renderGrupoFecha(fecha, actividades, conCanceladas))
      .join('');

    // Actualizar contador total en el subtítulo
    const contEl = document.getElementById('contadorAgenda');
    if (contEl) contEl.textContent = data.length;

  } catch {
    contenedor.innerHTML = `
      <div class="text-center text-danger py-5">
        <i class="fa-solid fa-triangle-exclamation fa-2x mb-2 d-block"></i>
        Sin conexión con el servidor.<br>
        <small class="text-muted">Verificá que el backend esté corriendo.</small>
      </div>`;
  }
}

/* =============================================
   Renderiza un grupo de actividades por fecha
============================================= */
function _renderGrupoFecha(fecha, actividades, esAdmin) {
  const filas = actividades.map(a => _renderFilaAgenda(a, esAdmin)).join('');

  return `
    <div class="agenda-grupo-fecha" role="rowgroup"
         aria-label="Eventos del ${fecha}">
      <i class="fa-regular fa-calendar-days" aria-hidden="true"></i>
      ${fecha}
    </div>
    ${filas}`;
}

/* =============================================
   Renderiza una fila de la agenda
============================================= */
function _renderFilaAgenda(a, esAdmin) {
  // Calcular estado visual

  const cupoMax = Number(a.cupoMax) || 0;
  const cupoActual = Number(a.cupoActual) || 0;
  const pct = cupoMax > 0 ? (cupoActual / cupoMax) * 100 : 0;
  const libres = Math.max(0, cupoMax - cupoActual);

  let estadoClase = 'estado-disponible';
  let estadoLabel = 'Disponible';
  let estadoIcono = 'fa-circle-check';

  if (a.estado === 'cancelada') {
    estadoClase = 'estado-cancelado';
    estadoLabel = 'Cancelada';
    estadoIcono = 'fa-circle-xmark';
  } else if (a.estado === 'llena' || pct >= 100) {
    estadoClase = 'estado-lleno';
    estadoLabel = 'Lleno';
    estadoIcono = 'fa-circle-exclamation';
  } else if (pct >= 80) {
    estadoClase = 'estado-lleno';
    estadoLabel = 'Casi lleno';
    estadoIcono = 'fa-circle-exclamation';
  }

  // Cupos: barra de progreso compacta
  const barraClase = a.estado === 'cancelada'
    ? 'cupo-lleno'
    : pct >= 100 ? 'cupo-lleno' : pct >= 80 ? 'cupo-alerta' : 'cupo-ok';

  // Fila con opacidad reducida si está cancelada
  const filaEstilo = a.estado === 'cancelada'
    ? 'opacity:.55; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(210,35,42,0.03) 10px, rgba(210,35,42,0.03) 20px);'
    : '';

  // Botones admin
  const botonesAdmin = esAdmin ? `
    <div class="d-flex gap-1 mt-1">
      <a href="actividades.html"
         class="btn btn-secundario btn-sm"
         style="font-size:.72rem; padding:.2rem .5rem;"
         aria-label="Ir a gestionar ${a.nombre}">
        <i class="fa-solid fa-pen" aria-hidden="true"></i> Gestionar
      </a>
    </div>` : '';

  return `
    <div class="agenda-fila" role="row"
         style="${filaEstilo}"
         aria-label="${a.hora} — ${a.nombre}">

      <!-- Hora -->
      <div class="agenda-hora" aria-label="Hora: ${a.hora}">
        ${a.hora}
      </div>

      <!-- Nombre y lugar -->
      <div>
        <div class="agenda-nombre">${a.nombre}</div>
        <div class="agenda-lugar">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          ${a.lugar}
        </div>
        ${botonesAdmin}
      </div>

      <!-- Categoría -->
      <div>
        <span class="tag ${CLASES_CAT_AG[a.categoria] || ''}"
              style="font-size:.75rem;">
          <i class="fa-solid ${ICONOS_CAT_AG[a.categoria] || 'fa-star'}"
             aria-hidden="true"></i>
          ${NOMBRES_CAT_AG[a.categoria] || a.categoria}
        </span>
      </div>

      <!-- Cupos -->
      <div class="d-flex flex-column gap-1" style="min-width:100px;">
        <div class="cupo-barra"
             aria-label="${a.cupoActual} de ${a.cupoMax} cupos ocupados">
          <div class="cupo-progreso ${barraClase}"
               style="width:${Math.min(pct, 100)}%; height:100%;"></div>
        </div>
        <small style="font-size:.72rem; color:var(--texto-secundario);">
          ${a.estado === 'cancelada'
            ? '—'
            : `${libres} / ${a.cupoMax} disponibles`}
        </small>
      </div>

      <!-- Estado -->
      <div>
        <span class="estado-pill ${estadoClase}">
          <i class="fa-solid ${estadoIcono}" aria-hidden="true"></i>
          ${estadoLabel}
        </span>
      </div>

    </div>`;
}

/* =============================================
   INICIALIZACIÓN — DOMContentLoaded
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initAgenda();
  // Cambia 'false' por 'true' para probar si así aparecen todas las que ya tenías creadas
  cargarAgenda(true); 
});