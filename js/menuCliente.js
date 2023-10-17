
//asignar la foto del usuario
asignarFoto();
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

//esto es para la barra de busqueda
const input = document.getElementById('barrabusqueda');
input.addEventListener('keydown', function(event) {
    if (event.key === "Enter" && input.value.trim() !== "") {
        // Redireccionar a la nueva pantalla
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
async function getProductos(){
  return await fetch('http://localhost:8080/productos', {
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          limit: 8
      })
  })
}
const promesaProductos = getProductos()
promesaProductos
  .then(res => {

      res.json()
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
  function generateProductList(data) {
    
    var container = $(".scrollBoxProducto");
    
    for (var i = 0; i < data.size; i++) 
    {
       var productBlock = `
          <div class="producto">
              <div class="circuloproducto">
                  <a href="#" class="productLink" id="${data[i].ID}">
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
        const promesaInformacionProducto =getInfoProducto(idProducto);

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

async function getInfoProducto(idproducto){
  return await fetch('http://localhost:3000/info-producto', {

      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          ID: idproducto
      })
  })
}

  function generateInfoProducto(data) {
   
    var container = $('#RadioOptions');
    
    $('#tituloProducto').text(data.nombre);
    $("#fotopRODUCTO").attr("src", data.foto);
    $('#precioText').text(data.precio-data.precio*data.promocion);

    if(data.descuento==0)
    {
      $('#DescText').hide();
      $('#porcentajePopUp').hide();
      $('#DescText2').hide();
    }
    else
    {
      $('#DescText2').text(data.promocion * 100 + '%');
      $('#DescText').text(data.precio);
      $('#DescText').css('text-decoration', 'line-through');

    }

    if(data.cantidad==0)
    {
      $('#disponible').text('Agotado');
      $('#disponible').css('background-color', '#f17e7e');  // Cambia el color a rojo
    }

    $('#textoDescrip').text(data.descripcion);

    const ingredientesList=data.ingredientes;

    var ingredientesText

    $('#textoIngred').text(ingredientesText);

    const tiendasList=data.tiendas;

    for (var i = 0; i < tiendasList.size; i++) {

      var tiendaBlock = `
      <div id="RadioOptions1">
            <input type="radio" id="tienda" name="TiendaSeleccion" value=${tiendasList[i].nombre}>
            <label id="labelt" for=${tiendasList[i].nombre}>${tiendasList[i].nombre}</label>
      </div>
      `;
      
      //REVISAR
      container.append(tiendaBlock);
    }

  }


  //ESTO SE QUITA
  Ver();

  function Ver()
  {
    var container = $('#RadioOptions');

    for (var i = 0; i < 3; i++) {

      var tiendaBlock = `
      <div id="RadioOptions1">
            <input type="radio" id="tienda" name="TiendaSeleccion" value="a">
            <label id="labelt" for="a">Tienda ${i}</label>
      </div>
      `;
      
      //REVISAR
      container.append(tiendaBlock);
    }
  }



async function getTiendas(){
  return await fetch('http://localhost:3000/tiendas', {

      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          limit: 8
      })
  })
}

const promesaTiendas = getTiendas()

promesaTiendas
  .then(res => {
      console.log(res.ok)
      

      res.json()
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
  
  function generateTiendaList(data) {
    var container = $(".scrollBoxTienda");
  
  
    for (var i = 0; i < data.size; i++) {
        var tiendaBlock = `
        <div class="minitienda">
            <div class="circuloTIENDA">
              <a href="#" class="tiendaLink" id="${data[i].ID}">
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
    container.find(".productLink").on("click", function(event) {
      event.preventDefault(); // Prevenir la acción predeterminada del enlace
      sessionStorage.setItem('idTienda', event.currentTarget.id); // Guardar el ID de la tienda en sessionStorage
      window.location.href = 'ruta_de_tu_nueva_pagina.html'; // Redirigir a la nueva página
    });

  }

//ESTO SE QUITA
function generateTiendas(containerSelector) {
  var container = $(containerSelector);

  for (var i = 0; i < 8; i++) {
      var tiendaBlock = `
      <div class="minitienda">
          <div class="circuloTIENDA">
              <img class="fotominiTIENDA" src="../imagenes/LaCentral.png" alt="foto Tienda">
          </div>
          
          <p class="nombreminiTIENDA">
            La central
          </p>
      </div>
      `;

      container.append(tiendaBlock);
  }
}



$(document).ready(function() {
  // Para el primer bloque
  generateProducts(".scrollBoxProducto", 'popup');

  generateTiendas(".scrollBoxTienda");

  $('#basura').on('click', function() {
    $('#cantidadProducto').val('1');
  });

  $('#mas').on('click', function() {
    var currentValue = parseInt($('#cantidadProducto').val(), 10) || 0; // Convertir el valor a entero
    $('#cantidadProducto').val(currentValue + 1);
  });

  $('.Bspagar').on('click', function() {
    var cantidad = $('#cantidadProducto').val();
    if (isNaN(cantidad) || cantidad.trim() === "") { 
        // isNaN verifica si no es un número; la segunda condición verifica si está vacío o sólo contiene espacios.
        alert('Por favor, introduce un número válido en la cantidad.');
        return false; // Evita que se ejecute cualquier otro comportamiento del botón.
    }
    

});

});
