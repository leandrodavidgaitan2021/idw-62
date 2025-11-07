// js/servicios_medicos.js

import { Medico } from "./claseMedico.js";

import {
  configurarFiltros,
  actualizarEstadoBotonFiltros,
  renderizarOffcanvasFiltros,
} from "./filtrosMedicos.js";

import { confirmarAccion } from "./alertas.js";
import { modalNuevoMedico, modalEditarMedico } from "./modalesMedicos.js";

// ====== Insertar modales al DOM ======
document.body.insertAdjacentHTML("beforeend", modalNuevoMedico);
document.body.insertAdjacentHTML("beforeend", modalEditarMedico);

document.addEventListener("DOMContentLoaded", async () => {
  // ================== CARGA INICIAL ==================
  let medicos = await Medico.cargarDatosIniciales();

  renderizarOffcanvasFiltros();

  configurarFiltros({
    lista: medicos,
    renderCallback: (filtrados) => renderTabla(filtrados),
  });

  actualizarEstadoBotonFiltros();

  // ================== ELEMENTOS DOM ==================
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

    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay médicos registrados.</td></tr>`;
      return;
    }

    lista.forEach((m) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="fw-semibold d-none d-sm-table-cell">${m.matricula}</td>
        <td class="text-capitalize">${m.nombreCompleto()}</td>
        <td class="text-secondary">${m.getEspecialidadNombre()}</td>
        <td class="text-wrap d-none d-sm-table-cell">${
          m.getObrasSocialesNombres() || "Consultas Privadas"
        }</td>
        <td class="text-center">
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-warning btn-sm btn-editar" data-id="${m.id}">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${
              m.id
            }">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
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
  document.getElementById("btnNuevoMedico").addEventListener("click", () => {
    new bootstrap.Modal("#modalNuevoMedico").show();
  });

  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    const medico = medicos.find((m) => m.id === id);
    if (!medico) return;

    if (btn.classList.contains("btn-eliminar")) {
      const confirmado = await confirmarAccion({
        titulo: `¿Eliminar al Dr. ${medico.nombreCompleto()}?`,
        texto: "Esta acción no se puede deshacer.",
        icono: "warning",
        textoConfirmar: "Sí, eliminar",
      });
      if (!confirmado) return;
      Medico.eliminarMedico(medico.id);
      medicos = Medico.obtenerMedicos();
      renderTabla(medicos);
    }

    if (btn.classList.contains("btn-editar")) {
      abrirModalEditarMedico(medico);
    }
  });

  // ====== VISTA PREVIA FOTO ======
  const vistaPrevia = (inputId, imgId) => {
    document.getElementById(inputId).addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          document.getElementById(imgId).src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  };

  vistaPrevia("nuevoFoto", "previewNuevoFoto");
  vistaPrevia("editarFoto", "previewEditarFoto");

  // ====== GUARDAR NUEVO MÉDICO ======
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
      if (!confirmado) return;

      const seleccionadas = Array.from(
        contenedorObrasSocialesNuevo.querySelectorAll("input:checked")
      ).map((chk) => parseInt(chk.value));

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

      const nuevo = new Medico({
        matricula: parseInt(document.getElementById("nuevoMatricula").value),
        apellido: document.getElementById("nuevoApellido").value,
        nombre: document.getElementById("nuevoNombre").value,
        especialidad: parseInt(
          document.getElementById("nuevoEspecialidad").value
        ),
        descripcion: document.getElementById("nuevoDescripcion").value,
        obrasSociales: seleccionadas,
        fotografia: fotoBase64,
        valorConsulta:
          parseFloat(document.getElementById("nuevoValorConsulta").value) || 0,
      });

      nuevo.guardarMedico();
      medicos = Medico.obtenerMedicos();
      renderTabla(medicos);
      bootstrap.Modal.getInstance(
        document.getElementById("modalNuevoMedico")
      ).hide();
      form.reset();
    });

  // ====== EDITAR MÉDICO ======
  document
    .getElementById("btnGuardarEditar")
    .addEventListener("click", async () => {
      const confirmado = await confirmarAccion({
        titulo: "¿Deseas actualizar este médico?",
        texto: "Los cambios se guardarán permanentemente.",
        icono: "info",
        textoConfirmar: "Sí, actualizar",
      });
      if (!confirmado) return;

      const id = parseInt(document.getElementById("editarId").value);
      const medico = medicos.find((m) => m.id === id);
      if (!medico) return;

      const seleccionadas = Array.from(
        contenedorObrasSocialesEditar.querySelectorAll("input:checked")
      ).map((chk) => parseInt(chk.value));

      medico.matricula = parseInt(
        document.getElementById("editarMatricula").value
      );
      medico.apellido = document.getElementById("editarApellido").value;
      medico.nombre = document.getElementById("editarNombre").value;
      medico.especialidad = parseInt(editarEspecialidad.value);
      medico.descripcion = document.getElementById("editarDescripcion").value;
      medico.valorConsulta =
        parseFloat(document.getElementById("editarValorConsulta").value) || 0;
      medico.obrasSociales = seleccionadas;
      medico.fotografia = document.getElementById("previewEditarFoto").src;

      medico.guardarMedico();
      renderTabla(medicos);
      bootstrap.Modal.getInstance(
        document.getElementById("modalEditarMedico")
      ).hide();
    });

  function abrirModalEditarMedico(medico) {
    document.getElementById("editarMatricula").value = medico.matricula;
    document.getElementById("editarApellido").value = medico.apellido;
    document.getElementById("editarNombre").value = medico.nombre;
    document.getElementById("editarDescripcion").value = medico.descripcion;
    document.getElementById("editarValorConsulta").value = medico.valorConsulta;
    editarEspecialidad.value = medico.especialidad;
    document
      .querySelectorAll("#editarObrasSocialesContainer input")
      .forEach((chk) => {
        chk.checked = medico.obrasSociales.includes(parseInt(chk.value));
      });
    document.getElementById("previewEditarFoto").src = medico.fotografia || "";
    new bootstrap.Modal("#modalEditarMedico").show();
  }

  // ====== LIMPIAR MODALES ======
  const modalNuevo = document.getElementById("modalNuevoMedico");
  const modalEditar = document.getElementById("modalEditarMedico");

  modalNuevo.addEventListener("hidden.bs.modal", () => {
    const formNuevo = document.getElementById("formNuevoMedico");
    formNuevo.reset();
    document.getElementById("previewNuevoFoto").src = "";
    contenedorObrasSocialesNuevo
      .querySelectorAll("input")
      .forEach((chk) => (chk.checked = false));
  });

  modalEditar.addEventListener("hidden.bs.modal", () => {
    const formEditar = document.getElementById("formEditarMedico");
    formEditar.reset();
    document.getElementById("previewEditarFoto").src =
      "https://via.placeholder.com/120";
    contenedorObrasSocialesEditar
      .querySelectorAll("input")
      .forEach((chk) => (chk.checked = false));
  });
});
