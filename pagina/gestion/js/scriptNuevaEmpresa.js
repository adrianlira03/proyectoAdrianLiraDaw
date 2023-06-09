

function actualizarDatos() {

  const nombre = document.getElementById('empresa-nombre').value;
  const descripcion = document.getElementById('empresa-descripcion').value;



  const urlCrear = `http://127.0.0.1:8000/api/nuevaEmpresa`;

  var errorNombre = document.getElementById("error-nombre");
  var errorDescripcion = document.getElementById("error-descripcion");

  var errores = 0;

  errorNombre.textContent = "";
  errorDescripcion.textContent = "";

  if (nombre == "") {

    errorNombre.textContent = "Nombre introducido no es valido";
    errores = 1;

  }

  if (descripcion == "") {

    errorDescripcion.textContent = "Descripcion introducida no es valida";
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
      nombre: nombre,
      descripcion: descripcion

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
      var profesores = document.getElementById('Profesores');
      profesores.style.display = 'block';
      var empresas = document.getElementById('Empresas');
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