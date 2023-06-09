const urlParams = new URLSearchParams(window.location.search);
const idCandidaturas = urlParams.get('id');
var idUsuario;

function hacerPeticion(url, metodo, datos) {
  const mostrarCandidaturas = document.getElementById('mostrarCandidaturas');
  var token = localStorage.getItem('token');

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
      const candidatura = data.data;

      const resultadoHtml = generarHTML(candidatura);

      mostrarCandidaturas.innerHTML = resultadoHtml;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function generarHTML(candidatura) {
  const estados = ['Pendiente', 'Pendiente de entrevista', 'Entrevistado', 'Aceptado', 'No aceptado'];

  const optionsHtml = estados.map(estado => {
    if (estado === candidatura.estado) {
      return `<option value="${estado}" selected>${estado}</option>`;
    } else {
      return `<option value="${estado}">${estado}</option>`;
    }
  }).join('');

  idUsuario = candidatura.user.id;

  const filaHtml = `
    <tr>
      <td>${candidatura.user.nombre}</td>
      <td>${candidatura.user.dni}</td>
      <td>${candidatura.empresa.nombre}</td>
      <td>
        <select style="background-color: #64987e8f; border: none; border-radius: 5px;" id="estadoSelect">
          ${optionsHtml}
        </select>
      </td>
        <button type="submit" class="btn custom-btn-color mt-5 mr-4" onclick="actualizarDatos()" id="guardarDatos">Guardar</button>&nbsp

        <button type="submit" onclick="eliminar(${candidatura.id})" class=" mt-5  btn custom-btn-color bg-danger border border-danger boton-eliminar"><a>Eliminar</a></button>
      
    </tr>
    <p id="error-estado" class="text-danger"></p>
  `;

  return filaHtml;
}

var token = localStorage.getItem("token");




async function actualizarDatos() {
  const estado = document.getElementById('estadoSelect').value;
  const errorEstado = document.getElementById("error-estado");
  errorEstado.textContent = "";
  let errores = 0;

  if (estado == 'Aceptado') {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/aceptada/' + idUsuario, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await response.json();

      if (data.data.length > 0) {
        errorEstado.textContent = "Este alumno ya tiene otra candidatura aceptada";
        errores = 1;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (errores == 1) {
    return;
  }

  if (errores == 0) {
    const urlActualizar = `http://127.0.0.1:8000/api/candidatura/${idCandidaturas}`;

    try {
      const response = await fetch(urlActualizar, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: estado
        })
      });
      const data = await response.json();

      window.location.replace(`candidaturas.html`);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}



var url = `http://127.0.0.1:8000/api/candidatura/${idCandidaturas}`;
const metodo = 'GET';
const datos = null;

hacerPeticion(url, metodo, datos);

function eliminar(idEliminar) {

  var confirmacion = confirm(" ¿Estás seguro de que deseas eliminar esta candidatura? ");

  if (confirmacion) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`http://127.0.0.1:8000/api/candidatura/${idEliminar}`, requestOptions)
      .then(response => response.text())
      .then(result => {

        window.location.href = "candidaturas.html"


      }
      )
      .catch(error => console.log('error', error));
  }
}

const options = {
  method: "GET",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
};

var url = 'http://127.0.0.1:8000/api/miperfil';

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

function cerrarSesion() {

  localStorage.setItem("token", "");
  window.location.href = "../login/login.html";

}

if (localStorage.getItem("token") == "") {

  window.location.href = "../login/login.html";

}