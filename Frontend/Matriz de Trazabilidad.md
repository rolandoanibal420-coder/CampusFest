### MATRIZ DE TRAZABILIDAD (REQUISITOS VS. JIRA)
Esta tabla vincula cada requerimiento funcional con su respectivo identificador en el sistema de gestión de proyectos Jira para asegurar el cumplimiento del alcance del festival.

| Código RF | Nombre del Requerimiento | Código Jira (Épica / Historia) | Componente Web a Programar |
| :--- | :--- | :--- | :--- |
| **RF-FE-01** | Página de Inicio| `CAMP-01: Épica Home` | `index.html` (Bootstrap Grid + Navbar)|
| **RF-FE-02** | Página de Actividades | `CAMP-02: Épica Catálogo` | `actividades.html` (Bootstrap Cards simuladas)|
| **RF-FE-03** | Detalle de Actividad| `CAMP-03: Épica Detalle` | `detalle.html` (JS: Alerta de cupo / Lista de espera) |
| **RF-FE-04** | Formulario de Inscripción| `CAMP-04: Épica Registro`| `inscripcion.html` (JS: Validación básica de campos vacíos) |
| **RF-FE-05** | Agenda del Festival| `CAMP-05: Épica Agenda`| `agenda.html` (Tabla Bootstrap + Badges de estado) |
| **RF-FE-06** | Página de Stands| `CAMP-06: Épica Stands`| `stands.html` (Tarjetas informativas fijas) |
| **RF-FE-07** | Página de Contacto | `CAMP-07: Épica Contacto` | `contacto.html` (Sección de texto de preguntas frecuentes) |
| **RF-FE-08** | Vista del Administrador | `CAMP-08: Épica Administrador` | `admin.html` (Administras actividades y cupos disponibles) |
| **RF-FE-09** | Control de Cupos | `CAMP-09: Épica Cupos` | `cupos.html` (Control de campos disponibles y lista de espera.) |



### 🗺️ Diseño de Navegación: Mapa de Sitio (Sitemap)

Para la estructura del sistema CampusFest se han modelado dos flujos de navegación independientes según el rol asignado, garantizando que la experiencia pública del visitante y el panel de control del administrador mantengan una jerarquía lógica de tres niveles estrictos (Nodo Raíz ➔ Páginas/Módulos ➔ Componentes/Acciones).

### 📊 Matriz de Trazabilidad (Requerimientos vs. Prototipos)

Esta tabla vincula cada requerimiento funcional con su respectivo identificador en Jira y su correspondiente wireframe o prototipo visual para asegurar el cumplimiento del alcance del festival.

| Código RF | Nombre del Requerimiento | Código Jira (Épica / Historia) | Prototipo / Wireframe de Referencia |
| :--- | :--- | :--- | :--- |
| **RF-FE-01** | Página de Inicio | CAMP-01: Épica Home | `01-InicioVista Visitante - CampusFest (Home) - ` |
| **RF-FE-02** | Página de Actividades | CAMP-02: Épica Catálogo | `02-Actividades Vista Visitante - Catálogo de Actividades` |
| **RF-FE-03** | Detalle de Actividad | CAMP-03: Épica Detalle |`02-Popout Popout al presionar Ver Detalle` |
| **RF-FE-04** | Formulario de Inscripción | CAMP-04: Épica Registro | `05-Inscripcion Vista Visitante - - Formulario de Inscripción` |
| **RF-FE-05** | Agenda del Festival | CAMP-05: Épica Agenda | `03- Agenda Vista Visitante - - Agenda del Festival` |
| **RF-FE-06** | Página de Stands | CAMP-06: Épica Stands | `04- Stand Vista Visitante - Administrador- Stands y Grupos` |
| **RF-FE-07** | Página de Contacto | CAMP-07: Épica Contacto | `06- Contacto Vista Visitante - Contacto` |
| **RF-FE-08** | Vista del Administrador | CAMP-08: Épica Administrador | `01 al 06 Vista Administrador - Dashboard / Catálogo` |
| **RF-FE-09** | Control de Cupos | CAMP-09: Épica Cupos | `05- Vista Administrador - Inscripciones (Métricas y Tabla)` |