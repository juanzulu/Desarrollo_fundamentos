// Función para mostrar el pop-up
function mostrarPopup(id) {
  var popup = document.getElementById(id);
  popup.style.display = "block";
}

// Función para cerrar el pop-up
function cerrarPopup(id) {
  var popup = document.getElementById(id);
  popup.style.display = "none";
}

// Obtener todos los elementos con la clase 'btnMidlle' y asignar eventos de clic a ellos
var botones = document.querySelectorAll('.btnMidlle');

botones.forEach(function(boton) {
  boton.addEventListener('click', function() {
      var id = 'popup-' + boton.id;
      mostrarPopup(id);
  });
});


// Obtén todos los botones con la clase 'cerrar-popup'
const botonesPopUp = document.querySelectorAll('.cerrar-popup');

// Itera sobre los botones y asigna eventos
botonesPopUp.forEach(boton => {
  boton.addEventListener('click', function() {
    // Obtiene el número del botón desde el atributo 'data-boton'
    const numeroBoton = this.getAttribute('data-boton');
    cerrarPopup(`popup-boton${numeroBoton}`);
  });
});
