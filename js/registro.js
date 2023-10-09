
async function post(inputID, inputNombreusuario, inputcontrasena, inputnombre, inputapellido, inputtelefono, inputcorreo, inputfecha, inputTipo){
    return await fetch('http://localhost:8080/crear-usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ID: inputID,
            tipo: inputTipo,
            NUsario: inputNombreusuario,
            contrasena: inputcontrasena,
            nombre: inputnombre,
            apellido: inputapellido,
            telefeono: inputtelefono,
            correo: inputcorreo,
            fecha: inputfecha
        })
    })
}

const promesa = post()

promesa
    .then(res => {
        console.log(res.ok)
        
        if(res.ok)
        {
            $(this).unbind('submit').submit(); // Desvincula el evento 'submit' y luego envía el formulario
        }
        else
        {
            $('.msg').text('El nombre de usuario ya existe');
            showAlert();
        }

        res.json()
    })
    .then(data => {
        console.log(data)
        variable = data
    })
    .catch(() => {
        console.log('error')
    })
    

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
        const yearMinimo =2005;

        var inputID = $('#ID').val();
        var inputNombreusuario = $('#Nombreusuario').val();
        var inputcontrasena = $('#contrasena').val();
        var inputnombre = $('#nombre').val();
        var inputapellido = $('#apellido').val();
        var inputtelefono = $('#telefono').val();
        var inputcorreo = $('#correo').val();
        var regex = /@javeriana\.edu\.co$/;
        var inputfecha= $('#fecha').val();
        var year = parseInt(inputfecha.split('-')[0]);    // Split the date string at '-' and take the first part

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
        else if(year > yearMinimo) 
        {
            console.log("menor de 18");
            isValid = false;
            $('.msg').text('Debe ser mayor de 18 años');
            showAlert();
        }

        if(isValid) {
            $(this).unbind('submit').submit(); /*ESTO SE QUITA*/
            post(inputID, inputNombreusuario, inputcontrasena, inputnombre, inputapellido, inputtelefono, inputcorreo, inputfecha, tipo);
        }
    });
});

