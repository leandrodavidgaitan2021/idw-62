import { Medico } from "./claseMedicos.js";

// Ejecutar carga de médicos desde JSON
document.addEventListener("DOMContentLoaded", async () => {
  const medicos = await Medico.cargarDesdeJSON();

  // Ejemplo: mostrar médicos en consola
  console.log("Médicos disponibles:", medicos);
  /*
  // Renderizar tarjetas en el HTML
  const contenedor = document.querySelector(".profesionales__lista");
  contenedor.innerHTML = ""; // limpiar contenido inicial

  medicos.forEach((medico) => {
    const card = document.createElement("div");
    card.classList.add("profesionales__tarjeta");

    card.innerHTML = `
      <div class="profesionales__imagen-contenedor">
        <img
          class="profesionales__imagen"
          src="${medico.fotografia}"
          alt="Foto de ${medico.nombreCompleto()}"
        />
      </div>
      <h3 class="profesionales__nombre">${medico.nombreCompleto()}</h3>
      <p class="profesionales__especialidad">
        Especialidad: ${medico.especialidad}
      </p>
      <p class="profesionales__obra-social">
        Obras Sociales: ${medico.obrasSociales.join(", ")}
      </p>
      <p class="profesionales__valor">
        Valor consulta: $${medico.valorConsulta}
      </p>
    `;

    contenedor.appendChild(card);

   
  });
   */
});
