// js/index_medicos.js
import { Medico } from "./claseMedico.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Cargar todo desde LocalStorage o JSON si está vacío
  const medicos = await Medico.cargarDatosIniciales();
  console.log(medicos);

  // Renderizar tarjetas en el HTML
  const contenedor = document.querySelector(".row.g-4.justify-content-center");
  contenedor.innerHTML = ""; // Limpiar tarjetas previas

  if (medicos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "No hay médicos para mostrar";
    contenedor.appendChild(mensaje);
  } else {
    medicos.forEach((medico) => {
      // Columna
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

      // Card
      const card = document.createElement("div");
      card.className = "card text-center h-100 shadow-sm border-0";

      // Imagen
      const img = document.createElement("img");
      img.src = medico.fotografia || "https://via.placeholder.com/120";
      img.alt = `Foto de ${medico.nombreCompleto()}`;
      img.className = "card-img-top rounded-circle mx-auto mt-4";
      img.style.width = "120px";
      img.style.height = "120px";
      img.style.objectFit = "cover";

      // Cuerpo de la tarjeta
      const body = document.createElement("div");
      body.className = "card-body";

      // Título
      const h5 = document.createElement("h5");
      h5.className = "card-title fs-4";
      h5.textContent = medico.nombreCompleto();

      // Especialidad
      const especialidad = document.createElement("p");
      especialidad.className = "card-text fs-6";
      especialidad.textContent = `Especialidad: ${medico.getEspecialidadNombre()}`;

      // Obras sociales
      const obras = document.createElement("p");
      obras.className = "card-text";
      const small = document.createElement("small");
      small.className = "text-muted";
      small.textContent = `Obras Sociales: ${medico.getObrasSocialesNombres()}`;
      obras.appendChild(small);

      // Armar estructura
      body.appendChild(h5);
      body.appendChild(especialidad);
      body.appendChild(obras);

      card.appendChild(img);
      card.appendChild(body);
      col.appendChild(card);
      contenedor.appendChild(col);
    });
  }
});
