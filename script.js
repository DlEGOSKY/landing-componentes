/* Script de la landing - SIGT */


/* menu movil (hamburguesa) */
const botonMenu = document.getElementById("botonMenu");
const menu = document.getElementById("menu");

botonMenu.addEventListener("click", function () {
    menu.classList.toggle("abierto");
});

// cerrar el menu cuando se hace clic en un enlace
const enlacesMenu = document.querySelectorAll(".nav-enlace");
enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
        menu.classList.remove("abierto");
    });
});


/* boton de "ir arriba" */
const botonArriba = document.getElementById("botonArriba");

window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
        botonArriba.classList.add("visible");
    } else {
        botonArriba.classList.remove("visible");
    }
});

botonArriba.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* mini demo: gestion de tareas con LocalStorage */
const CLAVE_STORAGE = "sigt_demo_tareas_v2";

const formularioTarea = document.getElementById("formularioTarea");
const inputTitulo = document.getElementById("inputTitulo");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputEstado = document.getElementById("inputEstado");
const inputPrioridad = document.getElementById("inputPrioridad");

const listaTareas = document.getElementById("listaTareas");
const mensajeVacio = document.getElementById("mensajeVacio");
const totalTareas = document.getElementById("totalTareas");
const pendientesTareas = document.getElementById("pendientesTareas");
const progresoTareas = document.getElementById("progresoTareas");
const completadasTareas = document.getElementById("completadasTareas");
const demoFiltros = document.getElementById("demoFiltros");

let tareas = [];
let filtroActual = "todas";


function textoEstado(estado) {
    if (estado === "pendiente") return "Pendiente";
    if (estado === "en-progreso") return "En progreso";
    return "Completado";
}

function textoPrioridad(prioridad) {
    if (prioridad === "alta") return "Alta";
    if (prioridad === "baja") return "Baja";
    return "Media";
}


function cargarTareas() {
    const datos = localStorage.getItem(CLAVE_STORAGE);
    if (datos) {
        tareas = JSON.parse(datos);
    }
    mostrarTareas();
}

function guardarTareas() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
}


// dibuja la lista de tareas y actualiza los contadores
function mostrarTareas() {
    listaTareas.innerHTML = "";

    let visibles = tareas;
    if (filtroActual !== "todas") {
        visibles = tareas.filter(function (t) { return t.estado === filtroActual; });
    }

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
        const li = document.createElement("li");
        li.className = "tarea prioridad-" + tarea.prioridad;

        const descripcion = tarea.descripcion ? tarea.descripcion : "Sin descripción";

        li.innerHTML =
            '<div class="tarea-cabecera">' +
                '<span class="badge-estado estado-' + tarea.estado + '">' + textoEstado(tarea.estado) + '</span>' +
                '<span class="badge-prioridad">Prioridad ' + textoPrioridad(tarea.prioridad) + '</span>' +
            '</div>' +
            '<h4 class="tarea-titulo"></h4>' +
            '<p class="tarea-descripcion"></p>' +
            '<div class="tarea-controles">' +
                '<select>' +
                    '<option value="pendiente">Pendiente</option>' +
                    '<option value="en-progreso">En progreso</option>' +
                    '<option value="completado">Completado</option>' +
                '</select>' +
                '<button class="demo-eliminar" title="Eliminar">\u00d7</button>' +
            '</div>';

        li.querySelector(".tarea-titulo").textContent = tarea.titulo;
        li.querySelector(".tarea-descripcion").textContent = descripcion;

        const select = li.querySelector("select");
        select.value = tarea.estado;
        select.addEventListener("change", function () {
            tarea.estado = select.value;
            guardarTareas();
            mostrarTareas();
        });

        li.querySelector(".demo-eliminar").addEventListener("click", function () {
            tareas = tareas.filter(function (t) { return t.id !== tarea.id; });
            guardarTareas();
            mostrarTareas();
        });

        listaTareas.appendChild(li);
    });

    // contadores
    totalTareas.textContent = tareas.length;
    pendientesTareas.textContent = tareas.filter(function (t) { return t.estado === "pendiente"; }).length;
    progresoTareas.textContent = tareas.filter(function (t) { return t.estado === "en-progreso"; }).length;
    completadasTareas.textContent = tareas.filter(function (t) { return t.estado === "completado"; }).length;
}


// agregar nueva tarea
formularioTarea.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const titulo = inputTitulo.value.trim();
    if (titulo === "") return;

    tareas.push({
        id: Date.now(),
        titulo: titulo,
        descripcion: inputDescripcion.value.trim(),
        estado: inputEstado.value,
        prioridad: inputPrioridad.value
    });

    guardarTareas();
    mostrarTareas();

    // limpiar el formulario
    inputTitulo.value = "";
    inputDescripcion.value = "";
    inputEstado.value = "pendiente";
    inputPrioridad.value = "media";
});


// filtros por estado
demoFiltros.addEventListener("click", function (evento) {
    if (!evento.target.classList.contains("filtro")) return;

    const activoActual = demoFiltros.querySelector(".activo");
    if (activoActual) activoActual.classList.remove("activo");

    evento.target.classList.add("activo");
    filtroActual = evento.target.dataset.filtro;
    mostrarTareas();
});


cargarTareas();
