//MOSTRAR TODOS LOS ALUMNOS

var token = localStorage.getItem('token');

function hacerPeticion(url, metodo, datos) {
  const mostrarAlumnos = document.getElementById('mostrarAlumnos');


  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  const options = {
    method: metodo,
    headers: myHeaders
  };

  if (datos) {
    options.body = JSON.stringify(datos);
  }

  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      const alumnos = data.data;

      const resultadoHtml = generarHTML(alumnos);

      mostrarAlumnos.innerHTML = resultadoHtml;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function generarHTML(alumnos) {
  let html = '';

  alumnos.forEach(alumno => {
    const tarjetaHtml = `
      <div class="col mb-5">
    <a href="perfil.html?id=${alumno.id}" class="text-decoration-none enlace-alumno" onmouseover="cambiarImagen(this)" onmouseout="restaurarImagen(this)">
        <div class="card h-100">
            <!-- Product image-->
            <img src="assets/logo-alumno (2).png" alt="Imagen 1" class="imagen-alumno">
            <!-- Product details-->
            <div class="card-body p-4">
                <div class="text-center">
                    <!-- Product name-->
                    <h5 class="fw-bolder"> ${alumno.nombre}</h5>
                    <h5 class="fw-bolder"> ${alumno.apellidos}</h5>
                    <!-- Product price-->
                </div>
            </div>
            <!-- Product actions-->
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            </div>
        </div>
    </a>
</div>
      `;
    html += tarjetaHtml;
  });

  return html;
}

const url = 'http://127.0.0.1:8000/api/usuarios/1';
const metodo = 'GET';
const datos = null;

hacerPeticion(url, metodo, datos);


//CAMBIAR IMAGEN ALUMNO HOVER

function cambiarImagen(elemento) {
  var imagen = elemento.querySelector('.imagen-alumno');
  imagen.setAttribute("src", "assets/logo-alumno.png");
}

function restaurarImagen(elemento) {
  var imagen = elemento.querySelector('.imagen-alumno');
  imagen.setAttribute("src", "assets/logo-alumno (2).png");
}



var options = {
  method: "GET",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
};

fetch(url, options)
  .then(response => response.json())
  .then(data => {
    const usuario = data.data;

    var rol = usuario.rol;
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


var options = {
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
  });

function cerrarSesion() {

  localStorage.setItem("token", "");
  window.location.href = "../login/login.html";

}

if (localStorage.getItem("token") == "") {

  window.location.href = "../login/login.html";

}