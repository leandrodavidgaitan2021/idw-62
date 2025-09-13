document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogueado = localStorage.getItem("usuario");
  const logoutBtn = document.getElementById("logaut");
  const bienvenida = document.getElementById("bienvenida");

  // Si no hay usuario logueado → redirigir al login
  if (!usuarioLogueado) {
    window.location.href = "index.html";
    return;
  }

  // Mostrar "Bienvenido + usuario" en la navbar
  if (bienvenida) {
    bienvenida.textContent = `Bienvenido, ${usuarioLogueado}`;
  }

  // Logout
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
  });
});
