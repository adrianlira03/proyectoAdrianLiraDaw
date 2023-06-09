


function actualizarDatos() {
  
  const nombre = document.getElementById('usuario-nombre').value;
  const apellidos = document.getElementById('usuario-apellidos').value;
  const dni = document.getElementById('usuario-dni').value;
  const correo = document.getElementById('usuario-correo').value;
  const telefono = document.getElementById('usuario-telefono').value;
  const contraseña= document.getElementById('usuario-contraseña').value;


 
  const urlCrear = `http://127.0.0.1:8000/api/register`;

  var errorNombre=document.getElementById("error-usuario-nombre");
  var errorApellidos=document.getElementById("error-usuario-apellidos");
  var errorDni=document.getElementById("error-usuario-dni");
  var errorCorreo=document.getElementById("error-usuario-correo");
  var errorTelefono=document.getElementById("error-usuario-telefono");
  var errorContraseña=document.getElementById("error-usuario-contraseña");

  var errores=0;

  errorNombre.textContent="";
  errorApellidos.textContent="";
  errorDni.textContent="";
  errorCorreo.textContent="";
  errorTelefono.textContent="";
  errorContraseña.textContent="";

  if(nombre==""){

    errorNombre.textContent="Nombre introducido no es valido";
    errores=1;

  }
  
  if(apellidos==""){

    errorApellidos.textContent="Apellidos introducidos no son validos";
    errores=1;

  }
  
  if(!/^[0-9]{8}[A-Za-z]$/.test(dni)){

    errorDni.textContent="DNI introducido no es valido";
    errores=1;
  }

  if(!/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(correo)){

    errorCorreo.textContent="Correo electrónico introducido no es valido";
    errores=1;

  }

  if(contarDigitos(telefono)!=9){

    errorTelefono.textContent="Telefono introducido no es valido";
    errores=1;

  }

  if(contarDigitos(contraseña)<5 || contraseña==""){

    errorContraseña.textContent="Contraseña introducida no es valida debe tener 5 caracteres mínimo";
    errores=1;

  }
  
  if(errores==1){

    return;
  }

   
  fetch(urlCrear, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: nombre,
      apellidos: apellidos,
      rol: 2,
      password: contraseña,
      dni: dni,
      correo: correo,
      telefono: telefono
     
    })
  })
    .then(response => response.json())
    .then(data => {
      
      window.location.replace(`profesores.html`);
      
    })
    .catch(error => {
      console.error('Error:', error);
      errorDni.textContent="DNI introducido ya existe";
    });

}




function contarDigitos(numero) {
  var numeroStr = numero.toString();

  var longitud = numeroStr.length;

  return longitud;
}


var token=localStorage.getItem("token");


const options = {
  method: "GET",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
  }
};

fetch('http://127.0.0.1:8000/api/miperfil', options)
  .then(response => response.json())
  .then(data => {
    const usuario = data.data;

    var rol = usuario.rol;

    if (rol === 2) {
      var alumnos = document.getElementById('Alumnos');
      alumnos.style.display = 'block';
      const profesores = document.getElementById('Profesores');
        profesores.style.display = 'block';
        const empresas = document.getElementById('Empresas');
        empresas.style.display = 'block';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    window.location.href="../login/login.html";
  });

 
  
  function cerrarSesion(){

    localStorage.setItem("token", "");
    window.location.href="../login/login.html";
  
  }
  
  if(localStorage.getItem("token")==""){
  
    window.location.href="../login/login.html";
  
  }