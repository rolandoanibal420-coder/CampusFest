document.addEventListener("DOMContentLoaded", () => {
    cargarActividadesCatalogo();

    const btnAgregar = document.querySelector('button.btn-acento');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', mostrarFormActividad);
    }
});

// Función para obtener las actividades del backend y pintarlas en el catálogo
async function cargarActividadesCatalogo() {
    try {
        const response = await fetch('http://localhost:3000/api/actividades');
        const actividades = await response.json();

        const contenedor = document.getElementById('contenedorCatálogo');
        if (!contenedor) return;

        contenedor.innerHTML = '';

        actividades.forEach(act => {
            let claseTag = 'tag-tecnologica';
            let iconoCat = 'fa-laptop-code';
            
            if (act.categoria === 'gastronomica') { claseTag = 'tag-gastronomica'; iconoCat = 'fa-utensils'; }
            else if (act.categoria === 'deportiva') { claseTag = 'tag-deportiva'; iconoCat = 'fa-futbol'; }
            else if (act.categoria === 'artistica') { claseTag = 'tag-artistica'; iconoCat = 'fa-palette'; }
            else if (act.categoria === 'cultural') { claseTag = 'tag-cultural'; iconoCat = 'fa-masks-theater'; }

            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <article class="tarjeta">
                    <div class="tarjeta-imagen">
                        <i class="fa-solid ${iconoCat}" aria-hidden="true"></i>
                    </div>
                    <div class="tarjeta-cuerpo">
                        <span class="tag ${claseTag}"><i class="fa-solid ${iconoCat}"></i> ${act.categoria.charAt(0).toUpperCase() + act.categoria.slice(1)}</span>
                        <h2 class="tarjeta-titulo">${act.nombre}</h2>
                        
                        <div class="tarjeta-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${act.fecha || 'Por definir'}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${act.lugar || 'Por definir'}</span>
                        </div>

                        <p class="mt-2 text-muted" style="font-size: 0.9rem;">${act.descripcion || 'Sin descripción'}</p>

                        <div class="cupo-barra" aria-label="Progreso de cupos">
                            <div class="cupo-progreso cupo-ok" style="width: ${Math.round(((act.cupoActual || 0) / (act.cupoMax || 30)) * 100)}%;"></div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="estado-pill estado-disponible">${act.estado || 'Disponible'}</span>
                            <button class="btn btn-primario btn-sm btn-detalle" data-id="${act._id}">Ver Detalle</button>
                        </div>
                    </div>
                </article>
            `;
            
            const btnDetalle = col.querySelector('.btn-detalle');
            btnDetalle.addEventListener('click', () => mostrarDetalleActividad(act));

            contenedor.appendChild(col);
        });

    } catch (error) {
        console.error("Error al cargar el catálogo de actividades:", error);
    }
}

async function mostrarDetalleActividad(act) {
    // 1. Determinamos si es Admin (Ajusta la lógica de cómo detectas que es Admin)
    const esAdmin = document.body.classList.contains('modo-admin') || localStorage.getItem('modoAdmin') === 'true';

    let htmlContenido = `
        <div style="text-align: left; color: #cbd5e1; font-size: 0.95rem; display: flex; flex-direction: column; gap: 8px;">
            <p><strong>Categoría:</strong> ${act.categoria.toUpperCase()}</p>
            <p><strong>Fecha:</strong> ${act.fecha || 'N/A'} — ${act.hora || ''}</p>
            <p><strong>Lugar:</strong> ${act.lugar || 'Lugar por definir'}</p>
            <p><strong>Cupos Máximos:</strong> ${act.cupoMax || 30}</p>
            <p><strong>Descripción:</strong> ${act.descripcion || 'Sin descripción disponible.'}</p>
        </div>
    `;

    // 2. Configuración base que siempre se muestra
    let config = {
        title: `<span style="color: #fff;">${act.nombre}</span>`,
        html: htmlContenido,
        showCloseButton: true,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#475569',
        background: '#1e293b',
        color: '#fff'
    };

    // 3. Si es Admin, agregamos los botones de editar/eliminar al objeto config
    if (esAdmin) {
        config.showDenyButton = true;
        config.showCancelButton = true;
        config.denyButtonText = '✏️ Editar';
        config.cancelButtonText = '🗑️ Eliminar';
        config.denyButtonColor = '#2563eb';
        config.cancelButtonColor = '#dc2626';
    }

    // 4. Lanzamos la alerta
    const resultado = await Swal.fire(config);

    // 5. Lógica de acciones (solo si es admin)
    if (esAdmin) {
        if (resultado.isDenied) {
            abrirModalEdicion(act);
        } else if (resultado.dismiss === Swal.DismissReason.cancel) {
            eliminarActividad(act._id);
        }
    }
}

// Función real para ELIMINAR en la base de datos
async function eliminarActividad(id) {
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: "La actividad se eliminará permanentemente de la base de datos.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#475569'
    });

    if (confirmacion.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:3000/api/actividades/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'La actividad ha sido borrada con éxito.',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#fff'
                }).then(() => location.reload());
            } else {
                Swal.fire({ title: 'Error', text: 'No se pudo eliminar la actividad en el servidor.', icon: 'error', background: '#1e293b', color: '#fff' });
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            Swal.fire({ title: 'Error', text: 'Error de conexión con el backend.', icon: 'error', background: '#1e293b', color: '#fff' });
        }
    }
}

// Función real para EDITAR una actividad (precarga los datos en el formulario)
async function abrirModalEdicion(act) {
    const { value: formValues } = await Swal.fire({
        title: '<span style="color: #fff;">Editar Actividad</span>',
        html:
            '<div style="text-align: left; display: flex; flex-direction: column; gap: 12px;">' +
                '<div>' +
                    '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Nombre *</label>' +
                    '<input id="edit-nombre" class="swal2-input" value="' + (act.nombre || '') + '" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                '</div>' +
                '<div style="display: flex; gap: 10px;">' +
                    '<div style="flex: 1;">' +
                        '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Fecha *</label>' +
                        '<input id="edit-fecha" type="date" class="swal2-input" value="' + (act.fecha || '') + '" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                    '</div>' +
                    '<div style="flex: 1;">' +
                        '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Hora</label>' +
                        '<input id="edit-hora" type="time" class="swal2-input" value="' + (act.hora || '') + '" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Lugar *</label>' +
                    '<input id="edit-lugar" class="swal2-input" value="' + (act.lugar || '') + '" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                '</div>' +
                '<div>' +
                    '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Categoría *</label>' +
                    '<select id="edit-categoria" class="swal2-input" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                        '<option value="tecnologica" ' + (act.categoria === 'tecnologica' ? 'selected' : '') + '>Tecnológica</option>' +
                        '<option value="gastronomica" ' + (act.categoria === 'gastronomica' ? 'selected' : '') + '>Gastronómica</option>' +
                        '<option value="artistica" ' + (act.categoria === 'artistica' ? 'selected' : '') + '>Artística</option>' +
                        '<option value="deportiva" ' + (act.categoria === 'deportiva' ? 'selected' : '') + '>Deportiva</option>' +
                        '<option value="cultural" ' + (act.categoria === 'cultural' ? 'selected' : '') + '>Cultural</option>' +
                    '</select>' +
                '</div>' +
                '<div>' +
                    '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Cupo Máximo</label>' +
                    '<input id="edit-cupoMax" type="number" class="swal2-input" value="' + (act.cupoMax || 30) + '" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                '</div>' +
                '<div>' +
                    '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Descripción</label>' +
                    '<input id="edit-descripcion" class="swal2-input" value="' + (act.descripcion || '') + '" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                '</div>' +
            '</div>',
        background: '#1e293b',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#475569',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar Cambios',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                nombre: document.getElementById('edit-nombre').value,
                fecha: document.getElementById('edit-fecha').value,
                hora: document.getElementById('edit-hora').value,
                lugar: document.getElementById('edit-lugar').value,
                categoria: document.getElementById('edit-categoria').value,
                cupoMax: parseInt(document.getElementById('edit-cupoMax').value) || 30,
                descripcion: document.getElementById('edit-descripcion').value
            }
        }
    });

    if (formValues) {
        try {
            const response = await fetch(`http://localhost:3000/api/actividades/${act._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'La actividad se modificó correctamente.',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#fff'
                }).then(() => location.reload());
            } else {
                Swal.fire({ title: 'Error', text: 'No se pudo actualizar la actividad.', icon: 'error', background: '#1e293b', color: '#fff' });
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            Swal.fire({ title: 'Error', text: 'Error de conexión con el servidor.', icon: 'error', background: '#1e293b', color: '#fff' });
        }
    }
}

