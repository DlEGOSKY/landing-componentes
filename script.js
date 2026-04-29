/* ==============================================
   SCRIPT DE LA LANDING - SIGT
   Se encarga de 3 cosas sencillas:
   1. Abrir/cerrar el menu movil (hamburguesa)
   2. Cerrar el menu al hacer clic en un enlace
   3. Mostrar/ocultar el boton "ir arriba" y hacerlo funcional
   ============================================== */


/* ==============================================
   1. MENU MOVIL (HAMBURGUESA)
   ============================================== */

// Obtenemos los elementos del DOM que necesitamos
const botonMenu = document.getElementById("botonMenu");
const menu = document.getElementById("menu");

// Al hacer clic en el boton hamburguesa, se abre o cierra el menu
botonMenu.addEventListener("click", function () {
    // toggle agrega la clase si no esta y la quita si ya esta
    menu.classList.toggle("abierto");
});


/* ==============================================
   2. CERRAR MENU AL HACER CLIC EN UN ENLACE
   (Mejora la experiencia en movil)
   ============================================== */

// Seleccionamos todos los enlaces del menu
const enlacesMenu = document.querySelectorAll(".nav-enlace");

// A cada enlace le agregamos un evento para cerrar el menu al hacer clic
enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
        menu.classList.remove("abierto");
    });
});


/* ==============================================
   3. BOTON "IR ARRIBA"
   - Aparece cuando el usuario hace scroll hacia abajo
   - Al hacer clic, regresa al inicio de la pagina
   ============================================== */

// Obtenemos el boton del DOM
const botonArriba = document.getElementById("botonArriba");

// Escuchamos el evento scroll de la ventana
window.addEventListener("scroll", function () {
    // Si el usuario se desplaza mas de 300px, mostramos el boton
    if (window.scrollY > 300) {
        botonArriba.classList.add("visible");
    } else {
        botonArriba.classList.remove("visible");
    }
});

// Al hacer clic en el boton, subimos suavemente al inicio de la pagina
botonArriba.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


/* ==============================================
   4. MINI DEMO DE GESTION DE TAREAS
   Crear, clasificar por estado y prioridad, filtrar y eliminar.
   Los datos se guardan en LocalStorage.
   ============================================== */

const CLAVE_STORAGE = "sigt_demo_tareas_v2";

// Elementos del formulario
const formularioTarea = document.getElementById("formularioTarea");
const inputTitulo = document.getElementById("inputTitulo");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputEstado = document.getElementById("inputEstado");
const inputPrioridad = document.getElementById("inputPrioridad");

// Elementos de la lista y contadores
const listaTareas = document.getElementById("listaTareas");
const mensajeVacio = document.getElementById("mensajeVacio");
const totalTareas = document.getElementById("totalTareas");
const pendientesTareas = document.getElementById("pendientesTareas");
const progresoTareas = document.getElementById("progresoTareas");
const completadasTareas = document.getElementById("completadasTareas");
const demoFiltros = document.getElementById("demoFiltros");

// Tareas en memoria y filtro activo
let tareas = [];
let filtroActual = "todas";

// Etiquetas legibles
const etiquetasEstado = {
    "pendiente": "Pendiente",
    "en-progreso": "En progreso",
    "completado": "Completado"
};

const etiquetasPrioridad = {
    "baja": "Baja",
    "media": "Media",
    "alta": "Alta"
};

// Carga lo que estaba guardado en el navegador
function cargarTareas() {
    const datos = localStorage.getItem(CLAVE_STORAGE);
    if (datos) {
        tareas = JSON.parse(datos);
    }
    renderizar();
}

// Guarda el array completo en LocalStorage
function guardarTareas() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
}

// Cuenta cuantas tareas hay en cada estado
function actualizarContadores() {
    const total = tareas.length;
    const pendientes = tareas.filter(function (t) { return t.estado === "pendiente"; }).length;
    const enProgreso = tareas.filter(function (t) { return t.estado === "en-progreso"; }).length;
    const completadas = tareas.filter(function (t) { return t.estado === "completado"; }).length;

    totalTareas.textContent = total;
    pendientesTareas.textContent = pendientes;
    progresoTareas.textContent = enProgreso;
    completadasTareas.textContent = completadas;
}

// Devuelve las tareas que se deben mostrar segun el filtro
function obtenerVisibles() {
    if (filtroActual === "todas") {
        return tareas;
    }
    return tareas.filter(function (t) { return t.estado === filtroActual; });
}

