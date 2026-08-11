# ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE (ERS)
## Proyecto: Sistema Web para Gestión del Festival Estudiantil CampusFest

---

### 1. INTRODUCCIÓN Y DESCRIPCIÓN GENERAL
El sistema CampusFest proveerá una solución web integral full-stack para mitigar los problemas de la gestión manual del festival anual (inscripciones duplicadas, cupos excedidos y desorganización de la agenda.)
Centralizará la información para usuarios visitantes y administradores

---

### 2. REQUISITOS DE DISEÑO E IMPLEMENTACIÓN (RESTRICCIONES)
**Tecnologías Obligatorias (Etapa 1):** HTML5, CSS3, JavaScript Vanilla y Framework Bootstrap.
**Diseño Responsivo:** Menú horizontal y distribución multi-columna en escritorio; menú colapsable y tarjetas en una sola columna en móviles.
**Control de Estilos y Interfaz:**
**Libro de Marca:** Uso estricto de la paleta de colores y tipografía oficial de la Universidad CENFOTEC.
**Modo Oscuro/Claro:** Implementación obligatoria mediante Media Queries propias configuradas para adaptarse automáticamente según las preferencias del sistema operativo del usuario.
**Accesibilidad Web:**
    * Inclusión visual para personas con baja visión, ceguera y daltonismo.
    * Uso de elementos iconográficos claros en la interfaz para la correcta comprensión de personas sordas.

---

### 3. ESPECIFICACIÓN DE REQUISITOS FUNCIONALES (ETAPA 1)

#### RF-FE-01: Página de Inicio (Home)
* **Descripción:** La página principal del sitio web debe servir como la ventana de presentación del festival estudiantil.
* **Elementos obligatorios en pantalla:**
    1. Nombre oficial del festival ("CampusFest").
    2. Descripción breve del evento y fecha general de realización.
    3. Ubicación o lugar principal de las actividades.
    4. Sección destacada en cuadrícula (grid) que muestre de forma visual las **3 actividades principales** del festival.
    5. Elementos de navegación interactivos: Un botón/enlace directo hacia el catálogo de actividades y un botón/enlace directo al formulario de inscripción.

#### RF-FE-02: Página de Actividades (Catálogo Visual)
* **Descripción:** Interfaz que despliega de forma dinámica y visual la totalidad de los eventos disponibles organizados mediante tarjetas (cards).
* **Estructura de cada Tarjeta (Card):**
    * Nombre de la actividad y Categoría (Cultural, Deportiva, Tecnológica, Artística, Gastronómica o Recreativa).
    * Fecha, hora y lugar específico donde se llevará a cabo.
    * Indicador visual de cupo disponible simulado.
    * Botón interactivo de "Ver detalle" que redirija a la ficha técnica de la actividad.

#### RF-FE-03: Página de Detalle de Actividad
* **Descripción:** Vista detallada de una actividad específica seleccionada por el usuario visitante.
* **Información en pantalla:**
    * Nombre de la actividad, descripción completa y categoría correspondiente.
    * Fecha, hora exacta y lugar asignado.
    * Requisitos de participación particulares de la actividad.
    * Cupo máximo total (definido previamente por el administrador).
    * **Lógica de Cupos y Lista de Espera:** El sistema debe evaluar el cupo simulado. Si hay disponibilidad, se muestra un botón para proceder a la inscripción. Si el cupo está en 0, el sistema debe lanzar una **alerta visual** de disponibilidad agotada y cambiar el comportamiento del botón para permitir un registro bajo la condición de **"Lista de espera"** para posterior confirmación.




### 4. REQUISITOS NO FUNCIONALES (RNF)

#### RNF-01: Usabilidad y Accesibilidad (Inclusión)
* **Descripción:** La interfaz debe ser inclusiva y fácil de usar para toda la comunidad estudiantil.
* **Criterios simples:** * El diseño debe usar combinaciones de colores con alto contraste aptas para personas con daltonismo y baja visión.
    * Todas las imágenes, iconos y botones interactivos deben incluir etiquetas de texto alternativo (`alt`) legibles para lectores de pantalla (para personas ciegas).
    * Se deben incorporar iconos claros junto al texto en los menús y alertas para facilitar la comprensión de personas sordas.

