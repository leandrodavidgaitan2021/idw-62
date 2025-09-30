// js/medicos.js
import { Medico } from "./claseMedico.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Sincronizar LocalStorage
  const medicos = await Medico.sincronizarLocalStorage();

  const tbody = document.getElementById("medicosTableBody");

  function renderTabla() {
    tbody.innerHTML = "";
    medicos.forEach((medico) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${medico.matricula}</td>
            <td>${medico.nombreCompleto()}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.obrasSociales.join(", ")}</td>
          `;
      tbody.appendChild(tr);
    });
  }

  renderTabla();

  // Rellenar selects
  function cargarSelectMedicos(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = "";
    medicos.forEach((m) => {
      const option = document.createElement("option");
      option.value = m.id;
      option.textContent = `${m.nombreCompleto()} - ${m.especialidad}`;
      select.appendChild(option);
    });
  }

  cargarSelectMedicos("selectEditarMedico");
  cargarSelectMedicos("selectEliminarMedico");

  // ================== EDITAR ==================
  const editarMatricula = document.getElementById("editarMatricula");
  const editarApellido = document.getElementById("editarApellido");
  const editarNombre = document.getElementById("editarNombre");
  const editarEspecialidad = document.getElementById("editarEspecialidad");
  const editarObrasSociales = document.getElementById("editarObrasSociales");

  document
    .getElementById("selectEditarMedico")
    .addEventListener("change", (e) => {
      const id = parseInt(e.target.value);
      const medico = medicos.find((m) => m.id === id);
      if (!medico) return;

      editarMatricula.value = medico.matricula;
      editarApellido.value = medico.apellido;
      editarNombre.value = medico.nombre;
      editarEspecialidad.value = medico.especialidad;
      editarObrasSociales.value = medico.obrasSociales.join(", ");
    });

  document.getElementById("btnGuardarEditar").addEventListener("click", () => {
    const id = parseInt(document.getElementById("selectEditarMedico").value);
    const medico = medicos.find((m) => m.id === id);
    if (!medico) return;

    medico.matricula = editarMatricula.value;
    medico.apellido = editarApellido.value;
    medico.nombre = editarNombre.value;
    medico.especialidad = editarEspecialidad.value;
    medico.obrasSociales = editarObrasSociales.value
      .split(",")
      .map((o) => o.trim());

    localStorage.setItem("medicos", JSON.stringify(medicos));
    renderTabla();
    cargarSelectMedicos("selectEditarMedico");
    cargarSelectMedicos("selectEliminarMedico");

    bootstrap.Modal.getInstance(
      document.getElementById("modalEditarMedico")
    ).hide();
  });

  // ================== NUEVO ==================
  document.getElementById("btnGuardarNuevo").addEventListener("click", () => {
    const nuevo = new Medico({
      id: Date.now(),
      matricula: document.getElementById("nuevoMatricula").value,
      apellido: document.getElementById("nuevoApellido").value,
      nombre: document.getElementById("nuevoNombre").value,
      especialidad: document.getElementById("nuevoEspecialidad").value,
      obrasSociales: document
        .getElementById("nuevoObrasSociales")
        .value.split(",")
        .map((o) => o.trim()),
    });

    medicos.push(nuevo);
    localStorage.setItem("medicos", JSON.stringify(medicos));
    renderTabla();
    cargarSelectMedicos("selectEditarMedico");
    cargarSelectMedicos("selectEliminarMedico");

    bootstrap.Modal.getInstance(
      document.getElementById("modalNuevoMedico")
    ).hide();
    document.getElementById("formNuevoMedico").reset();
  });

  // ================== ELIMINAR ==================
  document.getElementById("btnEliminarMedico").addEventListener("click", () => {
    const id = parseInt(document.getElementById("selectEliminarMedico").value);
    const index = medicos.findIndex((m) => m.id === id);
    if (index === -1) return;

    medicos.splice(index, 1);
    localStorage.setItem("medicos", JSON.stringify(medicos));
    renderTabla();
    cargarSelectMedicos("selectEditarMedico");
    cargarSelectMedicos("selectEliminarMedico");

    bootstrap.Modal.getInstance(
      document.getElementById("modalEliminarMedico")
    ).hide();
  });
});
