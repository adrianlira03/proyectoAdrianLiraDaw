var token = localStorage.getItem('token');
function generarHTMLCrearCandidatura(token) {
  const usuariosUrl = 'http://127.0.0.1:8000/api/usuarios/1';
  const empresasUrl = 'http://127.0.0.1:8000/api/empresas';

  var usuariosHeaders = new Headers();
  usuariosHeaders.append("Authorization", "Bearer " + token);

  const usuariosOptions = {
    method: 'GET',
    headers: usuariosHeaders
  };

  const empresasHeaders = new Headers();
  empresasHeaders.append("Authorization", "Bearer " + token);

  const empresasOptions = {
    method: 'GET',
    headers: empresasHeaders
  };

  const promesaUsuarios = fetch(usuariosUrl, usuariosOptions)
    .then(response => response.json())
    .then(data => data.data);

  const promesaEmpresas = fetch(empresasUrl, empresasOptions)
    .then(response => response.json())
    .then(data => data.data);

  return Promise.all([promesaUsuarios, promesaEmpresas])
    .then(([usuarios, empresas]) => {
      const usuariosOptionsHtml = usuarios.map(usuario => {
        return `<option value="${usuario.id}">${usuario.nombre} ${usuario.apellidos}</option>`;
      }).join('');

      const empresasOptionsHtml = empresas.map(empresa => {
        return `<option value="${empresa.id}">${empresa.nombre}</option>`;
      }).join('');

      const filaHtml = `
        <tr>
          <td>
            <select id="selectUsuario" style="background-color: #64987e8f; border: none; border-radius: 5px;">
              <option value="">Seleccionar usuario</option>
              ${usuariosOptionsHtml}
            </select>
          </td>
        
          <td>
            <select id="selectEmpresa" style="background-color: #64987e8f; border: none; border-radius: 5px;">
              <option value="">Seleccionar empresa</option>
              ${empresasOptionsHtml}
            </select>
          </td>
          <td>
            <select id="selectEstado" style="background-color: #64987e8f; border: none; border-radius: 5px;">
              <option value="" selected>Seleccionar estado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Pendiente de entrevista">Pendiente de entrevista</option>
              <option value="Entrevistado">Entrevistado</option>
              <option value="Aceptado">Aceptado</option>
              <option value="No aceptado">No aceptado</option>
            </select>
          </td>
        </tr>
        <p id="error" class="text-danger"></p>
        <button type="submit" class="btn custom-btn-color" onclick="actualizarDatos()" id="guardarDatos">Guardar</button>
      `;

      return filaHtml;
    })
    .catch(error => {
      console.error('Error:', error);
      return '';
    });
}

function actualizarDatos() {

  const usuario = document.getElementById('selectUsuario').value;
  const empresa = document.getElementById('selectEmpresa').value;
  const estado = document.getElementById('selectEstado').value;



  const urlCrear = `http://127.0.0.1:8000/api/candidatura`;

  var errorGeneral = document.getElementById("error");

  var errores = 0;

  errorGeneral.textContent = "";


  if (usuario == "" || empresa == "" || estado == "") {

    errorGeneral.textContent = "Tienes que seleccionar todos los campos";
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
      user_id: usuario,
      empresa_id: empresa,
      estado: estado

    })
  })
    .then(response => response.json())
    .then(data => {

      window.location.replace(`candidaturas.html`);

    })
    .catch(error => {
      console.error('Error:', error);
    });

}


generarHTMLCrearCandidatura(token)
  .then(resultadoHtml => {
    const mostrarCrearCandidatura = document.getElementById('mostrarCandidaturas');
    mostrarCrearCandidatura.innerHTML = resultadoHtml;
  });

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