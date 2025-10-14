// js/servicios_medicos.js
import { Medico } from "./claseMedico.js";
import {
  configurarFiltros,
  actualizarEstadoBotonFiltros,
  renderizarOffcanvasFiltros,
} from "./filtrosMedicos.js";

import { confirmarAccion } from "./alertas.js";

document.addEventListener("DOMContentLoaded", async () => {
  // ================== CARGA INICIAL ==================
  const medicos = await Medico.cargarDatosIniciales();

  renderizarOffcanvasFiltros();
  // Inicializar filtros reutilizables
  configurarFiltros({
    lista: medicos,
    renderCallback: (filtrados) => renderTabla(filtrados),
  });

  actualizarEstadoBotonFiltros();

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

  function renderTabla(lista = medicos) {
    limpiarNodo(tbody);

    lista.forEach((medico) => {
      const tr = document.createElement("tr");

      const tdMatricula = document.createElement("td");
      tdMatricula.classList.add("d-none", "d-sm-table-cell", "fw-semibold");

      tdMatricula.textContent = medico.matricula;

      const tdNombre = document.createElement("td");
      tdNombre.classList.add("text-capitalize"); // Primera letra en mayúscula
      tdNombre.textContent = medico.nombreCompleto();

      const tdEspecialidad = document.createElement("td");
      tdEspecialidad.classList.add("text-secondary");
      tdEspecialidad.textContent = medico.getEspecialidadNombre();

      const tdObrasSociales = document.createElement("td");
      tdObrasSociales.classList.add("text-wrap"); // Permite salto de línea si es largo
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
    fotografia = "",
    valorConsulta = 0,
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
      medico.fotografia = fotografia;
      medico.valorConsulta = valorConsulta;
    } else {
      medico = new Medico({
        id: Date.now(),
        matricula,
        apellido,
        nombre,
        especialidad,
        descripcion,
        obrasSociales,
        fotografia,
        valorConsulta,
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

  // NUEVO MÉDICO
  document
    .getElementById("btnGuardarNuevo")
    .addEventListener("click", async () => {
      const form = document.getElementById("formNuevoMedico");

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const confirmado = await confirmarAccion({
        titulo: "¿Deseas guardar este médico?",
        texto: "Verifica que los datos sean correctos antes de continuar.",
        icono: "question",
        textoConfirmar: "Sí, guardar",
      });

      if (!confirmado) return; // si el usuario cancela, no hace nada

      const seleccionadas = Array.from(
        contenedorObrasSocialesNuevo.querySelectorAll(
          "input[type=checkbox]:checked"
        )
      ).map((chk) => parseInt(chk.value));

      // 📸 Obtener la foto en Base64
      let fotoBase64 = "";
      const fileInput = document.getElementById("nuevoFoto");
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fotoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        });
      }

      guardarMedico({
        matricula: document.getElementById("nuevoMatricula").value,
        apellido: document.getElementById("nuevoApellido").value,
        nombre: document.getElementById("nuevoNombre").value,
        especialidad: parseInt(
          document.getElementById("nuevoEspecialidad").value
        ),
        descripcion: document.getElementById("nuevoDescripcion").value,
        obrasSociales: seleccionadas,
        fotografia: fotoBase64,
        valorConsulta:
          parseInt(document.getElementById("nuevoValorConsulta").value) || 0,
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
      document.getElementById("editarValorConsulta").value =
        medico.valorConsulta || "";
    });

  // EDITAR MÉDICO - GUARDAR
  document
    .getElementById("btnGuardarEditar")
    .addEventListener("click", async () => {
      const confirmado = await confirmarAccion({
        titulo: "¿Deseas actualizar este médico?",
        texto: "Los cambios se guardarán permanentemente.",
        icono: "info",
        textoConfirmar: "Sí, actualizar",
      });

      if (!confirmado) return; // si el usuario cancela, no hace nada

      const id = parseInt(document.getElementById("selectEditarMedico").value);
      const seleccionadas = Array.from(
        contenedorObrasSocialesEditar.querySelectorAll(
          "input[type=checkbox]:checked"
        )
      ).map((chk) => parseInt(chk.value));

      // 📸 Foto en Base64
      let fotoBase64 = document.getElementById("previewEditarFoto").src;
      // si no cambiaron la foto, ya mantiene el valor anterior

      let valeConsulta = parseInt(
        document.getElementById("editarValorConsulta").value
      );
      if (isNaN(valeConsulta)) valeConsulta = 0;
      console.log({ valeConsulta });

      guardarMedico({
        id: id,
        matricula: document.getElementById("editarMatricula").value,
        apellido: document.getElementById("editarApellido").value,
        nombre: document.getElementById("editarNombre").value,
        especialidad: parseInt(editarEspecialidad.value),
        descripcion: document.getElementById("editarDescripcion").value,
        obrasSociales: seleccionadas,
        fotografia: fotoBase64,
        valorConsulta: valeConsulta,
      });

      bootstrap.Modal.getInstance(
        document.getElementById("modalEditarMedico")
      ).hide();
    });

  // ELIMINAR MÉDICO
  document
    .getElementById("btnEliminarMedico")
    .addEventListener("click", async () => {
      const id = parseInt(
        document.getElementById("selectEliminarMedico").value
      );
      if (isNaN(id)) return;

      const medico = medicos.find((m) => m.id === id);
      if (!medico) return;

      const confirmado = await confirmarAccion({
        titulo: "¿Eliminar médico?",
        texto: `¿Deseas eliminar a ${medico.apellido} ${medico.nombre}? Esta acción no se puede deshacer.`,
        icono: "warning",
        textoConfirmar: "Sí, eliminar",
      });

      if (!confirmado) return; // si cancela, no hace nada

      eliminarMedico(id);

      bootstrap.Modal.getInstance(
        document.getElementById("modalEliminarMedico")
      ).hide();
    });

  // ================== LIMPIAR MODALES ==================
  const modalNuevo = document.getElementById("modalNuevoMedico");
  const modalEditar = document.getElementById("modalEditarMedico");

  // Cuando se cierra el modal de Nuevo Médico
  modalNuevo.addEventListener("hidden.bs.modal", () => {
    const formNuevo = document.getElementById("formNuevoMedico");
    formNuevo.reset(); // limpia inputs y selects
    document.getElementById("previewNuevoFoto").src = ""; // limpia imagen
    contenedorObrasSocialesNuevo
      .querySelectorAll("input[type=checkbox]")
      .forEach((chk) => (chk.checked = false)); // desmarca todas
  });

  // Cuando se cierra el modal de Editar Médico
  modalEditar.addEventListener("hidden.bs.modal", () => {
    const formEditar = document.getElementById("formEditarMedico");
    formEditar.reset();
    document.getElementById("previewEditarFoto").src =
      "https://via.placeholder.com/120";
    contenedorObrasSocialesEditar
      .querySelectorAll("input[type=checkbox]")
      .forEach((chk) => (chk.checked = false));
    document.getElementById("selectEditarMedico").selectedIndex = 0;
  });
});
