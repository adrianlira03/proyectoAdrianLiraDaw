const urlParams = new URLSearchParams(window.location.search);
const idSede = urlParams.get('id');
var i = 0;


function hacerPeticion(url, metodo) {
  const mostrarEmpresas = document.getElementById('mostrarEmpresas');

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
      const empresa = data.data;

      const html = generarHTML(empresa);

      mostrarEmpresas.innerHTML = html;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function generarHTML(empresa) {

  const direccion = empresa.direccion;
  const telefono = empresa.telefono;
  const id = empresa.id;



  const html = `
    <div class="col mb-5 div-empresa">
      <div class="card h-100">
        <div class="card-body p-4">
          <div class="text-center d-flex">
            <div class="div-icono-empresa">
              <img src="assets/icono-empresa.png" class="icono-empresa" alt="">
            </div>
            <div class="div-contenido-empresa">
              <h2 class="fw-bolder">Dirección</h2>
              <input type="text" id="sede-direccion" class="form-control form-control-lg mb-4" value="${direccion}">
              <p id="error-direccion" class="text-danger"> </p>
              <h2 class="fw-bolder ">Teléfono</h2>
              <input type="text" id="sede-telefono" class="form-control form-control-lg mb-4" value="${telefono}">
              <p id="error-telefono" class="text-danger"> </p>
              <div class="div-contenido-sedes">
              </div>
              <button type="submit" class="btn custom-btn-color" onclick="actualizarDatos()" id="guardarDatos">Guardar</button>
              <button type="submit" onclick="eliminar(${id})" class="btn custom-btn-color bg-danger border border-danger boton-eliminar"><a>Eliminar</a></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return html;
}

const url = `http://127.0.0.1:8000/api/sede/${idSede}`;
const metodo = 'GET';

hacerPeticion(url, metodo);

function actualizarDatos() {

  var token = localStorage.getItem("token");
  const direccion = document.getElementById('sede-direccion').value;
  const telefono = document.getElementById('sede-telefono').value;
  var errores = 0;


  const urlActualizar = `http://127.0.0.1:8000/api/sede/${idSede}`;

  var errorDireccion = document.getElementById("error-direccion");
  var errorTelefono = document.getElementById("error-telefono");

  errorDireccion.textContent = "";
  errorTelefono.textContent = "";


  if (direccion == "") {

    errorDireccion.textContent = "Direccion introducida no es valida";
    errores = 1;

  }

  if (telefono == "" || contarDigitos(telefono) != 9 || !isNumber(telefono)) {

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
      direccion: direccion,
      telefono: telefono
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


var token = localStorage.getItem('token');

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer " + token);

const options = {
  method: 'GET',
  headers: myHeaders
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

function eliminar(idEliminar) {

  var confirmacion = confirm(" ¿Estás seguro de que deseas eliminar esta sede? ");

  if (confirmacion) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`http://127.0.0.1:8000/api/sede/${idEliminar}`, requestOptions)
      .then(response => response.text())
      .then(result => {

        window.location.href = "empresas.html"


      }
      )
      .catch(error => console.log('error', error));
  }
}


function cerrarSesion() {

  localStorage.setItem("token", "");
  window.location.href = "../login/login.html";

}

if (localStorage.getItem("token") == "") {

  window.location.href = "../login/login.html";

}

function contarDigitos(numero) {
  var numeroStr = numero.toString();

  var longitud = numeroStr.length;

  return longitud;
}

function isNumber(value) {
  return !isNaN(value);
}