// js/servicios_especialidades.js

import { Especialidad } from "./claseEspecialidad.js";
import { confirmarAccion } from "./alertas.js";
import {
  modalNuevaEspecialidad,
  modalEditarEspecialidad,
  modalEliminarEspecialidad,
} from "./modalesEspecialidades.js";

// Clave de almacenamiento local que usa turnos.js
const LS_KEY_ESPECIALIDADES = 'especialidades';

// Insertar los modales al final del body (ESTO SIEMPRE DEBE EJECUTARSE)
document.body.insertAdjacentHTML("beforeend", modalNuevaEspecialidad);
document.body.insertAdjacentHTML("beforeend", modalEditarEspecialidad);
document.body.insertAdjacentHTML("beforeend", modalEliminarEspecialidad);

let especialidades = [];

document.addEventListener("DOMContentLoaded", async () => {
  // ================== 1. CARGA INICIAL (GLOBAL) ==================
  // Razón: Esto siempre debe ejecutarse para asegurar que los datos estén en LS
  // para otras páginas (como turnos.js).
  especialidades = await Especialidad.cargarDatosInicialesEsp();


  // ===================================================
  // 2. LÓGICA ESPECÍFICA DE LA PÁGINA especialidades.html
  // ===================================================

  // Razón: Verificamos si la tabla principal de la página de especialidades existe.
  const tbody = document.getElementById("especialidadesTableBody");

  if (tbody) {
    // Razón: Si existe el <tbody>, definimos todas las referencias DOM, 
    // funciones y listeners que lo utilizan.

    const selectEditar = document.getElementById("selectEditarEsp");
    const selectEliminar = document.getElementById("selectEliminarEsp");
    const formNuevaEsp = document.getElementById("formNuevaEsp");
    const modalNuevo = document.getElementById("modalNuevaEsp");
    const modalEditar = document.getElementById("modalEditarEsp");
    const modalEliminar = document.getElementById("modalEliminarEsp");
    
    // Razón: Función auxiliar para evitar errores de null
    function limpiarNodo(nodo) {
      if (!nodo) return; 
      while (nodo.firstChild) nodo.removeChild(nodo.firstChild);
    }

    // Razón: Funciones de Renderizado (Dependientes de 'tbody')
    function renderTablaEsp(lista = especialidades) {
      limpiarNodo(tbody);

      lista.forEach((esp) => {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.classList.add("fw-semibold");
        tdId.textContent = esp.id;

        const tdNombre = document.createElement("td");
        tdNombre.classList.add("text-capitalize");
        tdNombre.textContent = esp.nombre;

        tr.append(tdId, tdNombre);
        tbody.appendChild(tr);
      });
    }

    function renderSelect(select, items) {
      limpiarNodo(select);

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.textContent = "Seleccione una especialidad";
      select.appendChild(defaultOption);

      items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = `${item.id} - ${item.nombre}`;
        select.appendChild(option);
      });
    }

    function cargarSelectEspecialidades(selectId) {
      const select = document.getElementById(selectId);
      if (select) {
        renderSelect(select, especialidades);
      }
    }

    // Razón: Funciones CRUD
    function guardarEspecialidad({ id = null, nombre }) {
      let especialidad;
      let esNuevo = id === null;

      if (!esNuevo) {
        especialidad = especialidades.find((e) => e.id === id);
        if (!especialidad) {
          console.error(`Especialidad con Id${id} no encontrada para editar`);
          return;
        }
        especialidad.nombre = nombre;
      } else {
        especialidad = new Especialidad({
          id: null,
          nombre,
        });
        especialidades.push(especialidad);
      }

      especialidad.guardarEspecialidad();

      localStorage.setItem(LS_KEY_ESPECIALIDADES, JSON.stringify(especialidades));

      renderTablaEsp();
      cargarSelectEspecialidades("selectEditarEsp");
      cargarSelectEspecialidades("selectEliminarEsp");
    }

    function eliminarEspecialidad(id) {
      const index = especialidades.findIndex((e) => e.id === id);
      if (index === -1) return;

      Especialidad.eliminarEspecialidad(id);
      especialidades.splice(index, 1);

      localStorage.setItem(LS_KEY_ESPECIALIDADES, JSON.stringify(especialidades));

      renderTablaEsp();
      cargarSelectEspecialidades("selectEditarEsp");
      cargarSelectEspecialidades("selectEliminarEsp");
    }

    // ================== RENDER INICIAL ==================
    renderTablaEsp();
    cargarSelectEspecialidades("selectEditarEsp");
    cargarSelectEspecialidades("selectEliminarEsp");

    // ================== EVENTOS (Solo si tbody existe) ==================

    // NUEVA ESPECIALIDAD
    document
      .getElementById("btnGuardarNuevaEsp")
      .addEventListener("click", async () => {
        const form = document.getElementById("formNuevaEsp");
        const inputNombre = document.getElementById("nuevaEsp");

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const confirmado = await confirmarAccion({
          titulo: "¿Deseas guardar esta especialidad",
          texto: "Verifica que los datos sean correctos antes de continuar.",
          icono: "question",
          textoConfirmar: "Sí, guardar",
        });

        if (!confirmado) return;

        guardarEspecialidad({
          nombre: inputNombre.value,
        });

        bootstrap.Modal.getInstance(modalNuevo).hide();
        form.reset();
      });

    // EDITAR ESPECIALIDAD - CARGAR DATOS
    selectEditar.addEventListener("change", (e) => {
      const id = parseInt(e.target.value);
      const especialidad = especialidades.find((e) => e.id === id);
      if (!especialidad) return;

      document.getElementById("editarNombreEsp").value = especialidad.nombre;
    });

    // EDITAR ESPECIALIDAD - GUARDAR
    document
      .getElementById("btnGuardarEditarEsp")
      .addEventListener("click", async () => {
        const id = parseInt(selectEditar.value);

        if (isNaN(id)) return;

        const confirmado = await confirmarAccion({
          titulo: "¿Deseas actualizar esta especialidad?",
          texto: "Los cambios se guardarán permanentemente.",
          icono: "info",
          textoConfirmar: "Sí, actualizar",
        });

        if (!confirmado) return;

        guardarEspecialidad({
          id: id,
          nombre: document.getElementById("editarNombreEsp").value,
        });

        bootstrap.Modal.getInstance(modalEditar).hide();
      });

    // ELIMINAR ESPECIALIDAD
    document
      .getElementById("btnEliminarEsp")
      .addEventListener("click", async () => {
        const id = parseInt(selectEliminar.value);
        if (isNaN(id)) return;

        const especialidad = especialidades.find((e) => e.id === id);
        if (!especialidad) return;

        const confirmado = await confirmarAccion({
          titulo: "¿Eliminar especialidad?",
          texto: `¿Deseas eliminar a ${especialidad.nombre}? Esta acción no se puede deshacer.`,
          icono: "warning",
          textoConfirmar: "Sí, eliminar",
        });

        if (!confirmado) return;

        eliminarEspecialidad(id);

        bootstrap.Modal.getInstance(modalEliminar).hide();
      });

    // ================== LIMPIAR MODALES ==================

    // Cuando se cierra el modal de Nueva Especialidad
    modalNuevo.addEventListener("hidden.bs.modal", () => {
      formNuevaEsp.reset(); // limpia inputs y selects
    });

    // Cuando se cierra el modal de Editar Especialidad
    modalEditar.addEventListener("hidden.bs.modal", () => {
      document.getElementById("formEditarEsp").reset();
      selectEditar.selectedIndex = 0;
    });
  } // <-- FIN del if (tbody)
});