#### RNF-02: Restricción de Diseño (Imagen Institucional)
* **Descripción:** El sitio web debe respetar la identidad visual de la institución.
* **Criterios simples:** Se debe aplicar estrictamente la paleta de colores oficiales y las tipografías establecidas en el **Libro de Marca institucional** provisto por el cliente.

#### RNF-03: Adaptabilidad de la Interfaz (Modo Oscuro)
* **Descripción:** El sistema debe mitigar el cansancio visual del usuario de forma inteligente.
* **Criterios simples:** La aplicación no usará botones manuales; debe cambiar entre el tema claro y oscuro de forma **100% automática**, detectando las preferencias del sistema operativo del usuario mediante *Media Queries* nativas de CSS (`@media (prefers-color-scheme: dark)`).

#### RNF-04: Compatibilidad y Capacidad de Respuesta (Responsive)
* **Descripción:** El sitio debe ser accesible desde cualquier dispositivo común.
* **Criterios simples:** El diseño debe ser responsivo utilizando los componentes nativos de **Bootstrap**, asegurando que la navegación y las tarjetas se adapten correctamente tanto en pantallas de escritorio como en teléfonos celulares.



### 5. MATRIZ DE TRAZABILIDAD (REQUISITOS VS. JIRA)
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

### Diagrama de arquitectura (capas):
El diagrama de capas describe el flujo: el cliente (Vista) envía peticiones Fetch en formato JSON al servidor (Controlador), el cual aplica las reglas de negocio y se comunica con la base de datos (Modelo) mediante Mongoose.

Se implementará una arquitectura cliente-servidor de tres capas, siguiendo el patrón Modelo‑Vista‑Controlador (MVC) para asegurar la separación de responsabilidades:
Capa de presentación (Vista): interfaces HTML5, CSS y JavaScript del lado del cliente, construidas con Bootstrap 5 para garantizar un diseño responsive y accesible. Incluye las páginas de inicio, catálogo de actividades, detalle de actividad, formulario de inscripción, agenda, stands, contacto, y las pantallas de administración (gestión de actividades, stands, participantes y resultados).
Capa de controlador (Controlador): implementada en Node.js, gestiona las peticiones HTTP, orquesta las validaciones, aplica las reglas de negocio (inscripción hasta 36 horas antes del evento, control de cupos, lista de espera, asignación de rol admin/visitante por dominio de correo institucional) y comunica los modelos con las vistas mediante respuestas JSON.
Capa de datos (Modelo): gestiona la persistencia utilizando MongoDB Atlas como base de datos. Los modelos, definidos con Mongoose, representan las entidades Actividad, Usuario, Inscripción, Stand,  y Contacto.


### Patrones arquitectónicos empleados. 
Cliente-servidor: separación entre el frontend (cliente, en el navegador) y el backend (servidor Node.js), comunicados mediante peticiones HTTP.
MVC (Modelo-Vista-Controlador): separa la interfaz (Vista), la lógica de negocio (Controlador) y el acceso a datos (Modelo), facilitando el mantenimiento y las pruebas independientes de cada capa.
API RESTful: el controlador expone recursos (actividades, inscripciones, stands, usuarios y consultas) mediante rutas HTTP estándar (GET, POST, PUT, DELETE) que devuelven JSON, permitiendo que el cliente sea completamente independiente del servidor.
Repositorio / ODM (Mongoose): los modelos actúan como una capa de abstracción entre la lógica de negocio y MongoDB Atlas, encapsulando las operaciones de acceso a datos (consultas, creación, actualización).

### Comunicación cliente-servidor con Fetch API
La comunicación entre el cliente y el servidor se realizará mediante peticiones Fetch a una API RESTful que retornará datos en formato JSON, permitiendo una experiencia dinámica sin recargas completas de página.
En CampusFest, realiza cada operación  por una petición Fetch hacia un endpoint del backend. Cada endpoint corresponde a un recurso del modelo (actividades, inscripciones, stands, usuarios).




Por qué es obligatorio usar Fetch
Fetch reemplaza la recarga completa de página (como ocurría con formularios HTML tradicionales) por peticiones asíncronas: el navegador envía la petición, espera la respuesta JSON del servidor Express, y actualiza solo la parte de la página que corresponde (por ejemplo, la lista de actividades o un mensaje de SweetAlert2), sin refrescar todo el documento. Esto es lo que permite que CampusFest se sienta como una aplicación dinámica, aun siendo un conjunto de páginas HTML servidas de forma tradicional.

