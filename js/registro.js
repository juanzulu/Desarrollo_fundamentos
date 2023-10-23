
async function post(usuarioId, nombreusuario, inputcontrasena, inputnombre, inputapellido, inputtelefono, inputcorreo, edad, tipo){
    return await fetch('http://localhost:8080/usuario/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
        (
            {
                idjaveriana: usuarioId,
                tipousuario: tipo,
                nombreusuario: nombreusuario,
                contrasena: inputcontrasena,
                nombre: inputnombre,
                apellido: inputapellido,
                telefono: inputtelefono,
                correoinstitucional: inputcorreo,
                edad: edad
            }
        )
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
        const edadMin =13;

        var inputID = $('#ID').val();
        var inputNombreusuario = $('#Nombreusuario').val();
        var inputcontrasena = $('#contrasena').val();
        var inputnombre = $('#nombre').val();
        var inputapellido = $('#apellido').val();
        var inputtelefono = $('#telefono').val();
        var inputcorreo = $('#correo').val();
        var regex = /@javeriana\.edu\.co$/;
        var inputfecha= $('#fecha').val();

        // Convertir la fecha del input en un objeto Date
        var fechaNacimiento = new Date(inputfecha);

        // Obtener la fecha actual
        var fechaActual = new Date();

        // Restar los años
        var edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

        // Ajustar si el cumpleaños de este año todavía no ha ocurrido
        if (fechaActual.getMonth() < fechaNacimiento.getMonth() ||
        (fechaActual.getMonth() === fechaNacimiento.getMonth() && fechaActual.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }

        var tipo;

        if($('#Tipo').is(':checked')) {
            tipo="domiciliario";
        } else {
            tipo="cliente";
        }
        //evaluar si es un numero
        if(isNaN(inputID) || inputID.trim() === "") 
        {
            console.log("ID is not a number");
            isValid = false;
            $('.msg').text('El ID solo debe contener números');
            showAlert();
        }
        else if(inputNombreusuario.trim() === "") {
            console.log("El input está vacío");
            isValid = false;
            $('.msg').text('Usuario no puede estar vacío');
            showAlert();
        }
        else if(inputcontrasena.trim() === "") {
            console.log("El input está vacío");
            isValid = false;
            $('.msg').text('Contraseña no puede estar vacía');
            showAlert();
        }
        else if(inputnombre.trim() === "") {
            console.log("El input está vacío");
            isValid = false;
            $('.msg').text('Nombre no puede estar vacío');
            showAlert();
        }
        else if(inputapellido.trim() === "") {
            console.log("El input está vacío");
            isValid = false;
            $('.msg').text('Apellido no puede estar vacío');
            showAlert();
        }
        else if(isNaN(inputtelefono) || inputtelefono.trim() === "") 
        {
            console.log("telefono is a number");
            isValid = false;
            $('.msg').text('Teléfono solo debe tener numeros');
            showAlert();
        }
        else if(!regex.test(inputcorreo) || inputcorreo.trim() === "") {
            console.log("The email doesnt end with @javeriana.edu.co");
            isValid = false;
            $('.msg').text('Correo no pertenerce a la universidad Javeriana');
            showAlert();
        }
        else if(edad < edadMin) 
        {
            console.log("menor de 13");
            isValid = false;
            $('.msg').text('Debe ser mayor de 18 años');
            showAlert();
        }

        if(isValid) {
            
            const promesa =  post(inputID, inputNombreusuario, inputcontrasena, inputnombre, inputapellido, inputtelefono, inputcorreo, edad, tipo);

            promesa
                .then(res => {
                    if (res.ok) 
                    {
                        $('.msg').text('Cuenta creada satisfactoriamente');
                        showAlert();
                    }
                    else
                    {
                        $('.msg').text(`Existe un error en la información`);
                        showAlert();
                    }
                })
                .then(data => {
                    console.log(data)
                    //interpretar valores
                })
                .catch(() => {
                    $('.msg').text('El nombre de usuario ya existe o usted ya existe en el sistema');
                    showAlert();
                    console.log('error')
                })
                
        }
    });
});

