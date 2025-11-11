import { Reservas } from "./claseReservas.js";
import { confirmarAccion } from "./alertas.js";

document.addEventListener("DOMContentLoaded", async () => {
  let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

  // === CARGAR DATOS DESDE LOCALSTORAGE ===
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  const especialidades =
    JSON.parse(localStorage.getItem("especialidades")) || [];
  const obrasSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];
  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];

  // === GENERAR OPCIONES SELECT ===
  const opcionesMedicos = medicos
    .map((m) => {
      const esp = especialidades.find((e) => e.id === m.especialidad);
      return `<option value="${m.id}">
        ${m.apellido}, ${m.nombre} - ${esp?.nombre || "Sin especialidad"}
      </option>`;
    })
    .join("");

  const opcionesObras = [
    `<option value="0" data-porcentaje="0">Consulta Particular</option>`,
    ...obrasSociales.map(
      (o) =>
        `<option value="${o.id}" data-porcentaje="${o.porcentaje}">
          ${o.nombre}
        </option>`
    ),
  ].join("");

  // === RENDERIZAR TABLA DE RESERVAS ===
  renderizarTabla(reservas);

  // === NUEVA RESERVA ===
  document.getElementById("btnNuevaReserva").addEventListener("click", () => {
    abrirModalNuevaReserva();
  });

  // === EVENTOS TABLA (editar / eliminar) ===
  document
    .getElementById("reservasTableBody")
    .addEventListener("click", async (e) => {
      const id = parseInt(e.target.closest("button")?.dataset.id);
      if (!id) return;

      const reserva = reservas.find((r) => r.id === id);

      if (e.target.closest(".btn-eliminar")) {
        const confirmado = await confirmarAccion({
          titulo: `¿Eliminar la reserva de ${reserva.paciente}?`,
          texto: "Esta acción no se puede deshacer.",
          textoConfirmar: "Sí, eliminar",
        });
        if (!confirmado) return;

        Reservas.eliminarReserva(id);
        reservas = Reservas.obtenerReservas();
        renderizarTabla(reservas);
      }

      if (e.target.closest(".btn-editar")) {
        abrirModalEditarReserva(reserva);
      }
    });

  // =================== FUNCIONES =================== //

  function renderizarTabla(lista) {
    const tbody = document.getElementById("reservasTableBody");
    tbody.innerHTML = "";

    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No hay reservas registradas.</td></tr>`;
      return;
    }

    lista.forEach((r) => {
      const turno = turnos.find((t) => t.id === r.turnoId);
      let turnoInfo = "No disponible";

      if (turno) {
        const medico = medicos.find((m) => m.id === turno.idMedico);
        const fecha = new Date(turno.fechaHora);
        turnoInfo = `${fecha.toLocaleDateString(
          "es-AR"
        )} ${fecha.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${medico ? `Dr. ${medico.apellido}, ${medico.nombre}` : ""}`;
      }

      const especialidad = especialidades.find(
        (e) => e.id === r.especialidadId
      );
      const obra = obrasSociales.find((o) => o.id === r.obraSocialId);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.paciente}</td>
        <td>${r.documento}</td>
        <td>${turnoInfo}</td>
        <td>${especialidad ? especialidad.nombre : "Sin datos"}</td>
        <td>${obra ? obra.nombre : "Particular"}</td>
        <td>$${r.valorTotal.toLocaleString()}</td>
        <td class="text-center">
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-warning btn-sm btn-editar" data-id="${r.id}">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${
              r.id
            }">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // =================== MODAL NUEVA RESERVA =================== //
  async function abrirModalNuevaReserva(medicoId = null) {
    const { value: formValues } = await Swal.fire({
      title: "Nueva Reserva",
      html: construirHTMLReserva(),
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      didOpen: () => configurarFormularioModal(medicoId, null),
      preConfirm: obtenerValoresFormulario,
    });

    if (!formValues) return;
    const nueva = new Reservas(formValues);
    nueva.guardarReserva();
    reservas = Reservas.obtenerReservas();
    renderizarTabla(reservas);
  }

  // =================== MODAL EDITAR RESERVA =================== //
  async function abrirModalEditarReserva(reserva) {
    const { value: formValues } = await Swal.fire({
      title: "Editar Reserva",
      html: construirHTMLReserva(),
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      didOpen: () => configurarFormularioModal(null, reserva),
      preConfirm: obtenerValoresFormulario,
    });

    if (!formValues) return;
    Object.assign(reserva, formValues);
    reserva.guardarReserva();
    reservas = Reservas.obtenerReservas();
    renderizarTabla(reservas);
  }

  // =================== FUNCIONES AUXILIARES =================== //

  function construirHTMLReserva() {
    return `
      <div class="mb-3">
        <label class="form-label fw-semibold">Médico - Especialidad</label>
        <select id="swalMedico" class="form-select">
          <option value="">Seleccione un médico</option>
          ${opcionesMedicos}
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Turno disponible</label>
        <select id="swalTurno" class="form-select">
          <option value="">Seleccione un turno</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Obra Social</label>
        <select id="swalObra" class="form-select">
          ${opcionesObras}
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">DNI</label>
        <input id="swalDocumento" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Apellido y Nombre</label>
        <input id="swalPaciente" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Valor Total</label>
        <input id="swalValor" type="text" class="form-control" readonly />
      </div>`;
  }

  function configurarFormularioModal(medicoId, reserva) {
    const selMedico = document.getElementById("swalMedico");
    const selTurno = document.getElementById("swalTurno");
    const selObra = document.getElementById("swalObra");
    const inputValor = document.getElementById("swalValor");

    function cargarTurnosPorMedico(idMedico, turnoActualId = null) {
      selTurno.innerHTML = `<option value="">Seleccione un turno</option>`;
      const ahora = new Date();
      const disponibles = turnos.filter((t) => {
        const fechaTurno = new Date(t.fechaHora);
        return (
          t.idMedico === idMedico &&
          (t.disponible || t.id === turnoActualId) &&
          fechaTurno >= ahora
        );
      });

      disponibles.forEach((t) => {
        const fecha = new Date(t.fechaHora);
        selTurno.innerHTML += `<option value="${t.id}">
          ${fecha.toLocaleDateString("es-AR")} ${fecha.toLocaleTimeString(
          "es-AR",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}
        </option>`;
      });
    }

    function cargarObrasPorMedico(medico) {
      selObra.innerHTML = `<option value="0" data-porcentaje="0">Consulta Particular</option>`;
      if (!medico || !Array.isArray(medico.obrasSociales)) return;
      obrasSociales
        .filter((o) => medico.obrasSociales.includes(o.id))
        .forEach((o) => {
          selObra.innerHTML += `<option value="${o.id}" data-porcentaje="${o.porcentaje}">
            ${o.nombre} (${o.porcentaje}% desc.)
          </option>`;
        });
    }

    function recalcularValor(medicoId, obraId) {
      const medico = medicos.find((m) => m.id === medicoId);
      const obra = obrasSociales.find((o) => o.id === obraId);
      const descuento = obra ? parseFloat(obra.porcentaje) / 100 : 0;
      inputValor.value = (medico.valorConsulta * (1 - descuento)).toFixed(2);
    }

    selMedico.addEventListener("change", () => {
      const id = parseInt(selMedico.value);
      if (isNaN(id)) return;
      const medico = medicos.find((m) => m.id === id);
      cargarTurnosPorMedico(id);
      cargarObrasPorMedico(medico);
      inputValor.value = medico.valorConsulta.toFixed(2);
    });

    selObra.addEventListener("change", () => {
      const idMedico = parseInt(selMedico.value);
      const idObra = parseInt(selObra.value);
      recalcularValor(idMedico, idObra);
    });

    // === CONFIGURAR SI ES NUEVA O EDICIÓN ===
    if (medicoId) {
      selMedico.value = medicoId;
      selMedico.disabled = true;
      const medico = medicos.find((m) => m.id === medicoId);
      cargarTurnosPorMedico(medicoId);
      cargarObrasPorMedico(medico);
      inputValor.value = medico.valorConsulta.toFixed(2);
    }

    if (reserva) {
      const medico = medicos.find(
        (m) => m.especialidad === reserva.especialidadId
      );
      if (medico) {
        selMedico.value = medico.id;
        cargarTurnosPorMedico(medico.id, reserva.turnoId);
        cargarObrasPorMedico(medico);
        requestAnimationFrame(() => {
          selTurno.value = reserva.turnoId;
          selObra.value = reserva.obraSocialId || "0";
          document.getElementById("swalDocumento").value = reserva.documento;
          document.getElementById("swalPaciente").value = reserva.paciente;
          inputValor.value = reserva.valorTotal.toFixed(2);
        });
      }
    }
  }

  function obtenerValoresFormulario() {
    const paciente = document.getElementById("swalPaciente").value.trim();
    const documento = document.getElementById("swalDocumento").value.trim();
    const medicoId = parseInt(document.getElementById("swalMedico").value);
    const turnoId = parseInt(document.getElementById("swalTurno").value);
    const obraSocialId = parseInt(document.getElementById("swalObra").value);
    const valorTotal = parseFloat(document.getElementById("swalValor").value);

    if (!paciente || !documento || isNaN(turnoId) || isNaN(medicoId)) {
      Swal.showValidationMessage("Completa todos los campos obligatorios");
      return false;
    }

    const medico = medicos.find((m) => m.id === medicoId);

    return {
      paciente,
      documento,
      turnoId,
      especialidadId: medico?.especialidad,
      obraSocialId,
      valorTotal,
    };
  }
});
