Propósito y Alcance del Sistema 
El sistema CampusFest tiene como objetivo facilitar la organización y administración del festival estudiantil de la Universidad Cenfotec mediante una plataforma web. Permitirá a los visitantes consultar actividades, revisar la agenda, conocer los stands participantes e inscribirse en los eventos disponibles.
Además, los administradores podrán gestionar actividades, controlar cupos, administrar inscripciones y actualizar la información del festival desde una vista especial de administración.
El proyecto se desarrollará en dos etapas:
Etapa 1: Desarrollo de la interfaz gráfica utilizando HTML, CSS, JavaScript y Bootstrap.
Etapa 2: Implementación del backend con Node.js, Express y MongoDB para almacenar y gestionar la información de forma permanente.
Arquitectura y Tecnologías
El sistema utilizará una arquitectura MVC (Modelo - Vista - Controlador) para separar la interfaz, la lógica de negocio y los datos.
Vista: Páginas web desarrolladas con HTML, CSS, JavaScript y Bootstrap.
Controlador: Gestionará las validaciones y reglas del sistema mediante Node.js y Express.
Modelo: Administrará los datos utilizando MongoDB Atlas.
Base de Datos
Se utilizará MongoDB Atlas para almacenar la información del sistema, incluyendo:
Actividades del festival.
Participantes.
Inscripciones.
Stands o grupos participantes.
Administradores.
Listas de espera.





Tecnologías Utilizadas

Componente
Tecnología
Frontend
HTML5, CSS3, JavaScript, Bootstrap
Backend
Node.js, Express.js
Base de Datos
MongoDB Atlas
Control de Versiones
Git y GitHub
Validaciones
SweetAlert2
Comunicación
Fetch API


Consideraciones Generales
El sitio será responsivo y compatible con dispositivos móviles y computadoras.
Contará con modo oscuro automático.
Cumplirá con criterios básicos de accesibilidad.
Permitirá gestionar actividades, inscripciones, cupos y stands desde una vista de administrador.
Modelado del sistema
Descripción de la Interfaz de Usuario (UI/UX) y Casos de Uso
El modelado del sistema se dividió estructuralmente en dos experiencias de usuario diferenciadas para garantizar la seguridad y la usabilidad de la plataforma:
PDF
Flujo del Visitante: Orientado al consumo ágil de información, permitiendo una navegación lineal y fluida desde el catálogo de actividades y la agenda cronológica hacia el formulario de inscripción. Las interfaces están diseñadas bajo componentes limpios de Bootstrap para asegurar la adaptabilidad móvil.


Flujo del Administrador: Diseñado como un panel de control privado (Dashboard). Habilita secciones operativas superiores encima de la interfaz pública, permitiendo al staff visualizar métricas en tiempo real (inscritos totales, espacios disponibles), interactuar con la lista de espera mediante botones de acción directa y dar mantenimiento a los stands.








https://app.diagrams.net/#G1n_cXR4icfdyCHkwA767zY0WKTB-fLXgK#%7B%22pageId%22%3A%22z81bHEHJnpp5W-CVwQFg%22%7D











Interfaz de usuario(enlaces que solo esten en el mimo repositorio.
https://drive.google.com/file/d/1fLqPxUxJGmLtHwFsuEaZOTyL9mRLzA1A/view?usp=drive_link







Guía de Estilos

Elemento
Especificación
Colores
#164A98, #006AEA, #9CC8FF (primarios) y #FFF200, #FFC63E (acentos)
Tipografía
Barlow Condensed Bold para títulos y Nunito para texto general
Componentes
Navbar, tarjetas, formularios, botones, dropdowns y alertas SweetAlert2
Diseño
Responsive y compatible con modo oscuro


Restricciones de Usabilidad y Accesibilidad
Navegación simple e intuitiva.
Diseño adaptable a computadoras, tabletas y móviles.
Cumplimiento de WCAG 2.1 Nivel AA.
Uso de atributos aria-label y textos alternativos (alt) en imágenes.
Contraste mínimo de 4.5:1 entre texto y fondo.
Navegación completa mediante teclado.
Compatibilidad con modo oscuro automático.



 Diseño de navegación 
Mapa de sitio











Jira



Matriz de trazabilidad 

📊 Matriz de Trazabilidad Actualizada (Relación con Prototipos)
Código RF
Nombre del Requerimiento
Código Jira Asociado
Prototipo / Wireframe de Referencia (drawio)
https://drive.google.com/file/d/1fLqPxUxJGmLtHwFsuEaZOTyL9mRLzA1A/view?usp=drive_link


RF-FE-01
Página de Inicio
CAMP-01
01-Inicio
Vista Visitante - 
CampusFest (Home) - 
RF-FE-02
Página de Actividades
CAMP-02
02-Actividades
Vista Visitante - Catálogo de Actividades
RF-FE-03
Detalle de Actividad
CAMP-03
02-Popout
Popout al presionar Ver Detalle
RF-FE-04
Formulario de Inscripción
CAMP-04
05-Inscripcion
Vista Visitante - - Formulario de Inscripción
RF-FE-05
Agenda del Festival
CAMP-05
03- Agenda

Vista Visitante - - Agenda del Festival
RF-FE-06
Página de Stands
CAMP-06
04- Stand
Vista Visitante - Administrador- Stands y Grupos
RF-FE-07
Página de Contacto
CAMP-07
06- Contacto
Vista Visitante - Contacto
RF-FE-08
Vista del Administrador
CAMP-08
01 al 06
Vista Administrador - Dashboard / Catálogo
RF-FE-09
Control de Cupos Administrador
CAMP-09
05-
Vista Administrador - Inscripciones (Métricas y Tabla)









Minuta de Acuerdos y Requerimientos - Entrevista 2
En la sesión de alineación con el cliente para la validación de la Especificación de Diseño de Software, se evacuaron dudas críticas de arquitectura y lógica de negocio, llegando a los siguientes consensos vinculantes:
Gestión del Rol Administrador: El cliente validó formalmente la separación estructural de la plataforma en dos flujos independientes (Vista Visitante y Vista Administrador). Se aprobó el diseño del Dashboard administrativo para el monitoreo de métricas en tiempo real y el control centralizado de inscripciones.
Políticas de Restricción de Cupos: Se acordó que el sistema no bloqueará los registros cuando una actividad alcance su capacidad máxima. En su lugar, el backend registrará al estudiante en una "Lista de espera" y la interfaz disparará una alerta visual notificando su estado de postulación para posterior confirmación del staff (mapeado en el requerimiento RF-FE-03 / CAMP-03).
Automatización de Interfaz (Modo Oscuro): Se descartó la inclusión de un switch manual en el Navbar. El sitio web responderá de manera orgánica y automatizada a las preferencias de entorno del sistema operativo del usuario mediante la correcta implementación de Media Queries nativas en las hojas de estilo CSS.
Inclusión, Accesibilidad y Libro de Marca: El cliente enfatizó la necesidad estricta de cumplir con las pautas de accesibilidad WCAG 2.1 Nivel AA. Se validó el uso de la tipografía Barlow Condensed Bold para títulos y Nunito para lectura general por garantizar un contraste mínimo de 4.5:1, además de la incorporación de atributos aria-label, textos alternativos (alt) e iconografía adaptada para personas con discapacidades sensoriales (ceguera, baja visión, daltonismo y sordera).

