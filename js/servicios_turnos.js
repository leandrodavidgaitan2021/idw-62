import { Turno } from "./claseTurno.js";
import { confirmarAccion } from "./alertas.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Cargar datos iniciales
  let turnos = await Turno.cargarDatosInicialesT();
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  const especialidades =
    JSON.parse(localStorage.getItem("especialidades")) || [];

  const fechaFiltro = document.getElementById("fechaFiltro");
  const btnFiltrar = document.getElementById("btnFiltrar");
  const btnTodosFiltrar = document.getElementById("btnTodosFiltrar");
  const btnHoyFiltrar = document.getElementById("btnHoyFiltrar");

  // ================= FILTRO POR FECHA ACTUAL =================
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const fechaActual = `${yyyy}-${mm}-${dd}`;

  fechaFiltro.value = fechaActual;

  // Filtrar automáticamente por fecha actual
  const turnosFiltradosHoy = filtrarTurnosPorFecha(turnos, fechaActual);
  renderizarTabla(turnosFiltradosHoy);

  // ================= BOTONES =================
  btnTodosFiltrar.addEventListener("click", () => {
    // Borrar filtro
    fechaFiltro.value = "";
    renderizarTabla(turnos);
  });

  btnFiltrar.addEventListener("click", () => {
    const fechaSeleccionada = fechaFiltro.value;
    const turnosFiltrados = filtrarTurnosPorFecha(turnos, fechaSeleccionada);
    renderizarTabla(turnosFiltrados);
  });

  btnHoyFiltrar.addEventListener("click", () => {
    fechaFiltro.value = fechaActual;

    // Filtrar automáticamente por fecha actual
    const turnosFiltradosHoy = filtrarTurnosPorFecha(turnos, fechaActual);
    renderizarTabla(turnosFiltradosHoy);
  });

  // NUEVO TURNO
  document.getElementById("btnNuevoTurno").addEventListener("click", () => {
    abrirModalTurno(null);
  });

  // EVENTOS DE TABLA (editar/eliminar)
  document
    .getElementById("turnosTableBody")
    .addEventListener("click", async (e) => {
      const id = parseInt(e.target.closest("button")?.dataset.id);
      if (!id) return;

      const turno = turnos.find((o) => o.id === id);

      // ELIMINAR
      if (e.target.closest(".btn-eliminar")) {
        const confirmado = await confirmarAccion({
          titulo: "¿Eliminar turno?",
          texto: "Esta acción no se puede deshacer.",
          icono: "warning",
          textoConfirmar: "Sí, eliminar",
        });
        if (!confirmado) return;

        // Guardamos la fecha del turno antes de eliminar
        const fechaTurno = turno.fechaHora.split("T")[0];

        Turno.eliminarTurno(id);
        turnos = Turno.obtenerturnos();

        // Renderizar según la fecha del turno eliminado
        const turnosFiltrados = filtrarTurnosPorFecha(turnos, fechaTurno);
        renderizarTabla(turnosFiltrados);

        // Opcional: actualizar el filtro
        fechaFiltro.value = fechaTurno;
      }

      // EDITAR
      if (e.target.closest(".btn-editar")) {
        abrirModalTurno(turno);
      }
    });

  // ================= FUNCIONES =================

  function filtrarTurnosPorFecha(turnos, fecha) {
    if (!fecha) return turnos; // si no hay fecha, devuelve todos
    return turnos.filter((t) => t.fechaHora.startsWith(fecha));
  }

  // Ordenar turnos por fecha y hora
  function ordenarTurnosPorFechaHora(lista) {
    return lista.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
  }

  function renderizarTabla(lista) {
    const tbody = document.getElementById("turnosTableBody");
    tbody.innerHTML = "";

    if (!lista.length) {
      tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center text-danger fw-bold bg-warning">
                No hay turnos para esta fecha.
            </td>
        </tr>
    `;
      return;
    }
    // Ordenar antes de renderizar
    const listaOrdenada = ordenarTurnosPorFechaHora(lista);

    listaOrdenada.forEach((turno) => {
      const tr = document.createElement("tr");
      const medico = medicos.find((m) => m.id === turno.idMedico);
      const especialidad = especialidades.find((e) => e.id === medico.id);
      tr.innerHTML = `
        <td>${
          medico ? `${medico.apellido}, ${medico.nombre}` : "Sin asignar"
        }</td>
        <td class="d-none d-md-table-cell">${
          especialidad ? `${especialidad.nombre}` : "Sin asignar"
        }</td>
        <td>${formatearFecha(turno.fechaHora)}</td>
        <td class="text-center">
                    <!-- visible en md y superior -->
            <span class="d-none d-md-inline">${
              turno.disponible ? "✅ Disponible" : "❌ No Disponible"
            }</span>
            <!-- visible en xs y sm -->
            <span class="d-inline d-md-none">${
              turno.disponible ? "✅" : "❌"
            }</span>
        </td>
        <td class="text-center">
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-warning btn-sm btn-editar" data-id="${
              turno.id
            }">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${
              turno.id
            }">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Abrir modal para crear o editar turno
  async function abrirModalTurno(turno) {
    // Crear opciones del select de médicos
    const opcionesMedicos = medicos
      .map(
        (m) =>
          `<option value="${m.id}" ${
            turno?.idMedico === m.id ? "selected" : ""
          }>${m.apellido}, ${m.nombre}</option>`
      )
      .join("");

    const { value: formValues } = await Swal.fire({
      title: turno ? "Editar Turno" : "Nuevo Turno",
      html: `
        <div class="container-fluid p-0">
          <div class="mb-3">
            <label for="swalMedico" class="form-label fw-semibold">Médico</label>
            <select id="swalMedico" class="form-select w-100" ${
              turno ? "disabled" : ""
            }>

              <option value="">Seleccionar médico</option>
              ${opcionesMedicos}
            </select>
          </div>
          <div class="mb-3">
            <label for="swalFechaHora" class="form-label fw-semibold">Fecha y Hora</label>
            <input 
              type="datetime-local" 
              id="swalFechaHora" 
              class="form-control w-100"
              step="900"
              value="${turno ? turno.fechaHora : ""}">
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="swalDisponible"
                ${turno ? (turno.disponible ? "checked" : "") : "checked"}>
            <label class="form-check-label" for="swalDisponible">Disponible</label>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: turno ? "Actualizar" : "Agregar",
      cancelButtonText: "Cancelar",
      width: "auto",
      preConfirm: () => {
        const idMedico = parseInt(document.getElementById("swalMedico").value);
        const fechaHora = document.getElementById("swalFechaHora").value;
        const disponible = document.getElementById("swalDisponible").checked;

        if (!idMedico || !fechaHora) {
          Swal.showValidationMessage(
            "Por favor completa todos los campos obligatorios"
          );
          return false;
        }

        return { idMedico, fechaHora, disponible };
      },
    });

    if (!formValues) return;

    if (turno) {
      // Editar existente
      turno.idMedico = formValues.idMedico;
      turno.fechaHora = formValues.fechaHora;
      turno.disponible = formValues.disponible;
      turno.guardarTurno();
    } else {
      // Nuevo
      const nuevoTurno = new Turno({
        id: undefined, // se autogenera
        idMedico: formValues.idMedico,
        fechaHora: formValues.fechaHora,
        disponible: formValues.disponible,
      });
      nuevoTurno.guardarTurno();
    }

    // **Actualizar la lista en memoria**
    turnos = Turno.obtenerturnos();

    // Renderizar según la fecha del turno modificado o agregado
    const fechaTurno = turno
      ? turno.fechaHora.split("T")[0]
      : formValues.fechaHora.split("T")[0];
    const turnosFiltrados = filtrarTurnosPorFecha(turnos, fechaTurno);
    renderizarTabla(turnosFiltrados);

    // Opcional: actualizar el valor del filtro para reflejar la fecha
    fechaFiltro.value = fechaTurno;
  }

  function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // <-- 24 horas
    });
  }
});
