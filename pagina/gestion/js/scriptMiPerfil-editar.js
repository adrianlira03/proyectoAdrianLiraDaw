var idUsuario;

var token = localStorage.getItem('token');

function hacerPeticion(url, metodo) {
  const mostrarUsuario = document.getElementById('mostrarUsuario');

  var token = localStorage.getItem('token');

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  const options = {
    method: metodo,
    headers: myHeaders
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      const usuario = data.data;

      const { html, rol } = generarHTML(usuario);

      mostrarUsuario.innerHTML = html;



      if (rol === 2) {
        const alumnos = document.getElementById('Alumnos');
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
}


function generarHTML(usuario) {
  let html = '';
  var rol = usuario.rol;

  idUsuario = usuario.id;


  if (usuario.rol == 2) {
    html = `
      <div class="row gx-4 gx-lg-5 align-items-center" id="mostrarUsuario">
        <div class="col-md-6">
          <img class="card-img-top mb-5 mb-md-0" src="assets/logo-profesor.png" alt="..." />
        </div>
        <div class="col-md-6">
        <h1 class="display-5 fw-bolder">Nombre</h1>
        <input type="text" id="usuario-nombre" class="form-control form-control-lg mb-4" value="${usuario.nombre}">
        <p id="error-usuario-nombre" class="text-danger"> </p>
        <h1 class="display-5 fw-bolder">Apellidos</h1>
        <input type="text" id="usuario-apellidos" class="form-control form-control-lg mb-4" value="${usuario.apellidos}">
        <p id="error-usuario-apellidos" class="text-danger"> </p>
          <br>
          <p class="lead"><strong class="fw-bold">DNI</strong></p>
          <input type="text" id="usuario-dni" class="form-control form-control-lg mb-4" value="${usuario.dni}">
          <p id="error-usuario-dni" class="text-danger"> </p>
          <p class="lead "><strong class="fw-bold">Correo electronico</strong></p>
          <input type="text" id="usuario-correo" class="form-control form-control-lg mb-4" value="${usuario.correo}">
          <p id="error-usuario-correo" class="text-danger"> </p>
          <p class="lead"><strong class="fw-bold">Teléfono</strong></p>
          <input type="text" id="usuario-telefono" class="form-control form-control-lg mb-4" value="${usuario.telefono}">
          <p id="error-usuario-telefono" class="text-danger"> </p>
          <button type="submit" class="btn custom-btn-color" onclick="actualizarDatos()" id="guardarDatos">Guardar</button>
        </div>
      </div>
    `;
  } else {
    html = `
      <div class="row gx-4 gx-lg-5 align-items-center" id="mostrarUsuario">
        <div class="col-md-6">
          <img class="card-img-top mb-5 mb-md-0  imagen-alumno-perfil" src="assets/logo-alumno-3.png" alt="..." />
        </div>
        <div class="col-md-6">
        <h1 class="display-5 fw-bolder">Nombre</h1>
        <input type="text" id="usuario-nombre" class="form-control form-control-lg mb-4" value="${usuario.nombre}">
        <p id="error-usuario-nombre" class="text-danger"></p>
        <h1 class="display-5 fw-bolder">Apellidos</h1>
        <input type="text" id="usuario-apellidos" class="form-control form-control-lg mb-4" value="${usuario.apellidos}">
        <p id="error-usuario-apellidos" class="text-danger"></p>
          <br>
          <p class="lead" ><strong class="fw-bold">DNI</strong></p>
          <input type="text" id="usuario-dni" class="form-control form-control-lg mb-4" value="${usuario.dni}">
          <p id="error-usuario-dni" class="text-danger"></p>
          <p class="lead "><strong class="fw-bold">Correo electronico</strong></p>
          <input type="text" id="usuario-correo" class="form-control form-control-lg mb-4" value="${usuario.correo}">
          <p id="error-usuario-correo" class="text-danger"> </p>
          <p class="lead"><strong class="fw-bold">Teléfono</strong></p>
          <input type="text" id="usuario-telefono" class="form-control form-control-lg mb-4" value="${usuario.telefono}">
          <p id="error-usuario-telefono" class="text-danger"></p>
          <div class="col-md-12">
          <h2 class="display-6 fw-bolder" style="font-size:19px;">Subir currículum</h2>
          <input type="file" id="inputCurriculum" accept=".pdf">
          <button type="button" style="background-color: #009452; border-color: #009452;" onclick="subirCurriculum()" class="btn btn-primary">Subir</button>
        </div>
          <button type="submit" class="btn custom-btn-color" onclick="actualizarDatos()" id="guardarDatos">Guardar</button>
        </div>
      </div>
    `;
  }

  return { html, rol };
}


const url = `http://127.0.0.1:8000/api/miperfil`;
const metodo = 'GET';

hacerPeticion(url, metodo);


function actualizarDatos() {

  var token = localStorage.getItem("token");
  const nombre = document.getElementById('usuario-nombre').value;
  const apellidos = document.getElementById('usuario-apellidos').value;
  const dni = document.getElementById('usuario-dni').value;
  const correo = document.getElementById('usuario-correo').value;
  const telefono = document.getElementById('usuario-telefono').value;


  const urlActualizar = `http://127.0.0.1:8000/api/usuario/${idUsuario}`;

  var errorNombre = document.getElementById("error-usuario-nombre");
  var errorApellidos = document.getElementById("error-usuario-apellidos");
  var errorDni = document.getElementById("error-usuario-dni");
  var errorCorreo = document.getElementById("error-usuario-correo");
  var errorTelefono = document.getElementById("error-usuario-telefono");

  var errores = 0;

  errorNombre.textContent = "";
  errorApellidos.textContent = "";
  errorDni.textContent = "";
  errorCorreo.textContent = "";
  errorTelefono.textContent = "";

  if (nombre == "") {

    errorNombre.textContent = "Nombre introducido no es valido";
    errores = 1;

  }

  if (apellidos == "") {

    errorApellidos.textContent = "Apellidos introducidos no son validos";
    errores = 1;

  }

  if (!/^[0-9]{8}[A-Za-z]$/.test(dni)) {

    errorDni.textContent = "DNI introducido no es valido";
    errores = 1;
  }

  if (!/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(correo)) {

    errorCorreo.textContent = "Correo electrónico introducido no es valido";
    errores = 1;

  }

  if (contarDigitos(telefono) != 9) {

    errorTelefono.textContent = "Telefono introducido no es valido";
    errores = 1;

  }

  if (errores == 1) {

    return;
  }


  fetch(urlActualizar, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: nombre,
      apellidos: apellidos,
      dni: dni,
      correo: correo,
      telefono: telefono
    })
  })
    .then(response => response.json())
    .then(data => {

      window.location.replace("miPerfil.html");

    })
    .catch(error => {
      console.error('Error:', error);

      errorDni.textContent = "DNI introducido ya existe";
    });

}


function contarDigitos(numero) {
  var numeroStr = numero.toString();

  var longitud = numeroStr.length;

  return longitud;
}

function subirCurriculum() {
  const url = `http://localhost:8000/api/subir-curriculum/1`;
  const inputCurriculum = document.getElementById('inputCurriculum');

  const formData = new FormData();
  formData.append('curriculum', inputCurriculum.files[0]);

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      alert("Curriculum subido correctamente.")
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function cerrarSesion() {

  localStorage.setItem("token", "");
  window.location.href = "../login/login.html";

}

if (localStorage.getItem("token") == "") {

  window.location.href = "../login/login.html";

}