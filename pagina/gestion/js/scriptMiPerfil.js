var token = localStorage.getItem('token');

function hacerPeticion(url, metodo) {
  const mostrarUsuario = document.getElementById('mostrarUsuario');


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
  if (usuario.rol == 2) {
    html = `
      <div class="row gx-4 gx-lg-5 align-items-center" id="mostrarUsuario">
        <div class="col-md-6">
          <img class="card-img-top mb-5 mb-md-0" src="assets/logo-profesor.png" alt="..." />
        </div>
        <div class="col-md-6">
          <h1 class="display-5 fw-bolder">${usuario.nombre}</h1>
          <h1 class="display-5 fw-bolder">${usuario.apellidos}</h1>
          <br>
          <p class="lead color-rol"><strong>Profesor</strong></p>
          <p class="lead"><strong>DNI:</strong> ${usuario.dni} </p>
          <p class="lead"><strong>Correo electronico:</strong> ${usuario.correo} </p>
          <p class="lead"><strong>Teléfono:</strong> ${usuario.telefono} </p>
          <button type="submit" class="btn custom-btn-color" ><a href="miPerfil-editar.html" id="guardarDatos">Editar</a></button>
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
          <h1 class="display-5 fw-bolder">${usuario.nombre}</h1>
          <h1 class="display-5 fw-bolder">${usuario.apellidos}</h1>
          <br>
          <p class="lead color-rol"><strong>Alumno</strong></p>
          <p class="lead"><strong class="fw-bold">DNI:</strong> ${usuario.dni} </p>
          <p class="lead "><strong class="fw-bold">Correo electronico:</strong> ${usuario.correo} </p>
          <p class="lead"><strong class="fw-bold">Teléfono:</strong> ${usuario.telefono} </p>
          ${usuario.curriculum ? '<p><button class="boton-sin-estilo" onclick="verCurriculum()">Ver currículum</button></p>' : ''}
          <button type="submit" class="btn custom-btn-color" ><a id="guardarDatos" href="miPerfil-editar.html">Editar</a></button>
        </div>
        
      </div>
    `;
  }

  return { html, rol };
}


const url = `http://127.0.0.1:8000/api/miperfil`;
const metodo = 'GET';

hacerPeticion(url, metodo);


function verCurriculum() {
  const url = `http://localhost:8000/api/ver-curriculum/0`;
  const token = localStorage.getItem('token');
  const options = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  fetch(url, options)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
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