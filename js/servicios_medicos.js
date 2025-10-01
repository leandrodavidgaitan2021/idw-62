// js/servicios_medicos.js
import { Medico } from "./claseMedico.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Cargar especialidades y obras sociales primero
  await Medico.cargarDatosAuxiliares();

  // Sincronizar médicos
  const medicos = await Medico.sincronizarLocalStorage();

  const tbody = document.getElementById("medicosTableBody");

  // ================== RENDER TABLA ==================
  function renderTabla() {
    tbody.innerHTML = "";
    medicos.forEach((medico) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${medico.matricula}</td>
        <td>${medico.nombreCompleto()}</td>
        <td>${
          Medico.especialidades.find(
            (e) => e.id === parseInt(medico.especialidad)
          )?.nombre || ""
        }</td>
        <td>${medico.obrasSociales
          .map((id) => Medico.obrasSociales.find((o) => o.id === id)?.nombre)
          .join(", ")}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderTabla();

  // ================== NUEVO ==================
  const container = document.getElementById("obrasSocialesContainer");
  container.innerHTML = "";
  Medico.obrasSociales.forEach((obra) => {
    const div = document.createElement("div");
    div.className = "col-6 col-md-3 form-check";
    div.innerHTML = `
      <input class="form-check-input" type="checkbox" id="obraSocial${obra.id}" value="${obra.id}" />
      <label class="form-check-label" for="obraSocial${obra.id}">${obra.nombre}</label>
    `;
    container.appendChild(div);
  });

  const selectEspecialidad = document.getElementById("nuevoEspecialidad");
  selectEspecialidad.innerHTML = "";
  Medico.especialidades.forEach((esp) => {
    const option = document.createElement("option");
    option.value = esp.id;
    option.textContent = esp.nombre;
    selectEspecialidad.appendChild(option);
  });

  // Función para cargar selects de médicos
  function cargarSelectMedicos(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML =
      '<option value="" selected disabled>Seleccione un médico</option>';

    medicos.forEach((m) => {
      const option = document.createElement("option");
      option.value = m.id;
      option.textContent = `${m.nombreCompleto()} - ${m.getEspecialidadNombre()}`;
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
  const editarDescripcion = document.getElementById("editarDescripcion");
  const contenedorObrasSociales = document.getElementById(
    "editarObrasSocialesContainer"
  );

  // Rellenar select de especialidades
  editarEspecialidad.innerHTML = "";
  Medico.especialidades.forEach((esp) => {
    const option = document.createElement("option");
    option.value = esp.id;
    option.textContent = esp.nombre;
    editarEspecialidad.appendChild(option);
  });

  // Rellenar checkboxes de obras sociales
  contenedorObrasSociales.innerHTML = "";
  Medico.obrasSociales.forEach((obra) => {
    const div = document.createElement("div");
    div.className = "col-6 col-md-3 form-check";
    div.innerHTML = `
      <input class="form-check-input" type="checkbox" id="editarObra${obra.id}" value="${obra.id}" />
      <label class="form-check-label" for="editarObra${obra.id}">${obra.nombre}</label>
    `;
    contenedorObrasSociales.appendChild(div);
  });

  // Cuando se selecciona un médico
  document
    .getElementById("selectEditarMedico")
    .addEventListener("change", (e) => {
      const id = parseInt(e.target.value);
      if (!id) return; // no hace nada si no hay selección

      const medico = medicos.find((m) => m.id === id);
      if (!medico) return;

      editarMatricula.value = medico.matricula;
      editarApellido.value = medico.apellido;
      editarNombre.value = medico.nombre;
      editarEspecialidad.value = medico.especialidad;
      editarDescripcion.value = medico.descripcion;

      // Marcar checkboxes
      contenedorObrasSociales
        .querySelectorAll("input[type=checkbox]")
        .forEach((chk) => {
          chk.checked = medico.obrasSociales.includes(parseInt(chk.value));
        });
    });

  // Guardar cambios
  document.getElementById("btnGuardarEditar").addEventListener("click", () => {
    const id = parseInt(document.getElementById("selectEditarMedico").value);
    const medico = medicos.find((m) => m.id === id);
    if (!medico) return;

    const seleccionadasEditar = Array.from(
      contenedorObrasSociales.querySelectorAll("input[type=checkbox]:checked")
    ).map((chk) => parseInt(chk.value));

    medico.matricula = editarMatricula.value;
    medico.apellido = editarApellido.value;
    medico.nombre = editarNombre.value;
    medico.especialidad = parseInt(editarEspecialidad.value);
    medico.descripcion = editarDescripcion.value;
    medico.obrasSociales = seleccionadasEditar;

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
    const seleccionadas = Array.from(
      document.querySelectorAll(
        "#obrasSocialesContainer input[type=checkbox]:checked"
      )
    ).map((checkbox) => parseInt(checkbox.value));

    const nuevo = new Medico({
      id: Date.now(),
      matricula: document.getElementById("nuevoMatricula").value,
      apellido: document.getElementById("nuevoApellido").value,
      nombre: document.getElementById("nuevoNombre").value,
      especialidad: parseInt(
        document.getElementById("nuevoEspecialidad").value
      ),
      descripcion: document.getElementById("nuevoDescripcion").value,
      obrasSociales: seleccionadas,
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
