 async function getInfoUsuario(){
    let idUsuario = localStorage.getItem('idUsuario');
    
    return await fetch('http://localhost:8080/info-usuario', {
  
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ID: idUsuario //ESTO ES DE LA MEMORIA
        })
    })
  }
  
  const promesaInformacionUsuario = getInfoUsuario()
  
  promesaInformacionUsuario
    .then(res => {
        console.log(res.ok)
        res.json()
    })
    .then(data => {
        console.log(data)
        generateInfoUsuario(data.usuario,data.nombre, data.apellido, data.telefono);
    })
    .catch(() => {
        console.log('error de inicio')
    })

    async function postInfoUsuario(inputNombreusuario, inputcontrasena, inputnombre, inputapellido, inputtelefono){
        let idUsuario = localStorage.getItem('idUsuario');
        
        return await fetch('http://localhost:8080/crear-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ID: idUsuario,
                NUsario: inputNombreusuario,
                nombre: inputnombre,
                apellido: inputapellido,
                telefeono: inputtelefono
            })
        })
    }

    async function EliminarUsuario(){
        let idUsuario = localStorage.getItem('idUsuario');

        return await fetch('http://localhost:8080/crear-usuario', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ID: idUsuario
            })
        })
    }


$(document).ready(function() {
    
    function initializeSessionStorage() {
        var campos = ['Nombreusuario', 'nombre', 'apellido', 'telefono', 'correo'];
        campos.forEach(function(campo) {
            var inputElement = $('#' + campo);
            if (!sessionStorage.getItem(campo)) {
                sessionStorage.setItem(campo, inputElement.val());
            }
            else
            {
                campos.forEach(function(campo) {
                    $('#' + campo).val(sessionStorage.getItem(campo));
                });
            }
        });

        sessionStorage.setItem('fotoPerfil', document.getElementById('foto').src);
    }

    initializeSessionStorage();

    // Evento al hacer clic en el botón Cancelar
    $('#cancelar').click(function() {
        var campos = ['Nombreusuario', 'contrasena', 'nombre', 'apellido', 'telefono', 'correo'];
        campos.forEach(function(campo) {
            $('#' + campo).val(sessionStorage.getItem(campo));
        });

        document.getElementById('foto').src = sessionStorage.getItem('fotoPerfil');
    });


  function showAlert() {
      $('.alert').addClass("show");
      $('.alert').removeClass("hide");
      $('.alert').addClass("showAlert");
      $('#mas').off('click');  // Desactiva el evento click en #mas
  }

  function hideAlert() {
      $('.alert').removeClass("show");
      $('.alert').addClass("hide");
      bindMasEvent();  // Reactiva el evento click en #mas
  }

  function showAlert2(){
    $('.alert2').addClass("show");
    $('.alert2').removeClass("hide");
    $('.alert2').addClass("showAlert");
    setTimeout(function(){
        $('.alert2').removeClass("show");
        $('.alert2').addClass("hide");
    },10000);
  };

    $('.close-btn2').click(function(){
        $('.alert2').removeClass("show");
        $('.alert2').addClass("hide");
    });

  function bindMasEvent() {
      $('#mas').on('click', function() {
          $('#fileUpload').trigger('click');
      });
  }

  bindMasEvent(); // Inicialmente vincula el evento

  $('#fileUpload').on('change', function() {
      const file = this.files[0];
      if (file) {
          const newSrc = URL.createObjectURL(file);
          $('#foto').attr('src', newSrc);
      }
      const fileName = $(this).val().split('\\').pop();
      $('output').text(fileName);
  });

  $('#eliminar').on('click', function() {
      showAlert();
  });

  $('.close-btn').on('click', function() {
      hideAlert();
  });

  // Añade eventos a los botones Sí y No de la alerta
  $('.yes-btn, .no-btn').on('click', function() {
      hideAlert();
      const promesaEliminar = EliminarUsuario();
      promesaEliminar 
          .then(res => {
              console.log(res.ok)
          })
          .catch(() => {
              console.log('error')
              $('.msg2').text('No se pudo borrar la cuenta, vuelva a tratar');
              showAlert2();
          })
  });

  

  $('.camposCambiar').off('submit').on('submit', function(event) {
    event.preventDefault();  // Prevent form submission

    var isValid = true;
    var inputNombreusuario = $('#Nombreusuario').val().trim();
    var inputcontrasena = $('#contrasena').val().trim();
    var inputtelefono = $('#telefono').val().trim();

    if(inputNombreusuario === "") {
        isValid = false;
        $('.msg2').text('Usuario no puede estar vacío');
        showAlert2();
    }
    else if(inputtelefono === "" || isNaN(inputtelefono)) {
        isValid = false;
        if (inputtelefono === "") {
            $('.msg2').text('Teléfono no puede estar vacío');
        } else {
            $('.msg2').text('Teléfono solo debe tener números');
        }
        showAlert2();
    }

    if(isValid) {
        const promesaUpdateInformacionUsuario = postInfoUsuario(inputNombreusuario, inputcontrasena, $('#nombre').val().trim(), $('#apellido').val().trim(), inputtelefono);
        
        promesaUpdateInformacionUsuario
        .then(res => {
            saveToSessionStorage();
            $('.msg2').text('Cambios guardados satisfactoriamente');
            showAlert2();
            console.log(res.ok)
        })
        .catch(() => {
            console.log('error')
            $('.msg2').text('Cambios no guardados, vuelva a tratar');
            showAlert2();
        })
        
    }
   });

    function saveToSessionStorage() {
        var campos = ['Nombreusuario', 'contrasena', 'nombre', 'apellido', 'telefono', 'correo'];
        campos.forEach(function(campo) {
            var inputElement = $('#' + campo);
            sessionStorage.setItem(campo, inputElement.val());
        });
        sessionStorage.setItem('fotoPerfil', document.getElementById('foto').src);
    }

});

function show(id) {
    document.getElementById(id).style.display = 'block';
    document.body.classList.add('overlayActive');
  }
  
  function hide(id) {
    console.log("Intentando ocultar el elemento con ID:", id);
    var element = document.getElementById(id);
    if(element) {
        element.style.display = 'none';
        document.body.classList.remove('overlayActive');
    } else {
        console.error("Elemento con ID:", id, "no encontrado");
    }
}

    
function changeProfileImage(imgSrc, id) {
    document.getElementById('foto').src = imgSrc;

    var element = document.getElementById(id);
    if(element) {
        element.style.display = 'none';
        document.body.classList.remove('overlayActive');
    } else {
        console.error("Elemento con ID:", id, "no encontrado");
    }

}