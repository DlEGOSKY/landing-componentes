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
