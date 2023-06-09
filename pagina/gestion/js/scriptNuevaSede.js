
const urlParams = new URLSearchParams(window.location.search);
const idEmpresa = urlParams.get('id');


function actualizarDatos() {

  const direccion = document.getElementById('sede-direccion').value;
  const telefono = document.getElementById('sede-telefono').value;



  const urlCrear = `http://127.0.0.1:8000/api/nuevaSede`;

  var errorDireccion = document.getElementById("error-direccion");
  var errorTelefono = document.getElementById("error-telefono");

  errorDireccion.textContent = "";
  errorTelefono.textContent = "";

  var errores = 0;



  if (direccion == "") {

    errorDireccion.textContent = "Direccion introducida no es valida";
    errores = 1;

  }

  if (telefono == "") {

    errorTelefono.textContent = "Telefono introducido no es valido";
    errores = 1;

  }

  if (errores == 1) {

    return;
  }


  fetch(urlCrear, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      direccion: direccion,
      telefono: telefono,
      empresa_id: idEmpresa

    })
  })
    .then(response => response.json())
    .then(data => {

      window.location.replace(`empresas.html`);

    })
    .catch(error => {
      console.error('Error:', error);
    });

}




var token = localStorage.getItem("token");


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
    window.location.href = "../login/login.html";
  });



function cerrarSesion() {

  localStorage.setItem("token", "");
  window.location.href = "../login/login.html";

}

if (localStorage.getItem("token") == "") {

  window.location.href = "../login/login.html";

}