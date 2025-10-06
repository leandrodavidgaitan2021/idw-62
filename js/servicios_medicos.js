// js/servicios_medicos.js
import { Medico } from "./claseMedico.js";

document.addEventListener("DOMContentLoaded", async () => {
  // ================== CARGA INICIAL ==================
  const medicos = await Medico.cargarDatosIniciales();

  const tbody = document.getElementById("medicosTableBody");
  const contenedorObrasSocialesNuevo = document.getElementById(
    "obrasSocialesContainer"
  );
  const selectEspecialidadNuevo = document.getElementById("nuevoEspecialidad");
  const contenedorObrasSocialesEditar = document.getElementById(
    "editarObrasSocialesContainer"
  );
  const editarEspecialidad = document.getElementById("editarEspecialidad");

  // ================== FUNCIONES AUXILIARES ==================

  function limpiarNodo(nodo) {
    while (nodo.firstChild) nodo.removeChild(nodo.firstChild);
  }

  function renderTabla() {
    limpiarNodo(tbody);

    medicos.forEach((medico) => {
      const tr = document.createElement("tr");

      const tdMatricula = document.createElement("td");
      tdMatricula.textContent = medico.matricula;

      const tdNombre = document.createElement("td");
      tdNombre.textContent = medico.nombreCompleto();

      const tdEspecialidad = document.createElement("td");
      tdEspecialidad.textContent = medico.getEspecialidadNombre();

      const tdObrasSociales = document.createElement("td");
      tdObrasSociales.textContent = medico.getObrasSocialesNombres();

      tr.append(tdMatricula, tdNombre, tdEspecialidad, tdObrasSociales);
      tbody.appendChild(tr);
    });
  }

  function renderCheckboxes(container, items, prefix = "") {
    limpiarNodo(container);
    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "col-6 col-md-3 form-check";

      const input = document.createElement("input");
      input.className = "form-check-input";
      input.type = "checkbox";
      input.id = `${prefix}${item.id}`;
      input.value = item.id;

      const label = document.createElement("label");
      label.className = "form-check-label";
      label.htmlFor = input.id;
      label.textContent = item.nombre;

      div.append(input, label);
      container.appendChild(div);
    });
  }

  function renderSelect(select, items, placeholder = "Seleccione") {
    limpiarNodo(select);

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = placeholder;
    select.appendChild(defaultOption);

    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.nombre;
      select.appendChild(option);
    });
  }

  function cargarSelectMedicos(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    limpiarNodo(select);

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Seleccione un médico";
    select.appendChild(defaultOption);

    medicos.forEach((m) => {
      const option = document.createElement("option");
      option.value = m.id;
      option.textContent = `${m.nombreCompleto()} - ${m.getEspecialidadNombre()}`;
      select.appendChild(option);
    });
  }

  function guardarMedico({
    id = null,
    matricula,
    apellido,
    nombre,
    especialidad,
    descripcion,
    obrasSociales,
  }) {
    let medico;

    if (id) {
      medico = medicos.find((m) => m.id === id);
      if (!medico) return;

      medico.matricula = matricula;
      medico.apellido = apellido;
      medico.nombre = nombre;
      medico.especialidad = especialidad;
      medico.descripcion = descripcion;
      medico.obrasSociales = obrasSociales;
    } else {
      medico = new Medico({
        id: Date.now(),
        matricula,
        apellido,
        nombre,
        especialidad,
        descripcion,
        obrasSociales,
      });
      medicos.push(medico);
    }

    medico.guardarMedico();
    renderTabla();
    cargarSelectMedicos("selectEditarMedico");
    cargarSelectMedicos("selectEliminarMedico");
  }

  function eliminarMedico(id) {
    const index = medicos.findIndex((m) => m.id === id);
    if (index === -1) return;

    Medico.eliminarMedico(medicos[index].id);
    medicos.splice(index, 1);
    renderTabla();
    cargarSelectMedicos("selectEditarMedico");
    cargarSelectMedicos("selectEliminarMedico");
  }

  // ================== RENDER INICIAL ==================
  renderTabla();
  renderCheckboxes(
    contenedorObrasSocialesNuevo,
    Medico.obrasSociales,
    "obraSocial"
  );
  renderCheckboxes(
    contenedorObrasSocialesEditar,
    Medico.obrasSociales,
    "editarObra"
  );
  renderSelect(selectEspecialidadNuevo, Medico.especialidades);
  renderSelect(editarEspecialidad, Medico.especialidades);
  cargarSelectMedicos("selectEditarMedico");
  cargarSelectMedicos("selectEliminarMedico");

  // ================== EVENTOS ==================

  // VISTA PREVIA FOTO - NUEVO MÉDICO
  document.getElementById("nuevoFoto").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        document.getElementById("previewNuevoFoto").src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // VISTA PREVIA FOTO - EDITAR MÉDICO
  document
    .getElementById("editarFoto")
    .addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          document.getElementById("previewEditarFoto").src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    
  // NUEVO MEDICO
  document.getElementById("btnGuardarNuevo").addEventListener("click", () => {
    const seleccionadas = Array.from(
      contenedorObrasSocialesNuevo.querySelectorAll(
        "input[type=checkbox]:checked"
      )
    ).map((chk) => parseInt(chk.value));

    guardarMedico({
      matricula: document.getElementById("nuevoMatricula").value,
      apellido: document.getElementById("nuevoApellido").value,
      nombre: document.getElementById("nuevoNombre").value,
      especialidad: parseInt(
        document.getElementById("nuevoEspecialidad").value
      ),
      descripcion: document.getElementById("nuevoDescripcion").value,
      obrasSociales: seleccionadas,
    });

    bootstrap.Modal.getInstance(
      document.getElementById("modalNuevoMedico")
    ).hide();
    document.getElementById("formNuevoMedico").reset();
  });

  // EDITAR MEDICO - CARGAR DATOS
  document
    .getElementById("selectEditarMedico")
    .addEventListener("change", (e) => {
      const id = parseInt(e.target.value);
      const medico = medicos.find((m) => m.id === id);
      if (!medico) return;

      document.getElementById("editarMatricula").value = medico.matricula;
      document.getElementById("editarApellido").value = medico.apellido;
      document.getElementById("editarNombre").value = medico.nombre;
      editarEspecialidad.value = medico.especialidad;
      document.getElementById("editarDescripcion").value = medico.descripcion;

      contenedorObrasSocialesEditar
        .querySelectorAll("input[type=checkbox]")
        .forEach((chk) => {
          chk.checked = medico.obrasSociales.includes(parseInt(chk.value));
        });
      document.getElementById("previewEditarFoto").src =
        medico.fotografia || "";
    });

  // EDITAR MEDICO - GUARDAR
  document.getElementById("btnGuardarEditar").addEventListener("click", () => {
    const id = parseInt(document.getElementById("selectEditarMedico").value);
    const seleccionadas = Array.from(
      contenedorObrasSocialesEditar.querySelectorAll(
        "input[type=checkbox]:checked"
      )
    ).map((chk) => parseInt(chk.value));

    guardarMedico({
      id,
      matricula: document.getElementById("editarMatricula").value,
      apellido: document.getElementById("editarApellido").value,
      nombre: document.getElementById("editarNombre").value,
      especialidad: parseInt(editarEspecialidad.value),
      descripcion: document.getElementById("editarDescripcion").value,
      obrasSociales: seleccionadas,
    });

    bootstrap.Modal.getInstance(
      document.getElementById("modalEditarMedico")
    ).hide();
  });

  // ELIMINAR MEDICO
  document.getElementById("btnEliminarMedico").addEventListener("click", () => {
    const id = parseInt(document.getElementById("selectEliminarMedico").value);
    eliminarMedico(id);
    bootstrap.Modal.getInstance(
      document.getElementById("modalEliminarMedico")
    ).hide();
  });
});