### Estructura del Sistema
Para garantizar un desarrollo ordenado y modular, se adoptó una arquitectura basada en el patrón Modelo-Vista-Controlador (MVC). Esta estructura facilita la separación de responsabilidades y la mantenibilidad del código a largo plazo:
/controllers: Gestiona la lógica de negocio y las respuestas del sistema.
/models: Define la estructura de datos para nuestra base de datos MongoDB.
/routes: Configura las rutas (endpoints) que exponen la API hacia el frontend.
server.js: Actúa como el núcleo del sistema, inicializando el servidor y configurando la conexión a la base de datos.
.env: Asegura que las credenciales y configuraciones sensibles se manejen fuera del código fuente, cumpliendo con estándares de seguridad.

### API REST y Matriz de Trazabilidad
Como parte de la gestión técnica, se diseñó una API RESTful que permite la comunicación asíncrona entre los componentes. A continuación, se presenta la matriz de trazabilidad que vincula los requerimientos funcionales del cliente con nuestra implementación técnica.
Nota técnica sobre los métodos utilizados:
GET: Implementado para las funciones de consulta y visualización de datos (como el catálogo de actividades), garantizando una experiencia de usuario rápida y eficiente.
POST: Implementado para el envío y almacenamiento de nuevos datos en la base de datos (como el formulario de inscripciones), asegurando la integridad de la información recibida desde el cliente.

### Seguridad y Tecnologías Utilizadas
La seguridad del sistema se abordó mediante la implementación de prácticas robustas de desarrollo:
### Manejo de Errores: Se integró control de excepciones para prevenir fallos críticos y evitar la exposición de información interna del servidor hacia el usuario final.
### Tecnologías: El sistema se apoya en Node.js por su alto rendimiento y escalabilidad, junto con MongoDB como base de datos NoSQL, lo cual permite gestionar la naturaleza dinámica de los datos del CampusFest de forma nativa en formato JSON.

### Inconvenientes y Soluciones
Durante el desarrollo de esta fase, se presentaron desafíos técnicos que fueron resueltos exitosamente para asegurar la continuidad del proyecto:
Gestión de variables de entorno: Se presentaron errores al intentar acceder a los parámetros de conexión. Solución: Se implementó dotenv para centralizar la configuración, lo que permitió una conexión segura y estable a la base de datos.
Configuración de rutas: Se detectaron conflictos en la importación de archivos. Solución: Se estandarizó la nomenclatura y la jerarquía de directorios, facilitando la escalabilidad del sistema ante futuros requerimientos.

Bitacora #4

### 6. MATRIZ DE TRAZABILIDAD (REQUISITOS VS. JIRA)


| Código RF | Nombre del Requerimiento | Código Jira (Épica / Historia) | Componente Web a Programar |
| :--- | :--- | :--- | :--- |
| **RF-FE-01** | Página de Inicio | `CAMP-01: Épica Home` | `index.html` (Bootstrap Grid + Navbar) |
| **RF-FE-02** | Página de Actividades | `CAMP-02: Épica Catálogo` | `actividades.html` (Bootstrap Cards simuladas) |
| **RF-FE-03** | Detalle de Actividad | `CAMP-03: Épica Detalle` | `detalle.html` (JS: Alerta de cupo / Lista de espera) |
| **RF-FE-04** | Formulario de Inscripción | `CAMP-04: Épica Registro` | `inscripcion.html` (JS: Validación básica de campos vacíos) |
| **RF-FE-05** | Agenda del Festival | `CAMP-05: Épica Agenda` | `agenda.html` (Tabla Bootstrap + Badges de estado) |
| **RF-FE-06** | Página de Stands | `CAMP-06: Épica Stands` | `stands.html` (Tarjetas informativas fijas) |
| **RF-FE-07** | Página de Contacto | `CAMP-07: Épica Contacto` | `contacto.html` (Sección de texto de preguntas frecuentes) |
| **RF-FE-08** | Vista del Administrador | `CAMP-08: Épica Administrador` | `admin.html` (Administras actividades y cupos disponibles) |
| **RF-FE-09** | Control de Cupos | `CAMP-09: Épica Cupos` | `cupos.html` (Control de campos disponibles y lista de espera) |