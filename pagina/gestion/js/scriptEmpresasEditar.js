const urlParams = new URLSearchParams(window.location.search);
  const idEmpresa = urlParams.get('id');
  var i=0;


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
  const nombre = empresa.nombre;
  const descripcion = empresa.descripcion;
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
              <h2 class="fw-bolder text-uppercase">Nombre</h2>
              <input type="text" id="empresa-nombre" class="form-control form-control-lg mb-4" value="${nombre}">
              <p id="error-nombre" class="text-danger"> </p>
              <h2 class="fw-bolder text-uppercase">Descripcion</h2>
              <input type="text" id="empresa-descripcion" class="form-control form-control-lg mb-4" value="${descripcion}">
              <p id="error-descripcion" class="text-danger"> </p>
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

const url = `http://127.0.0.1:8000/api/empresa/${idEmpresa}`;
const metodo = 'GET';

hacerPeticion(url, metodo);

function actualizarDatos() {
  
var token=localStorage.getItem("token");
  const nombre = document.getElementById('empresa-nombre').value;
  const descripcion= document.getElementById('empresa-descripcion').value;
  var errores=0;
  

  const urlActualizar = `http://127.0.0.1:8000/api/empresa/${idEmpresa}`;

  var errorNombre=document.getElementById("error-nombre");
  var errorDescripcion=document.getElementById("error-descripcion");

  errorNombre.textContent="";
  errorDescripcion.textContent="";

  
  if(nombre==""){

    errorNombre.textContent="Nombre introducido no es valido";
    errores=1;

  }
  
  if(descripcion==""){

    errorDescripcion.textContent="Descripcion introducida no es valida";
    errores=1;

  }
  
  
  if(errores==1){

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
    window.location.href="../login/login.html";
  });


  function eliminar(idEliminar){

    var confirmacion = confirm(" Esta empresa puede tener sedes asignadas. ¿Estás seguro de que deseas eliminarlo todo? ");

  if (confirmacion) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`http://127.0.0.1:8000/api/empresa/${idEliminar}`, requestOptions)
      .then(response => response.text())
      .then(result =>  {

          window.location.href = "empresas.html"

      
      }
        )
      .catch(error => console.log('error', error));
  } 
}


function cerrarSesion(){

  localStorage.setItem("token", "");
  window.location.href="../login/login.html";

}

if(localStorage.getItem("token")==""){

  window.location.href="../login/login.html";

}