// Función para mostrar el formulario de agregar actividad (mantenida intacta)
async function mostrarFormActividad() {
    const { value: formValues } = await Swal.fire({
        title: '<span style="color: #fff; font-family: var(--font-titulo, sans-serif);">Agregar Nueva Actividad</span>',
        html:
            '<div style="text-align: left; display: flex; flex-direction: column; gap: 12px;">' +
                '<div>' +
                    '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Nombre de la actividad *</label>' +
                    '<input id="swal-nombre" class="swal2-input" placeholder="Ej: Hackathon de IA" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                '</div>' +
                '<div style="display: flex; gap: 10px;">' +
                    '<div style="flex: 1;">' +
                        '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Fecha *</label>' +
                        '<input id="swal-fecha" type="date" class="swal2-input" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                    '</div>' +
                    '<div style="flex: 1;">' +
                        '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Hora</label>' +
                        '<input id="swal-hora" type="time" class="swal2-input" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Lugar *</label>' +
                    '<input id="swal-lugar" class="swal2-input" placeholder="Ej: Laboratorio 4" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                '</div>' +
                '<div>' +
                    '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Categoría *</label>' +
                    '<select id="swal-categoria" class="swal2-input" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                        '<option value="" disabled selected>— Seleccioná una categoría —</option>' +
                        '<option value="tecnologica">Tecnológica</option>' +
                        '<option value="gastronomica">Gastronómica</option>' +
                        '<option value="artistica">Artística</option>' +
                        '<option value="deportiva">Deportiva</option>' +
                        '<option value="cultural">Cultural</option>' +
                    '</select>' +
                '</div>' +
                '<div>' +
                    '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Cupo Máximo</label>' +
                    '<input id="swal-cupoMax" type="number" class="swal2-input" placeholder="30" style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                '</div>' +
                '<div>' +
                    '<label style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 4px; display: block;">Descripción breve</label>' +
                    '<input id="swal-descripcion" class="swal2-input" placeholder="Detalles de la actividad..." style="margin: 0; width: 100%; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 8px;">' +
                '</div>' +
            '</div>',
        background: '#1e293b',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#475569',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar Actividad',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const categoria = document.getElementById('swal-categoria').value;
            if (!categoria) {
                Swal.showValidationMessage('Por favor selecciona una categoría');
                return false;
            }
            return {
                nombre: document.getElementById('swal-nombre').value,
                fecha: document.getElementById('swal-fecha').value,
                hora: document.getElementById('swal-hora').value,
                lugar: document.getElementById('swal-lugar').value,
                categoria: categoria,
                cupoMax: parseInt(document.getElementById('swal-cupoMax').value) || 30,
                cupoActual: 0,
                estado: "disponible",
                descripcion: document.getElementById('swal-descripcion').value
            }
        }
    });

    if (formValues) {
        if (!formValues.nombre || !formValues.fecha || !formValues.lugar) {
            Swal.fire({ title: 'Error', text: 'Completa al menos nombre, fecha y lugar.', icon: 'error', background: '#1e293b', color: '#fff' });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/actividades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            });

            if (response.ok) {
                Swal.fire({ title: '¡Éxito!', text: 'Actividad creada correctamente.', icon: 'success', background: '#1e293b', color: '#fff' })
                    .then(() => location.reload());
            } else {
                Swal.fire({ title: 'Error', text: 'No se pudo guardar la actividad.', icon: 'error', background: '#1e293b', color: '#fff' });
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            Swal.fire({ title: 'Error', text: 'No se pudo conectar con el servidor.', icon: 'error', background: '#1e293b', color: '#fff' });
        }
    }
}