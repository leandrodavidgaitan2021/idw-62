const authToken = sessionStorage.getItem("authToken");
if (!authToken) {
  window.location.replace("login.html");
}

import { confirmarAccion } from "./alertas.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout");
  const bienvenida = document.getElementById("bienvenida");
  const usuarioLogueado = sessionStorage.getItem("usuario");

  if (bienvenida && usuarioLogueado) {
    bienvenida.textContent = `Bienvenido, ${usuarioLogueado}`;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const confirmado = await confirmarAccion({
        titulo: "¿Deseas cerrar la sesión?",
        texto: "Serás redirigido a la página principal.",
        icono: "question",
        textoConfirmar: "Sí, salir",
      });

      if (!confirmado) return;

      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("usuario");

      window.location.replace("index.html");
    });
  }
});