
class ProductosPedidos {
  constructor(idProducto, idTienda, cantidad, precio) {
      this.idProducto = idProducto;
      this.idTienda = idTienda;
      this.cantidad = cantidad;
      this.precio = precio;
  }
}

function InicializarPedido()
{
  // Intenta obtener el pedido del sessionStorage
  const pedidoGuardado = sessionStorage.getItem('pedido');

  // Si no hay un pedido guardado...
  if (!pedidoGuardado) {
      const pedido = {
        total: 0, 
        productos: []
      }
      // Convierte el objeto 'pedido' a una cadena JSON y almacénalo en el sessionStorage
      sessionStorage.setItem('pedido', JSON.stringify(pedido));
  }

}

//evalua si el usuario puede acceder a esta pagina directaente porque 
//ya habia ingresado sesion previamente
function EvaluarIngresoDeSesion()
{
  if(!sessionStorage.getItem('idUsuario'))
  {
    window.location.href = "../index.html";
  }
}

//ESTO SE CAMBIA
//por ahora es asi porque no tengo el servidor
//pero siempre hay sessionStorage.getItem('fotoPerfil')
function asignarFoto()
{
  if (sessionStorage.getItem('fotoPerfil')) 
  {
    document.getElementById('userimg').src = sessionStorage.getItem('fotoPerfil');
  }
  else
  {
    document.getElementById('userimg').src = 'https://us.123rf.com/450wm/thesomeday123/thesomeday1231709/thesomeday123170900021/85622928-icono-de-perfil-de-avatar-predeterminado-marcador-de-posición-de-foto-gris-vectores-de.jpg';
  }
}

//LAS SIGUIENTES FUNCIONES SE INVOCAN FUERA DEL MAIN

//esto es para la barra de busqueda
//si hay elementos escritos y se pone enter
//se busca conforme a lo escrito
const input = document.getElementById('barrabusqueda');
input.addEventListener('keydown', function(event) {
    if (event.key === "Enter" && input.value.trim() !== "") {
        // Redireccionar a la nueva pantalla
        sessionStorage.setItem('palabrasClave', input.value);
        window.location.href = "../html/Busqueda.html";
    }
});




//PARA HACER EL POP UP
// Definición de funciones y variables
var getElem = function(id) {
  return document.getElementById(id);
}
var show = function(id) {
  getElem(id).style.display = 'block';
  document.body.classList.add('overlayActive');
}
var hide = function(id) {
  getElem(id).style.display = 'none';
  document.body.classList.remove('overlayActive');
}



//OBTENER LOS PRODUCTOS
// peticion
//se manda la cant de productos que se quiere leer
async function getProductos(){
  return await fetch('http://localhost:8080/productos/limit/8', {
      headers: {
          'Content-Type': 'application/json'
      }
  })
}
//se llama la peticion y se guarda en promesaProductos
const promesaProductos = getProductos()
promesaProductos
  .then(res => {

    console.log(res)
  })
  .then(data => {
      console.log(data)

       //ingresarlo al local storage la lista de ids de productos
       //y hacer el proceso de ingresar las fotos
       generateProductList(data);
       
  })
  .catch(() => {
      console.log('error')
  })
//se generan los productos para poner
function generateProductList(data) {
  
  var container = $(".scrollBoxProducto");
  
  for (var i = 0; i < data.size; i++) 
  {
      var productBlock = `
        <div class="producto">
            <div class="circuloproducto">
                <a href="#" class="productLink" id="${data[i].id}">
                    <img class="fotominipRODUCTO" src="${data[i].foto}" alt="foto Producto">
                </a>
            </div>
            <p class="nombreminiProducto">
                ${data[i].nombre}
            </p>
        </div>
    `;

    container.append(productBlock);

  }
  
  // Es importante hacer el evento click DESPUÉS de agregar los productos al contenedor
  container.find(".productLink").on("click", function(event) {
      event.preventDefault();
      $('#cantidadProducto').val(1);
      console.log(event.currentTarget.id);

      //SE MANDA EL ID DEL PRODUCTO PARA QUE ME MANDEN LA INFO DE ESE PRODUCTO
      const promesaInformacionProducto =getInfoProducto(event.currentTarget.id);

      //guardar el id del producto para usarlo despues//
      sessionStorage.setItem('idproducto', event.currentTarget.id);

      promesaInformacionProducto
      .then(res => {
          console.log(res.ok)
          res.json()
      })
      .then(data => {

          console.log(data)

          generateInfoProducto(data);

          show('popup');
      })
      .catch(() => {
          console.log('error')
      })

  });
}


//PONER LA INFO EN EL POPUP DEL PRODUCTO
//se pide la informacion del producto
async function getInfoProducto(idproducto){
  return await fetch('http://localhost:3000/producto/'+idproducto, {
      headers: {
          'Content-Type': 'application/json'
      }
  })
}

