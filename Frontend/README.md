<<<<<<< Updated upstream
#1. Descripción General del Sistema
  CampusFest es un sistema web para la gestión integral del festival estudiantil anual de la Universidad Cenfotec. El sistema permite publicar actividades culturales, deportivas, tecnológicas, artísticas, gastronómicas y recreativas; gestionar inscripciones de participantes; administrar stands y grupos; y mostrar la agenda general del evento.
  El sistema reemplaza el proceso manual actual (hojas de cálculo, WhatsApp, formularios externos) con una solución web centralizada, accesible, y alineada con la identidad de marca de la Universidad Cenfotec.

2. Perfiles de Usuario y Actores
  2.1 Usuario Visitante
    Persona que accede al sitio sin autenticación. Puede ser un estudiante, docente o público general interesado en participar del festival.
    Capacidades:
    Ver información general del festival (nombre, descripción, fechas, lugar)
    Consultar catálogo de actividades
    Revisar la agenda del evento
    Consultar stands y grupos participantes
    Completar el formulario de inscripción
    Quedar en lista de espera si no hay cupos disponibles
  2.2 Usuario Administrador
    Persona encargada de la organización del festival. Accede a funcionalidades de gestión a través de una vista diferenciada (activada mediante un botón de cambio de modo en la Etapa 1).
    Capacidades:
    Registrar, editar y cancelar actividades
    Definir cupos máximos por actividad
    Consultar y gestionar inscripciones (incluyendo lista de espera)
    Registrar stands y grupos participantes
    Actualizar resultados o reconocimientos
    Administrar la agenda del festival (lugar, fecha, hora de cada evento)

3. Suposiciones, Dependencias y Restricciones
  3.1 Suposiciones
    Los usuarios visitantes tienen acceso a un navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).
    Las inscripciones se realizan únicamente a través del sitio web (no por WhatsApp ni formularios externos).
    El administrador accede desde la misma URL que el visitante, cambiando de vista mediante un botón durante la Etapa 1.
    Los datos simulados en la Etapa 1 serán reemplazados por datos reales en la Etapa 2.
  3.2 Dependencias
    Google Fonts: Para las fuentes tipográficas (Barlow como alternativa a DIN Alternate; Nunito como alternativa a Circular Std).
    Font Awesome / Lucide: Para íconos de accesibilidad y navegación.
    SweetAlert2: Para alertas de validación de formularios y notificaciones de cupos.
    Node.js + Express + MongoDB: Requeridos para la Etapa 2.
  3.3 Restricciones Generales
    El diseño visual debe cumplir con el Libro de Marca de Universidad Cenfotec (2022).
    El sistema debe ser accesible según las pautas WCAG 2.1 nivel AA.
    No se implementará autenticación avanzada (login/JWT) en la Etapa 1.
    El código fuente debe gestionarse en GitHub bajo la estrategia de branches definida.

