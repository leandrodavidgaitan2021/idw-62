// Redirección inmediata si no hay sesión
const usuarioLogueado = sessionStorage.getItem("usuario");
if (!usuarioLogueado) {
  window.location.replace("index.html"); // más rápido que location.href
}

import { confirmarAccion } from "./alertas.js";

// Esperar solo si hay usuario
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout");
  const bienvenida = document.getElementById("bienvenida");

  // Mostrar "Bienvenido + usuario" en la navbar
  if (bienvenida) {
    bienvenida.textContent = `Bienvenido, ${usuarioLogueado}`;
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const confirmado = await confirmarAccion({
        titulo: "¿Deseas salir del sistema?",
        texto: "Saliendo del sistema.",
        icono: "question",
        textoConfirmar: "Sí, salir",
      });

      if (!confirmado) return; // Si no confirma, no hace logout

      sessionStorage.removeItem("usuario");
      window.location.replace("index.html"); // reemplaza sin dejar historial
    });
  }
});
