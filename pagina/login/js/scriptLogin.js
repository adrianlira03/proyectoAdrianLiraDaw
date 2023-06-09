document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  validar();
});

function validar() {
  var dni = document.getElementById('dniInput').value;
  var password = document.getElementById('contraseñaInput').value;
  var mostrarErrorDni = document.getElementById("errorDni");
  mostrarErrorDni.textContent = "";
  var mostrarErrorContraseña = document.getElementById("errorContraseña");
  mostrarErrorContraseña.textContent = "";
  var errores = "";

  var requestOptions = {
    method: 'POST',
    redirect: 'follow'
  };

  fetch("http://127.0.0.1:8000/api/dni/" + dni)
    .then(response => {
      if (!response.ok) {
        throw new Error("DNI incorrecto");

      }
    })
    .catch(error => {
      mostrarErrorDni.textContent = "DNI introducido incorrecto";
      errores = "DNI incorrecto";
    })

    .then(() => {

      if (errores === "") {

        fetch("http://127.0.0.1:8000/api/login?dni=" + dni + "&password=" + password, requestOptions)
          .then(response => {
            if (!response.ok) {
              throw new Error("Error en al iniciar sesion");
            }
            return response.json();

          })
          .then(result => {
            const token = result.token;
            localStorage.setItem('token', token);

            var fechaHoraActual = new Date();
            localStorage.setItem('fechaHora', fechaHoraActual);
            window.location.href = "../gestion/miPerfil.html";

          })
          .catch(error => {
            mostrarErrorContraseña.textContent = "Contraseña incorrecta";
          });
      }
    });
}