//genera la informacion del producto en el pop up conforme a la info mandada
function generateInfoProducto(data) {
  //titulo grande del producto
  $('#tituloProducto').text(data.nombre);

  //foto del producto
  $("#fotopRODUCTO").attr("src", data.foto);

  //calcula el precio actual con base en si tiene promocion o no
  const precioTot=data.precio-data.precio*data.promocion;
  $('#precioText').text(precioTot.toFixed(2));

  //si no tiene descuento no se muestra la info de promocion
  if(data.descuento==0)
  {
    $('#DescText').hide();
    $('#porcentajePopUp').hide();
    $('#DescText2').hide();
  }
  else
  {
    //si si hay
    //se muestra la promocion
    $('#DescText2').text(data.promocion * 100 + '%');
    //se muestra el precio anterior tachado
    $('#DescText').text(data.precio);
    $('#DescText').css('text-decoration', 'line-through');

  }

  //si la cantidad esta en cero es porque no hay
  if(data.cantidad==0)
  {
    $('#disponible').text('Agotado');
    $('#disponible').css('background-color', '#f17e7e');  // Cambia el color a rojo
  }

  //descripcion del producto
  $('#textoDescrip').text(data.descripcion);

  //ingredientes del producto
  const ingredientesList=data.ingredientes;

  //como es en una lista se concatenen con comas
  var ingredientesText = ingredientesList.join(', ');

  $('#textoIngred').text(ingredientesText);

  //una lista de tiendas
  const tiendasList=data.tiendas;

  var container = $('#RadioOptions');

  for (var i = 0; i < tiendasList.size; i++) {

    //mirar como saber cual tienda es
    //en este caso se mandan las tiendas donde esta disponible el producto
    //en radio se pone en value el valor que se enviara al servidor (que es el id de la tienda)
    //
    var tiendaBlock = `
    <div id="RadioOptions1">
          <input type="radio" class="tienda" id="tienda${tiendasList[i].id}" name="TiendaSeleccion" value="${tiendasList[i].id}">
          <label id="labelt" for="tienda${tiendasList[i].id}">${tiendasList[i].nombre}</label>
    </div>
    `;
    
    //REVISAR
    container.append(tiendaBlock);
  }

  //se muestra el boton el total propuesto si compre una und del producto mas lo que ya ha 
  //anadido antes al carrito
  const pedidoActual = JSON.parse(sessionStorage.getItem('pedido'));
  var cantidad = parseInt($('#cantidadProducto').val(), 10);
  const totalPropuesto=pedidoActual.total+cantidad*precioTot;
  $('#BAgregarEirPagar').text('Agregar e ir a pagar ' +  totalPropuesto.toFixed(2)); // toFixed(2) asegura que se muestren solo dos decimales

}