4. Requisitos Funcionales
  RF-01: Página de Inicio
    Descripción:
      El sistema debe mostrar el nombre del festival "CampusFest" de forma prominente en el hero.
      El sistema debe mostrar una descripción breve del evento (mínimo 50 palabras).
      El sistema debe mostrar la fecha general del evento y el lugar principal.
      El sistema debe mostrar un botón de enlace hacia la página de actividades.
      El sistema debe mostrar un botón de enlace hacia el formulario de inscripción.
      El sistema debe mostrar una sección destacada con exactamente 3 actividades principales.

  RF-02: Catálogo de Actividades
    Descripción
      El sistema debe mostrar las actividades en formato de tarjetas visuales.
      Cada tarjeta debe incluir: nombre, categoría, fecha, hora, lugar, cupo disponible simulado y botón "Ver detalle".
      El sistema debe permitir filtrar actividades por categoría usando un menú desplegable (dropdown) con las opciones: Cultural, Deportiva, Tecnológica, Artística, Gastronómica, Recreativa.
      El dropdown de categorías debe limitar la selección a las 6 categorías definidas, sin permitir texto libre.

  RF-03: Detalle de Actividad
    Descripción
      El sistema debe mostrar: nombre, descripción completa, categoría, fecha y hora, lugar, cupo máximo y requisitos de participación.
      El sistema debe mostrar un botón de inscripción.
      Si la actividad está llena, el botón de inscripción debe indicar "Unirse a lista de espera".

  RF-04: Formulario de Inscripción
    Descripción
      El formulario debe incluir los campos: nombre completo, identificación, correo electrónico, teléfono, carrera o grupo, actividad seleccionada y comentarios opcionales.
      El campo de actividad debe ser un dropdown con las actividades disponibles.
      El sistema debe validar con JavaScript que los campos obligatorios no estén vacíos.
      El sistema debe validar el formato básico del correo electrónico (debe contener "@" y un dominio).
      El sistema debe validar que el campo de teléfono no esté vacío.
      El sistema debe validar que se haya seleccionado una actividad.
      El sistema debe mostrar alertas visuales (SweetAlert2) para errores de validación y confirmación de envío exitoso.
      Si la actividad seleccionada no tiene cupos disponibles, el sistema debe notificar al usuario que quedará en lista de espera.
      
  RF-05: Agenda del Festival
    Descripción
      El sistema debe mostrar las actividades organizadas por fecha y hora en orden cronológico.
      Cada ítem de agenda debe mostrar: nombre, hora, lugar, categoría y estado.
      El estado de cada actividad debe mostrarse visualmente diferenciado: "Disponible" (verde), "Lleno" (amarillo/naranja), "Cancelado" (rojo).
      El administrador puede definir la agenda (lugar, hora, fecha de cada evento).

  RF-06: Stands y Grupos
    Descripción
      El sistema debe mostrar tarjetas de stands/grupos con: nombre, categoría, responsable, ubicación y descripción breve.
      El administrador puede registrar nuevos stands desde la vista de administración.

  RF-07: Contacto
    Descripción
      La página debe mostrar información del comité organizador: correo, teléfono.
      La página debe incluir un formulario de consulta visual.
      La página debe incluir una sección de preguntas frecuentes (FAQ) con mínimo 4 preguntas.

  RF-08: Vistas de Administrador
    Descripción
      El sistema debe mostrar un botón visible "Vista Administrador / Vista Visitante" para alternar entre modos.
      En modo administrador, deben aparecer controles adicionales: botones de editar/cancelar actividades, formulario de registro de stands, gestión de cupos.
      El administrador puede definir la cantidad de cupos disponibles por actividad.

  RF-09: Control de Cupos
    Descripción
      El sistema debe mostrar una alerta cuando los cupos de una actividad estén al 80% de capacidad.
      El sistema debe mostrar una alerta cuando una actividad esté completamente llena.
      Si no hay cupos disponibles, el usuario puede completar el registro y quedará en lista de espera.
      El administrador puede habilitar cupos adicionales, lo que puede mover participantes de la lista de espera a confirmados.

5. Requisitos No Funcionales
  RNF-01: Responsive — Escritorio
    El sitio debe funcionar correctamente en pantallas de ancho ≥ 1024px mostrando:
      Menú de navegación horizontal.
      Tarjetas en grilla de 3 columnas.
      Formularios centrados con ancho máximo de 600px.
   
  RNF-02: Responsive — Móvil
    En pantallas ≤ 768px el sitio debe mostrar:
      Menú adaptado (hamburguesa o reorganizado).
      Tarjetas en una sola columna.
      Formularios de ancho completo.
      Botones con área de toque mínima de 44x44px.
      
  RNF-03: Media Queries
    Se deben implementar media queries propias para:
    Responsive (breakpoints: 480px, 768px, 1024px).
    Modo oscuro automático: @media (prefers-color-scheme: dark).
    
  RNF-04: Rendimiento
    El sitio debe cargar en menos de 3 segundos en una conexión de banda ancha estándar.
    
  RNF-05: Accesibilidad
    El sitio debe cumplir con WCAG 2.1 nivel AA, incluyendo:
    Contraste mínimo 4.5:1.
    Navegación por teclado completa.
    Textos alternativos en imágenes.
    Compatibilidad con lectores de pantalla.
    
  RNF-06: Identidad Visual
    El sitio debe seguir el Libro de Marca de Universidad Cenfotec 2022:
    Colores primarios: #164a98, #006AEA, #9CC8FF.
    Colores secundarios (solo para acentos): #fff200, #ffc63e.
    Tipografía de títulos: DIN Alternate Bold (o equivalente: Barlow Condensed Bold).
    Tipografía de cuerpo: Circular Std (o equivalente: Nunito).

