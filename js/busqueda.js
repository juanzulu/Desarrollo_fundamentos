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
  
  const cant=20;
  
  async function getProductos(){
    return await fetch('http://localhost:8080/productos', {
  
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            busqueda: clave //ojo
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
         for (var i = 0; i < cant; i++) {
        
         }
        generateProducts(".scrollBoxProducto", data.nombre, data.url);
    })
    .catch(() => {
        console.log('error')
    })
    
  
  function generateProducts(containerSelector, popupId) {
    var container = $(containerSelector);
    var linkImagen;
    var nombre;
  
    for (var i = 0; i < cant; i++) {
        var productBlock = `
            <div class="producto">
                <div class="circuloproducto">
                    <a href="#" class="productLink">
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
        show(popupId);
        $('#cantidadProducto').val(1);
    });
  }
  
  async function getTiendas(){
    return await fetch('http://localhost:3000/tiendas', {
  
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            busqueda: clave
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
       for (var i = 0; i < cant; i++) {
  
       }
       generateTiendas(".scrollBoxTienda", data.nombre, data.url);
    })
    .catch(() => {
        console.log('error')
    })
    
  
  function generateTiendas(containerSelector) {
    var container = $(containerSelector);
    var linkImagen;
    var nombre;
  
    for (var i = 0; i < cant; i++) {
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
  
  async function getInfoProducto(idProducto){
    return await fetch('http://localhost:3000/info-producto', {
  
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ID: idproducto
        })
    })
  }
  
  const promesaInformacionProducto = getProductos()
  
  promesaInformacionProducto
    .then(res => {
        console.log(res.ok)
  
        res.json()
    })
    .then(data => {
        console.log(data)
  
        //VER EL ARRAY PORF
        generateInfoProducto(data.nombre, data.precio, data.descuento, data.disponible, data.descripcion, data.ingredientes, data.tiendasList, data.imagen);
    })
    .catch(() => {
        console.log('error')
    })
    
    function generateInfoProducto(nombre, precio, descuento, disponible, descripcion, ingredientes, tiendasList, linkImagen) {
     
      var container = $(containerSelector);
      
      $('#tituloProducto').text(nombre);
      $("#fotopRODUCTO").attr("src", imagen);
      $('#precioText').text(precio-precio*descuento);
  
      if(descuento==0)
      {
        $('#DescText').hide();
        $('#porcentajePopUp').hide();
        $('#DescText2').hide();
      }
      else
      {
        $('#DescText2').text(descuento * 100 + '%');
        $('#DescText').text(precio);
        $('#DescText').css('text-decoration', 'line-through');
  
      }
  
      if(!disponible)
      {
        $('disponible').text('agotado');
        $('#disponible').css('color', '#f17e7e');  // Cambia el color a rojo
      }
  
      $('#textoDescrip').text(descripcion);
  
      $('#textoIngred').text(ingredientes);
  
      for (var i = 0; i < tiendasList.size; i++) {
        var nombreTienda;
  
        var tiendaBlock = `
        <div id="RadioOptions1">
              <input type="radio" id="tienda" name="TiendaSeleccion" value="Tienda1">
        </div>
        `;
        
        //REVISAR
        container.append('scrollBoxinner');
      }
  
    }
  
  
  $(document).ready(function() {
    // Para el primer bloque
    generateProducts(".scrollBoxProducto", 'popup');
  
    generateTiendas(".scrollBoxTienda");
  
    asignarFoto();
  
    function asignarFoto()
    {
      if (sessionStorage.getItem('fotoPerfil')) 
      {
        document.getElementById('userimg').src = sessionStorage.getItem('fotoPerfil');
      }
    }
  
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
  