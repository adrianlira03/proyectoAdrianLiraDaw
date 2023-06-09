const token = localStorage.getItem('token');

function hacerPeticion(url, metodo) {
  const mostrarUsuario = document.getElementById('mostrarUsuario');


  const options = {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      const usuario = data.data;

      const resultadoHtml = generarHTML(usuario);

      mostrarUsuario.innerHTML = resultadoHtml;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function generarHTML(usuario) {
  let html = ``;
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
          <p class="lead"><strong>Correo electronico:</strong> ${usuario.correo} </p>
          <p class="lead"><strong>Teléfono:</strong> ${usuario.telefono} </p>
          <button type="submit" class="btn custom-btn-color" ><a id="guardarDatos" href="usuario-editar.html?id=${usuario.id}">Editar</a></button>
          <button type="submit" onclick="eliminar(${usuario.id})" class="btn custom-btn-color bg-danger border border-danger boton-eliminar"><a>Eliminar</a></button>
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
          <button type="submit" class="btn custom-btn-color" ><a id="guardarDatos" href="usuario-editar.html?id=${usuario.id}">Editar</a></button>
          <button type="submit" onclick="eliminar(${usuario.id})" class="btn custom-btn-color bg-danger border border-danger boton-eliminar"><a>Eliminar</a></button>
          
        </div>
      </div>
    `;
  }
  return html;
}

const urlParams = new URLSearchParams(window.location.search);
const usuarioId = urlParams.get('id');
var url = `http://127.0.0.1:8000/api/usuario/${usuarioId}`;
var metodo = 'GET';

if (usuarioId == null) {

  window.location.href = "profesores.html";
} else {

  hacerPeticion(url, metodo);


}


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

    const rol = usuario.rol;

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


hacerPeticion(url, metodo, datos);




function eliminar(idEliminar) {

  var confirmacion = confirm(" Este usuario puede tener candidaturas asignadas. ¿Estás seguro de que deseas eliminarlo todo? ");

  if (confirmacion) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`http://127.0.0.1:8000/api/usuario/${idEliminar}`, requestOptions)
      .then(response => response.text())
      .then(result => {

        window.location.href = "miPerfil.html"


      }
      )
      .catch(error => console.log('error', error));
  }
}


function verCurriculum() {
  const url = `http://localhost:8000/api/ver-curriculum/${usuarioId}`;
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