// Usuarios de prueba (hardcodeados)
const usuarios = [
  { username: "admin", password: "1234" },
  { username: "sofia", password: "abcd" },
];

const form = document.getElementById("loginForm");
const message = document.getElementById("message");

// Función para mostrar alertas Bootstrap (arriba a la derecha)
function showAlert(tipo, texto, autoClose = true) {
  // Eliminar alerta previa (si existe)
  const prevContainer = document.getElementById("alert-container");
  if (prevContainer) prevContainer.remove();

  // Crear contenedor principal
  const container = document.createElement("div");
  container.id = "alert-container";
  container.className = "position-fixed top-0 end-0 p-3";
  container.style.zIndex = "1055";

  // Crear alerta
  const alertDiv = document.createElement("div");
  alertDiv.id = "autoAlert";
  alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
  alertDiv.setAttribute("role", "alert");

  // Contenido de la alerta (texto + botón)
  const span = document.createElement("span");
  span.innerHTML = texto; // Permitimos HTML aquí solo para el <strong>

  const btnClose = document.createElement("button");
  btnClose.type = "button";
  btnClose.className = "btn-close";
  btnClose.setAttribute("data-bs-dismiss", "alert");
  btnClose.setAttribute("aria-label", "Close");

  // Estructura final
  alertDiv.appendChild(span);
  alertDiv.appendChild(btnClose);
  container.appendChild(alertDiv);
  message.appendChild(container);

  // Cierre automático
  if (autoClose) {
    setTimeout(() => {
      alertDiv.classList.remove("show");
      alertDiv.classList.add("fade");
      setTimeout(() => alertDiv.remove(), 150);
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
    // Guardar usuario en sessionStorage
    sessionStorage.setItem("usuario", username);

    // Mostrar alerta de éxito
    showAlert("success", `Bienvenido, <strong>${username}</strong>!`);

    // Redirigir a dashboard.html luego de 2 segundos
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 2000);
  } else {
    // Mostrar alerta de error
    showAlert("danger", "❌ Usuario o contraseña incorrectos");
  }
});
