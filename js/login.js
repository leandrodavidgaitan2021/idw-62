// Usuarios de prueba (harcodeados)
const usuarios = [
  { username: "admin", password: "1234" },
  { username: "sofia", password: "abcd" },
];

const form = document.getElementById("loginForm");
const message = document.getElementById("message");

// Función para mostrar alertas Bootstrap (arriba a la derecha)
function showAlert(tipo, texto, autoClose = true) {
  message.innerHTML = `
    <div id="alert-container" class="position-fixed top-0 end-0 p-3" style="z-index: 1055;">
      <div id="autoAlert" class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${texto}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  `;

  // Si autoClose = true, cerramos la alerta a los 2s
  if (autoClose) {
    setTimeout(() => {
      const alert = document.getElementById("autoAlert");
      if (alert) {
        alert.classList.remove("show");
        alert.classList.add("fade");
        setTimeout(() => alert.remove(), 150);
      }
    }, 2000);
  }
}

// 🟢 Login
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const usuarioValido = usuarios.find(
    (u) => u.username === username && u.password === password
  );

  if (usuarioValido) {
    // Guardar usuario en localStorage
    localStorage.setItem("usuario", username);

    // Mostrar alerta de éxito (arriba a la derecha)
    showAlert("success", `Bienvenido, <strong>${username}</strong>!`);

    // Redirigir a dashboard.html luego de 2 segundos
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 2000);
  } else {
    // Mostrar alerta de error y cerrarla a los 2s
    showAlert("danger", "❌ Usuario o contraseña incorrectos");
  }
});
