
async function post(inputNombreusuario, inputcontrasena, inputTipo){
    return await fetch('http://localhost:8080/ingreso', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tipo: inputTipo,
            NUsario: inputNombreusuario,
            contrasena: inputcontrasena
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
            $(this).unbind('submit').submit(); /*ESTO SE QUITA*/
            const promesa=post(inputNombreusuario, inputcontrasena, inputTipo);

            promesa
                .then(res => {
                    console.log(res.ok)
                    res.json().then(data => {
                        sessionStorage.setItem('idUsuario', data.id); //GUARDAR EL ID DEL USUARIO EN EL LOCAL STORAGE
                        sessionStorage.setItem('fotoPerfil', data.avatar);    //PEDIR EL AVATAR Y GUARDARLO EN EL LOCAL STORAGE
                    })
                
                    $(this).unbind('submit').submit(); // Desvincula el evento 'submit' y luego envía el formulario
                    
                    
                })
                .catch(() => {
                    $('.msg').text('Existe un error en la información');
                    showAlert();
                    console.log('error')
                })
        }
    });
});

