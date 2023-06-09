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
      const empresas = data.data;

      const html = generarHTML(empresas);

      mostrarEmpresas.innerHTML = html;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function generarHTML(empresas) {
  let html = '';

  empresas.forEach(empresa => {
    const nombre = empresa.nombre;
    const descripcion = empresa.descripcion;
    const id = empresa.id;

    let sedesHtml = '';
    empresa.sedes.forEach((sede, index) => {
      const direccion = sede.direccion;
      var idSede = sede.id;
      const telefono = sede.telefono;
      sedesHtml += `
        <h5>Sede ${index + 1}</h5>
        <p><strong>Dirección:</strong> ${direccion}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <button type="submit" class="btn custom-btn-color  mb-4 mt-4 boton-empresa" ><a id="guardarDatos" href="sedesEditar.html?id=${idSede}">Editar sede</a></button>
      `;
    });

    html += `
      <div class="col mb-5 div-empresa">
        <div class="card h-100">
          <div class="card-body p-4">
            <div class="text-center d-flex">
              <div class="div-icono-empresa">
                <img src="assets/icono-empresa.png" class="icono-empresa" alt="">
              </div>
              <div class="div-contenido-empresa">
                <h2 class="fw-bolder text-uppercase">${nombre}</h2>
                <h5 style="text-align: left;">${descripcion}</h5>
                <button type="submit" class="btn custom-btn-color" ><a id="guardarDatos" href="empresasEditar.html?id=${id}">Editar Empresa</a></button>
                <div class="div-contenido-sedes">
                  ${sedesHtml}
                </div>
              </div>
            </div>
            <button type="submit" class="btn custom-btn-color" ><a id="guardarDatos" href="nuevaSede.html?id=${id}">Nueva sede</a></button>
          </div>
        </div>
      </div>
    `;
  });

  return html;
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



const url = 'http://127.0.0.1:8000/api/empresas';
const metodo = 'GET';

hacerPeticion(url, metodo);


function cerrarSesion() {

  localStorage.setItem("token", "");
  window.location.href = "../login/login.html";

}

if (localStorage.getItem("token") == "") {

  window.location.href = "../login/login.html";

}