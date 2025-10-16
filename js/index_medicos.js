// js/index_medicos.js
import { Medico } from "./claseMedico.js";
import {
  configurarFiltros,
  actualizarEstadoBotonFiltros,
  renderizarOffcanvasFiltros,
} from "./filtrosMedicos.js";

document.addEventListener("DOMContentLoaded", async () => {
  const medicos = await Medico.cargarDatosIniciales();
  console.log("Médicos cargados:", medicos);

  renderizarMedicos(medicos);
  renderizarOffcanvasFiltros();

  // Inicializar filtros reutilizables
  configurarFiltros({
    lista: medicos,
    renderCallback: renderizarMedicos,
  });

  actualizarEstadoBotonFiltros();
});

function renderizarMedicos(lista) {
  const contenedor = document.querySelector(".row.g-4.justify-content-center");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML =
      '<p class="text-center text-muted mt-4">No hay médicos para mostrar</p>';
    return;
  }

  lista.forEach((medico) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

    const card = document.createElement("div");
    card.className = "card text-center h-100 shadow-sm border-0";

    const img = document.createElement("img");
    img.src = medico.fotografia || "https://via.placeholder.com/120";
    img.alt = `Foto de ${medico.nombreCompleto()}`;
    img.className = "card-img-top rounded-circle mx-auto mt-4";
    img.style.width = "120px";
    img.style.height = "120px";
    img.style.objectFit = "cover";

    const body = document.createElement("div");
    body.className = "card-body";

    const h5 = document.createElement("h5");
    h5.className = "card-title fs-4";
    h5.textContent = medico.nombreCompleto();

    const especialidad = document.createElement("p");
    especialidad.className = "card-text fs-6";
    especialidad.textContent = `Especialidad: ${medico.getEspecialidadNombre()}`;

    const obras = document.createElement("p");
    obras.className = "card-text";
    const small = document.createElement("small");
    small.className = "text-muted";

    const obrasText = medico.getObrasSocialesNombres();
    small.textContent = obrasText
      ? `Obras Sociales : ${obrasText}`
      : "Consultas Privadas";

    obras.appendChild(small);

    body.append(h5, especialidad, obras);
    card.append(img, body);
    col.append(card);
    contenedor.append(col);
  });
}
