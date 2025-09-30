// js/index_medicos.js
import { Medico } from "./claseMedico.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Esto ya se encarga de sincronizar JSON y LocalStorage
  const medicos = await Medico.sincronizarLocalStorage();

  // Renderizar tarjetas en el HTML
  const contenedor = document.querySelector(".row.g-4.justify-content-center");
  contenedor.innerHTML = ""; // Limpiar tarjetas previas

  if (medicos.length === 0) {
    contenedor.innerHTML = "No hay medicos para mostrar"; // Mensaje si no hay médicos
  } else {
    medicos.forEach((medico) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

      col.innerHTML = `
    <!-- Tarjeta de Médico Matricula: ${medico.matricula} -->
      <div class="card text-center h-100 shadow-sm border-0">
        <img
          src="${medico.fotografia || "https://via.placeholder.com/120"}"
          class="card-img-top rounded-circle mx-auto mt-4"
          alt="Foto de ${medico.nombreCompleto()}"
          style="width: 120px; height: 120px; object-fit: cover"
        />
        <div class="card-body">
          <h5 class="card-title fs-4">${medico.nombreCompleto()}</h5>
          <p class="card-text fs-6">Especialidad: ${medico.especialidad}</p>
          <p class="card-text">
            <small class="text-muted">Obra Social: ${medico.obrasSociales.join(
              ", "
            )}</small>
          </p>
        </div>
      </div>
    `;

      contenedor.appendChild(col);
    });
  }
});