// Construye una tarjeta de tarea (un <li>)
function crearElementoTarea(tarea) {
    const li = document.createElement("li");
    li.className = "tarea prioridad-" + tarea.prioridad;

    // Cabecera con badges de estado y prioridad
    const cabecera = document.createElement("div");
    cabecera.className = "tarea-cabecera";

    const badgeEstado = document.createElement("span");
    badgeEstado.className = "badge-estado estado-" + tarea.estado;
    badgeEstado.textContent = etiquetasEstado[tarea.estado];

    const badgePrioridad = document.createElement("span");
    badgePrioridad.className = "badge-prioridad";
    badgePrioridad.textContent = "Prioridad " + etiquetasPrioridad[tarea.prioridad];

    cabecera.appendChild(badgeEstado);
    cabecera.appendChild(badgePrioridad);

    // Titulo
    const titulo = document.createElement("h4");
    titulo.className = "tarea-titulo";
    titulo.textContent = tarea.titulo;

    // Descripcion (si la hay)
    const descripcion = document.createElement("p");
    descripcion.className = "tarea-descripcion";
    descripcion.textContent = tarea.descripcion ? tarea.descripcion : "Sin descripción";

    // Controles: cambiar estado y eliminar
    const controles = document.createElement("div");
    controles.className = "tarea-controles";

    const select = document.createElement("select");
    const opciones = ["pendiente", "en-progreso", "completado"];
    opciones.forEach(function (valor) {
        const option = document.createElement("option");
        option.value = valor;
        option.textContent = etiquetasEstado[valor];
        select.appendChild(option);
    });
    select.value = tarea.estado;
    select.addEventListener("change", function () {
        cambiarEstado(tarea.id, select.value);
    });

    const botonEliminar = document.createElement("button");
    botonEliminar.className = "demo-eliminar";
    botonEliminar.textContent = "\u00d7";
    botonEliminar.title = "Eliminar tarea";
    botonEliminar.addEventListener("click", function () {
        eliminarTarea(tarea.id);
    });

    controles.appendChild(select);
    controles.appendChild(botonEliminar);

    li.appendChild(cabecera);
    li.appendChild(titulo);
    li.appendChild(descripcion);
    li.appendChild(controles);

    return li;
}

// Dibuja la lista cada vez que algo cambia
function renderizar() {
    listaTareas.innerHTML = "";
    const visibles = obtenerVisibles();

    if (visibles.length === 0) {
        mensajeVacio.classList.remove("oculto");
        if (filtroActual === "todas") {
            mensajeVacio.textContent = "No hay tareas todavía. Agrega la primera.";
        } else {
            mensajeVacio.textContent = "No hay tareas en esta categoría.";
        }
    } else {
        mensajeVacio.classList.add("oculto");
    }

    visibles.forEach(function (tarea) {
        listaTareas.appendChild(crearElementoTarea(tarea));
    });

    actualizarContadores();
}

// Agrega una tarea nueva
function agregarTarea(titulo, descripcion, estado, prioridad) {
    tareas.push({
        id: Date.now(),
        titulo: titulo,
        descripcion: descripcion,
        estado: estado,
        prioridad: prioridad
    });
    guardarTareas();
    renderizar();
}

// Cambia el estado de una tarea
function cambiarEstado(id, nuevoEstado) {
    const tarea = tareas.find(function (t) { return t.id === id; });
    if (tarea) {
        tarea.estado = nuevoEstado;
        guardarTareas();
        renderizar();
    }
}

// Elimina una tarea por su id
function eliminarTarea(id) {
    tareas = tareas.filter(function (t) { return t.id !== id; });
    guardarTareas();
    renderizar();
}

// Cuando el usuario envia el formulario
formularioTarea.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const titulo = inputTitulo.value.trim();
    if (titulo === "") return;

    agregarTarea(
        titulo,
        inputDescripcion.value.trim(),
        inputEstado.value,
        inputPrioridad.value
    );

    // Limpiar el formulario para la siguiente
    inputTitulo.value = "";
    inputDescripcion.value = "";
    inputEstado.value = "pendiente";
    inputPrioridad.value = "media";
});

// Click en los botones de filtro
demoFiltros.addEventListener("click", function (evento) {
    if (!evento.target.classList.contains("filtro")) return;

    const activoActual = demoFiltros.querySelector(".activo");
    if (activoActual) activoActual.classList.remove("activo");

    evento.target.classList.add("activo");
    filtroActual = evento.target.dataset.filtro;
    renderizar();
});

cargarTareas();
