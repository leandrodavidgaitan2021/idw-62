// Usuarios de prueba (harcodeados)
const usuarios = [
  { username: "admin", password: "1234" },
  { username: "sofia", password: "abcd" },
];

const form = document.getElementById("loginForm");
const message = document.getElementById("message");

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

    // Mostrar alerta Bootstrap
    message.innerHTML = `
            <!-- Contenedor para alerts arriba a la derecha -->
            <div id="alert-container" class="position-fixed top-0 end-0 p-3" style="z-index: 1055;">
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    Bienvenido, <strong>${username}</strong>!
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
       
      `;

    // Redirigir a dashboard.html luego de 2 segundos
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 2000);
  } else {
    message.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          ❌ Usuario o contraseña incorrectos
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
  }
});
