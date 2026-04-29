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
   4. MINI DEMO INTERACTIVO DE GESTION DE TAREAS
   - Permite crear, marcar y eliminar tareas
   - Los datos se guardan en LocalStorage del navegador
   ============================================== */

// Clave que usaremos para guardar/leer en LocalStorage
const CLAVE_STORAGE = "sigt_demo_tareas";

// Elementos del DOM que necesita el demo
const formularioTarea = document.getElementById("formularioTarea");
const inputTarea = document.getElementById("inputTarea");
const listaTareas = document.getElementById("listaTareas");
const mensajeVacio = document.getElementById("mensajeVacio");
const totalTareas = document.getElementById("totalTareas");
const pendientesTareas = document.getElementById("pendientesTareas");
const completadasTareas = document.getElementById("completadasTareas");

// Array que mantiene las tareas en memoria mientras el usuario interactua
let tareas = [];

// Carga las tareas que ya estaban guardadas en el navegador
function cargarTareas() {
    const datos = localStorage.getItem(CLAVE_STORAGE);
    if (datos) {
        tareas = JSON.parse(datos);
    }
    renderizar();
}

// Guarda el array actual de tareas en LocalStorage
function guardarTareas() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
}

// Actualiza los contadores que se muestran arriba de la lista
function actualizarContadores() {
    const total = tareas.length;
    const completadas = tareas.filter(function (t) {
        return t.completada;
    }).length;
    const pendientes = total - completadas;

    totalTareas.textContent = total;
    pendientesTareas.textContent = pendientes;
    completadasTareas.textContent = completadas;
}

// Dibuja la lista de tareas cada vez que algo cambia
function renderizar() {
    // Limpiamos la lista actual
    listaTareas.innerHTML = "";

    // Si no hay tareas, mostramos el mensaje de "vacio"
    if (tareas.length === 0) {
        mensajeVacio.classList.remove("oculto");
    } else {
        mensajeVacio.classList.add("oculto");
    }

    // Por cada tarea construimos un <li> con su contenido
    tareas.forEach(function (tarea) {
        const li = document.createElement("li");
        if (tarea.completada) {
            li.classList.add("completada");
        }

        // Checkbox para marcar como completada
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarea.completada;
        checkbox.addEventListener("change", function () {
            alternarCompletada(tarea.id);
        });

        // Texto de la tarea
        const span = document.createElement("span");
        span.className = "tarea-texto";
        span.textContent = tarea.texto;

        // Boton para eliminar la tarea
        const botonEliminar = document.createElement("button");
        botonEliminar.className = "demo-eliminar";
        botonEliminar.textContent = "\u00d7";
        botonEliminar.title = "Eliminar tarea";
        botonEliminar.addEventListener("click", function () {
            eliminarTarea(tarea.id);
        });

        // Armamos el <li> y lo agregamos a la lista
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(botonEliminar);
        listaTareas.appendChild(li);
    });

    actualizarContadores();
}

// Agrega una tarea nueva al array y guarda
function agregarTarea(texto) {
    const nueva = {
        id: Date.now(),
        texto: texto,
        completada: false
    };
    tareas.push(nueva);
    guardarTareas();
    renderizar();
}

// Cambia el estado de una tarea (de pendiente a completada y viceversa)
function alternarCompletada(id) {
    tareas = tareas.map(function (t) {
        if (t.id === id) {
            t.completada = !t.completada;
        }
        return t;
    });
    guardarTareas();
    renderizar();
}

// Elimina una tarea por su id
function eliminarTarea(id) {
    tareas = tareas.filter(function (t) {
        return t.id !== id;
    });
    guardarTareas();
    renderizar();
}

// Cuando el usuario envia el formulario, agregamos la tarea
formularioTarea.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const texto = inputTarea.value.trim();
    if (texto !== "") {
        agregarTarea(texto);
        inputTarea.value = "";
    }
});

// Iniciamos el demo cargando las tareas guardadas (si las hay)
cargarTareas();