//ANADIR AL CARRITO
//aqui se hace el proceso de anadir lo pedido en memoria dependiendo del boton
document.addEventListener('DOMContentLoaded', function() { // Asegurarte de que el DOM esté cargado
const BAgregarEirPagar = document.getElementById('BAgregarEirPagar'); // Selecciona el botón por su ID
const BAgregarSeguirComprando = document.getElementById('BAgregarSeguirComprando'); // Selecciona el botón por su ID
const cantidadInput = document.getElementById('cantidadProducto'); // Selecciona el input por su ID

//si selecciona este
//se debe anadir la info a la memoria e ir a la pantalla de realizar compra
BAgregarEirPagar.addEventListener('click', function(event) {
    var cantidad = cantidadInput.value;

    if (isNaN(cantidad) || cantidad.trim() === "") { 
        alert('Por favor, introduce un número válido en la cantidad.');
        event.preventDefault(); // Evita que se ejecute cualquier otro comportamiento del botón.
    }
    else
    {
      //se hace el proceso de guardar el info del pedido
      //se anade el producto con su informacion de id cantidad y precio
      //se suma guarda el valor total

      // Obtener el pedido actual del sessionStorage
      let pedidoActual = JSON.parse(sessionStorage.getItem('pedido')) || pedido;

      /* constructor(idProducto, idTienda, cantidad, precio)*/
      var idproducto=sessionStorage.getItem('idproducto');
      var idtienda= $('input[name="TiendaSeleccion"]:checked').val();
      var cant=parseInt($('#cantidadProducto').val(), 10)
      var precio=parseInt( $('#precioText').val(), 10);

      // Crear un nuevo producto
      let nuevoProducto = new ProductosPedidos(idproducto, idtienda, cant, precio);

      // Añadir el nuevo producto a la lista de productos
      pedidoActual.productos.push(nuevoProducto);

      // Actualizar el total (por ejemplo, sumando la cantidad * precio del nuevo producto)
      pedidoActual.total += nuevoProducto.cantidad * nuevoProducto.precio;

      // Guardar el pedido actualizado de vuelta en el sessionStorage
      sessionStorage.setItem('pedido', JSON.stringify(pedidoActual));

      //TOCA CAMBIARLO
      window.location.href = '../html/pago.html';

    }
});

//si selecciona este
//se anade a la memoria de pedido
//se cierra el pop up
BAgregarSeguirComprando.addEventListener('click', function(event) {
    var cantidad = cantidadInput.value;

    if (isNaN(cantidad) || cantidad.trim() === "") { 

        alert('Por favor, introduce un número válido en la cantidad.');
        event.preventDefault(); // Evita que se ejecute cualquier otro comportamiento del botón.

    }
    else
    {
        //se hace el proceso de guardar el info del pedido
        //se anade el producto con su informacion de id cantidad y precio
        //se suma guarda el valor total

        // Obtener el pedido actual del sessionStorage
        let pedidoActual = JSON.parse(sessionStorage.getItem('pedido')) || pedido;

        /* constructor(idProducto, idTienda, cantidad, precio)*/
        var idproducto=sessionStorage.getItem('idproducto');
        var idtienda= $('input[name="TiendaSeleccion"]:checked').val();
        var cant=parseInt($('#cantidadProducto').val(), 10)
        var precio=parseInt( $('#precioText').val(), 10);

        // Crear un nuevo producto
        let nuevoProducto = new ProductosPedidos(idproducto, idtienda, cant, precio);

        // Añadir el nuevo producto a la lista de productos
        pedidoActual.productos.push(nuevoProducto);

        // Actualizar el total (por ejemplo, sumando la cantidad * precio del nuevo producto)
        pedidoActual.total += nuevoProducto.cantidad * nuevoProducto.precio;

        // Guardar el pedido actualizado de vuelta en el sessionStorage
        sessionStorage.setItem('pedido', JSON.stringify(pedidoActual));

        hide('popup')
    }
  });

});


//PROCESO PARA OBTENER TIENDAS MINIS
async function getTiendas(){
return await fetch('http://localhost:3000/tiendas/limit/8', {

    headers: {
        'Content-Type': 'application/json'
    }
})
}
//SE CREA LA PETICION
const promesaTiendas = getTiendas()
promesaTiendas
.then(res => {
    console.log(res.ok)
})
.then(data => {
    console.log(data)
    //ingresarlo al local storage la lista de ids de tiendas
    //y hacer el proceso de ingresar las fotos
    generateTiendaList(data);
})
.catch(() => {
    console.log('error')
})
//generar cada tienda
function generateTiendaList(data) {

  var container = $(".scrollBoxTienda");
  for (var i = 0; i < data.size; i++) {
      var tiendaBlock = `
      <div class="minitienda">
          <div class="circuloTIENDA">
            <a href="#" class="tiendaLink" id="${data[i].id}">
                <img class="fotominiTIENDA" src=${data[i].foto} alt="foto Tienda">
            </a>
          </div>
          
          <p class="nombreminiTIENDA">
            ${data[i].nombre}
          </p>
      </div>
      `;

      container.append(tiendaBlock);
  }


    // Es importante hacer el evento click DESPUÉS de agregar los productos al contenedor
    //se guarda 
  container.find(".tiendaLink").on("click", function(event) {
    event.preventDefault(); // Prevenir la acción predeterminada del enlace
    sessionStorage.setItem('idTienda', event.currentTarget.id); // Guardar el ID de la tienda en sessionStorage
    //ESTO SE DEBE EDITAR
    window.location.href = 'ruta_de_tu_nueva_pagina.html'; // Redirigir a la nueva página
  });

}

