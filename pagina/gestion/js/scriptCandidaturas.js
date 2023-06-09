var token = localStorage.getItem('token');
const options = {
  method: "GET",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
};

var rol;

var url = 'http://127.0.0.1:8000/api/miperfil';

fetch(url, options)
  .then(response => response.json())
  .then(data => {
    const usuario = data.data;

    rol = usuario.rol;


    if (rol === 2) {
      const alumnos = document.getElementById('Alumnos');
      alumnos.style.display = 'block';
      const profesores = document.getElementById('Profesores');
      profesores.style.display = 'block';
      const empresas = document.getElementById('Empresas');
      empresas.style.display = 'block';
      const nuevaCandidatura = document.getElementById('nuevaCandidatura');
      nuevaCandidatura.style.display = 'block';

    }

  })
  .catch(error => {
    console.error('Error:', error);
    window.location.href = "../login/login.html";
  });


function hacerPeticion(url, metodo, datos) {
  const mostrarCandidaturas = document.getElementById('mostrarCandidaturas');


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
      const candidaturas = data.data;

      const resultadoHtml = generarHTML(candidaturas);

      mostrarCandidaturas.innerHTML = resultadoHtml;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function generarHTML(candidaturas) {
  let html = '';

  candidaturas.forEach(candidatura => {
    const filaHtml = `
    <tr>
      <td>${candidatura.user.nombre} ${candidatura.user.apellidos}</td>
      <td>${candidatura.user.dni}</td>
      <td>${candidatura.empresa.nombre}</td>
      <td>${candidatura.estado}</td>
      ${rol == 2 ? `<td><a href="candidaturasEditar.html?id=${candidatura.id}">&#128395;</a></td>` : ''}
    </tr>
    `;
    html += filaHtml;
  });

  return html;
}

var url = 'http://127.0.0.1:8000/api/candidaturas';
const metodo = 'GET';
const datos = null;

hacerPeticion(url, metodo, datos);



function cerrarSesion() {

  localStorage.setItem("token", "");
  window.location.href = "../login/login.html";

}

if (localStorage.getItem("token") == "") {

  window.location.href = "../login/login.html";

}