6. Restricciones de Diseño e Implementación
  6.1 Tecnologías Obligatorias
    Capa                              Tecnología
    Frontend (Etapa 1)       HTML5 semántico, CSS3, JavaScript ES6+
    Alertas/Validación              SweetAlert2
    Backend (Etapa 2)            Node.js, Express.js
    Base de datos (Etapa 2)           MongoDB
    Control de versiones             Git + GitHub

  6.2 Plataforma y Compatibilidad
    Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.
    Dispositivos: desktop, tablet y móvil.
    Sistema operativo: cualquiera (la detección de modo oscuro/claro es automática vía CSS).
  6.3 Estándares de Accesibilidad
    WCAG 2.1 nivel AA.
    Uso de aria-* attributes, roles semánticos HTML5 (<nav>, <main>, <section>, <aside>, <footer>).
    Íconos complementarios para personas sordas en cada categoría de actividad.
    Paleta compatible con los tipos más comunes de daltonismo (deuteranopía, protanopía).

7. Normativas del Proyecto
  7.1 Convenciones de Nomenclatura
    HTML:
      IDs y clases en kebab-case: card-actividad, btn-inscripcion.
      Atributos semánticos obligatorios: alt, aria-label, role.
    CSS:
      Variables CSS en --kebab-case: --color-primary, --font-title.
      Una clase por responsabilidad (principio de responsabilidad única).
      Comentarios de sección con /* === SECCIÓN === */.
    JavaScript:
      Variables y funciones en camelCase: validarFormulario(), toggleAdminView().
      Constantes en UPPER_SNAKE_CASE: MAX_CUPOS, API_URL.
      Comentarios JSDoc para funciones.
      Archivos:
      Nombres en kebab-case: index.html, actividades.html, styles.css, main.js.
   
  7.2 Estrategia de Branches
    main           → código estable/producción
    develop        → integración de features
    feature/RF-XX  → desarrollo de cada requerimiento
    fix/descripcion → corrección de bugs
    Regla: Nunca hacer commit directo a main. Todo cambio pasa por Pull Request desde develop.
    
  7.3 Tipos de Commit (Conventional Commits)
      Prefijo                                Uso
      feat:                Nueva funcionalidad (feat: agregar filtro de categorías)
      fix:               Corrección de bug (fix: validación de correo en inscripción)
      style:        Cambios de estilo/CSS sin afectar lógica (style: ajustar colores modo oscuro)
      docs:                   Documentación (docs: actualizar ERS sección 4)
      refactor:               Refactorización sin cambio de funcionalidad
      test:                        Agregar o modificar pruebas
      chore:                 Tareas de mantenimiento, dependencias













=======
1. DESCRIPCIÓN GENERAL
CampusFest es un sistema web para la gestión integral del festival estudiantil anual de la Universidad Cenfotec. El sistema permite publicar actividades culturales, deportivas, tecnológicas, artísticas, gastronómicas y recreativas; gestionar inscripciones de participantes; administrar stands y grupos; y mostrar la agenda general del evento.
El sistema reemplaza el proceso manual actual (hojas de cálculo, WhatsApp, formularios externos) con una solución web centralizada, accesible, y alineada con la identidad de marca de la Universidad Cenfotec.
>>>>>>> Stashed changes