//PONER AQUI EL PROCESO PARA LO DEL CARRITO


                   

                    //ESTO SE QUITA
                    function Ver()
                    {
                      var container = $('#RadioOptions');

                      for (var i = 0; i < 3; i++) {

                        var tiendaBlock = `
                        <div id="RadioOptions1">
                              <input type="radio" id="tienda" name="TiendaSeleccion" value="C">
                              <label id="labelt" for="B">Tienda ${i}</label>
                        </div>
                        `;
                        
                        container.append(tiendaBlock);
                      }
                    }
                    //ESTO SE QUITA
                    function generateTiendas(containerSelector) {
                      var container = $(containerSelector);

                      for (var i = 0; i < 8; i++) {
                          var tiendaBlock = `
                          <div class="minitienda">
                              <div class="circuloTIENDA">
                                  <a href="#" class="tiendaLink" id="${i}">
                                      <img class="fotominiTIENDA" src="../imagenes/LaCentral.png" alt="foto Tienda">
                                  </a>
                              </div>
                              
                              <p class="nombreminiTIENDA">
                                La central
                              </p>
                          </div>
                          `;

                          container.append(tiendaBlock);
                      }

                      container.find(".tiendaLink").on("click", function(event) {
                        event.preventDefault(); // Prevenir la acción predeterminada del enlace
                        sessionStorage.setItem('idTienda', event.currentTarget.id); // Guardar el ID de la tienda en sessionStorage
                        //ESTO SE DEBE EDITAR
                        console.log(event.currentTarget.id);
                        window.location.href = '../html/plantilla.html'; // Redirigir a la nueva página
                      });
                      
                    }

                    //ESTO SE QUITA
                    function generateProducts(containerSelector) {
                      var container = $(containerSelector);

                      for (var i = 0; i < 8; i++) {
                          var productBlock = `
                              <div class="producto">
                                  <div class="circuloproducto">
                                      <a href="#" class="productLink" id="${i}">
                                          <img class="fotominipRODUCTO" src="../imagenes/PRODUCTOIMG.png" alt="foto Producto">
                                      </a>
                                  </div>
                                  <p class="nombreminiProducto">
                                      torta de chocolate
                                  </p>
                              </div>
                          `;

                          container.append(productBlock);
                      }

                      // Es importante hacer el evento click DESPUÉS de agregar los productos al contenedor
                      container.find(".productLink").on("click", function(event) {
                          event.preventDefault();
                          show('popup');
                          $('#cantidadProducto').val(1);
                          console.log(event.currentTarget.id);
                      });
                    }


                    
//todo lo relacionado con la modificacion de la cantidad de producto
//tambien hara la labor de main
$(document).ready(function() {

  //EvaluarIngresoDeSesion();
  InicializarPedido();

  //asignar la foto del usuario
  asignarFoto();

  //ESTO SE QUITA
  Ver();
  //ESTO SE QUITA
  generateProducts(".scrollBoxProducto", 'popup');
//ESTO SE QUITA
  generateTiendas(".scrollBoxTienda");

  $('#basura').on('click', function() {
    $('#cantidadProducto').val('1');
    const pedidoActual = JSON.parse(sessionStorage.getItem('pedido'));
    //se obtiene la cantidad del producto
    //se obtiene el precio actual del prodcuto
    var precioTot=parseInt( $('#precioText').text(), 10);
    const totalPropuesto=pedidoActual.total+(1)*precioTot;
    $('#BAgregarEirPagar').text('Agregar e ir a pagar ' +  totalPropuesto.toFixed(0));
  });

  $('#mas').on('click', function() {
    //se actualiza la cantidad
    var currentValue = parseInt($('#cantidadProducto').val(), 10) || 0; // Convertir el valor a entero
    $('#cantidadProducto').val(currentValue + 1);

    const pedidoActual = JSON.parse(sessionStorage.getItem('pedido'));
      //se obtiene la cantidad del producto
      //se obtiene el precio actual del prodcuto
    var precioTot=parseInt( $('#precioText').text(), 10);
    const totalPropuesto=pedidoActual.total+(currentValue + 1)*precioTot;
    $('#BAgregarEirPagar').text('Agregar e ir a pagar ' +  totalPropuesto.toFixed(0));

  });

  $('#cantidadProducto').on('blur', function() { //Detectar cambios en el input
    
    var valor = $(this).val().trim(); // Eliminar espacios en blanco

    // Comprobar si el valor es un número y no está vacío
    if ($.isNumeric(valor) && valor !== "") 
    {
      const pedidoActual = JSON.parse(sessionStorage.getItem('pedido'));
      //se obtiene la cantidad del producto
      //se obtiene el precio actual del prodcuto
      var precioTot=parseInt( $('#precioText').text(), 10);
      const totalPropuesto=pedidoActual.total+valor*precioTot;
      $('#BAgregarEirPagar').text('Agregar e ir a pagar ' +  totalPropuesto.toFixed(0));

    } 
    else 
    {
        $(this).val("1");
        alert("Por favor, introduce un número válido.");
        const pedidoActual = JSON.parse(sessionStorage.getItem('pedido'));
        var precioTot=parseInt( $('#precioText').text(), 10);
        const totalPropuesto=pedidoActual.total+1*precioTot;
        $('#BAgregarEirPagar').text('Agregar e ir a pagar ' +  totalPropuesto.toFixed(0));
    }
  });

  //ESTO ES PARA LA BUSQUEDA RAPIDA
  $('#promo').on('click', function() {
    sessionStorage.setItem('palabrasClave', "promociones");

  });

  $('#groceries').on('click', function() {
    sessionStorage.setItem('palabrasClave', "tiendas");
  });


});
