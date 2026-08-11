document.addEventListener("DOMContentLoaded", () => {
    const btnAgregar = document.querySelector('button.btn-acento');
    
    if (btnAgregar) {
        btnAgregar.addEventListener('click', mostrarFormActividad);
        console.log("Botón de agregar actividad vinculado correctamente.");
    } else {
        console.error("No se encontró el botón de agregar actividad.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar las actividades desde la API al abrir la página
    cargarActividadesCatalogo();

    // 2. Vincular el botón de agregar
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

        // Limpiamos el contenedor por si tiene elementos estáticos de ejemplo
        contenedor.innerHTML = '';

        actividades.forEach(act => {
            // Determinamos la clase del tag según la categoría
            let claseTag = 'tag-tecnologica';
            let iconoCat = 'fa-laptop-code';
            
            if (act.categoria === 'gastronomica') { claseTag = 'tag-gastronomica'; iconoCat = 'fa-utensils'; }
            else if (act.categoria === 'deportiva') { claseTag = 'tag-deportiva'; iconoCat = 'fa-futbol'; }
            else if (act.categoria === 'artistica') { claseTag = 'tag-artistica'; iconoCat = 'fa-palette'; }
            else if (act.categoria === 'cultural') { claseTag = 'tag-cultural'; iconoCat = 'fa-masks-theater'; }

            // Creamos la tarjeta dinámicamente con los datos de MongoDB
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
                            <span><i class="fa-regular fa-calendar"></i> ${act.fecha}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${act.lugar}</span>
                        </div>

                        <p class="mt-2 text-muted" style="font-size: 0.9rem;">${act.descripcion || ''}</p>

                        <div class="cupo-barra" aria-label="Progreso de cupos">
                            <div class="cupo-progreso cupo-ok" style="width: ${Math.round((act.cupoActual / act.cupoMax) * 100)}%;"></div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="estado-pill estado-disponible">${act.estado || 'Disponible'}</span>
                            <button class="btn btn-primario btn-sm">Ver Detalle</button>
                        </div>
                    </div>
                </article>
            `;
            contenedor.appendChild(col);
        });

    } catch (error) {
        console.error("Error al cargar el catálogo de actividades:", error);
    }
}

// Función que despliega el formulario con SweetAlert2 (la que ya te funciona)
async function mostrarFormActividad() {
    const { value: formValues } = await Swal.fire({
        title: 'Agregar Nueva Actividad',
        html:
            '<input id="swal-nombre" class="swal2-input" placeholder="Nombre de la actividad">' +
            '<input id="swal-fecha" type="date" class="swal2-input">' +
            '<input id="swal-hora" type="time" class="swal2-input">' +
            '<input id="swal-lugar" class="swal2-input" placeholder="Lugar">' +
            '<select id="swal-categoria" class="swal2-input">' +
                '<option value="tecnologica">Tecnológica</option>' +
                '<option value="gastronomica">Gastronómica</option>' +
                '<option value="artistica">Artística</option>' +
                '<option value="deportiva">Deportiva</option>' +
                '<option value="cultural">Cultural</option>' +
            '</select>' +
            '<input id="swal-cupoMax" type="number" class="swal2-input" placeholder="Cupo Máximo">' +
            '<input id="swal-descripcion" class="swal2-input" placeholder="Descripción breve">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar Actividad',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                nombre: document.getElementById('swal-nombre').value,
                fecha: document.getElementById('swal-fecha').value,
                hora: document.getElementById('swal-hora').value,
                lugar: document.getElementById('swal-lugar').value,
                categoria: document.getElementById('swal-categoria').value,
                cupoMax: parseInt(document.getElementById('swal-cupoMax').value) || 30,
                cupoActual: 0,
                estado: "disponible",
                descripcion: document.getElementById('swal-descripcion').value
            }
        }
    });

    if (formValues) {
        if (!formValues.nombre || !formValues.fecha || !formValues.lugar) {
            Swal.fire('Error', 'Por favor completa al menos el nombre, fecha y lugar.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/actividades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            });

            if (response.ok) {
                Swal.fire('¡Éxito!', 'La actividad ha sido creada correctamente.', 'success')
                    .then(() => location.reload());
            } else {
                Swal.fire('Error', 'No se pudo guardar la actividad en el servidor.', 'error');
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            Swal.fire('Error', 'No se pudo conectar con el servidor backend.', 'error');
        }
    }
}
// Función que despliega el formulario con SweetAlert2
async function mostrarFormActividad() {
    const { value: formValues } = await Swal.fire({
        title: 'Agregar Nueva Actividad',
        html:
            '<input id="swal-nombre" class="swal2-input" placeholder="Nombre de la actividad">' +
            '<input id="swal-fecha" type="date" class="swal2-input">' +
            '<input id="swal-hora" type="time" class="swal2-input">' +
            '<input id="swal-lugar" class="swal2-input" placeholder="Lugar">' +
            '<select id="swal-categoria" class="swal2-input">' +
                '<option value="tecnologica">Tecnológica</option>' +
                '<option value="gastronomica">Gastronómica</option>' +
                '<option value="artistica">Artística</option>' +
                '<option value="deportiva">Deportiva</option>' +
                '<option value="cultural">Cultural</option>' +
            '</select>' +
            '<input id="swal-cupoMax" type="number" class="swal2-input" placeholder="Cupo Máximo">' +
            '<input id="swal-descripcion" class="swal2-input" placeholder="Descripción breve">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar Actividad',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                nombre: document.getElementById('swal-nombre').value,
                fecha: document.getElementById('swal-fecha').value,
                hora: document.getElementById('swal-hora').value,
                lugar: document.getElementById('swal-lugar').value,
                categoria: document.getElementById('swal-categoria').value,
                cupoMax: parseInt(document.getElementById('swal-cupoMax').value) || 30,
                cupoActual: 0,
                estado: "disponible",
                descripcion: document.getElementById('swal-descripcion').value
            }
        }
    });

    if (formValues) {
        if (!formValues.nombre || !formValues.fecha || !formValues.lugar) {
            Swal.fire('Error', 'Por favor completa al menos el nombre, fecha y lugar.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/actividades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            });

            if (response.ok) {
                Swal.fire('¡Éxito!', 'La actividad ha sido creada correctamente.', 'success')
                    .then(() => location.reload());
            } else {
                Swal.fire('Error', 'No se pudo guardar la actividad en el servidor.', 'error');
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            Swal.fire('Error', 'No se pudo conectar con el servidor backend.', 'error');
        }
    }
}