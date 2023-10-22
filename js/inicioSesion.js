
async function get(nombreUsuario, contrasena, tipousuario){
    return await fetch('http://localhost:8080/usuario/ingreso', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tipousuario: tipousuario,
            nombreusuario: nombreUsuario,
            contrasena: contrasena
        })
    })
}

$(document).ready(function() {
   
    function showAlert(){
        $('.alert').addClass("show");
        $('.alert').removeClass("hide");
        $('.alert').addClass("showAlert");
        setTimeout(function(){
            $('.alert').removeClass("show");
            $('.alert').addClass("hide");
        },10000);
    };

    $('.close-btn').click(function(){
        $('.alert').removeClass("show");
        $('.alert').addClass("hide");
    });


    $('.camposLlenar').on('submit', function(event) {
        event.preventDefault();  // This prevents the form from being submitted

        var isValid = true;  // Assume the form is valid to start\\

        var inputNombreusuario = $('#Nombreusuario').val();
        var inputcontrasena = $('#contrasena').val();
        var inputTipo;

        if($('#Tipo').is(':checked')) 
        {
            inputTipo="domiciliario";
        } 
        else {
            inputTipo="cliente";
        }
        
        if(isValid) 
        {
            const promesa=get(inputNombreusuario, inputcontrasena, inputTipo);

            promesa
                .then(res => {
                    console.log(res.ok)
                    if (res.ok) 
                    {
                        res.json().then(data => {
                            sessionStorage.setItem('idUsuario', data.id); //GUARDAR EL ID DEL USUARIO EN EL LOCAL STORAGE
                            sessionStorage.setItem('fotoPerfil', data.Foto.foto);    //PEDIR EL AVATAR Y GUARDARLO EN EL LOCAL STORAGE
                            // Desvincula el evento 'submit' y luego envía el formulario
                            window.location.href = "../html/MenuUsuario.html";
                        })
                    }
                    else
                    {
                        $('.msg').text(`Existe un error en la información`);
                        showAlert();
                    }
                     
                })
                .catch(error => {
                    $('.msg').text(`Existe un error en la información`);
                    showAlert();
                    console.log('error:', error);
                })
                
        }
    });
});

