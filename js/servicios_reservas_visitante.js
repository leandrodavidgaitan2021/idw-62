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

  // === NUEVA RESERVA (para visitante) ===
  document.getElementById("btnNuevaReserva").addEventListener("click", () => {
    abrirModalNuevaReservaVisitante();
  });

  // =================== MODAL NUEVA RESERVA =================== //
  async function abrirModalNuevaReservaVisitante(medicoId = null) {
    const { value: formValues } = await Swal.fire({
      title: "Nueva Reserva",
      html: construirHTMLReserva(),
      width: "420px", // ✅ más chico
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      didOpen: () => configurarFormularioModal(medicoId),
      preConfirm: obtenerValoresFormulario,
    });

    if (!formValues) return;

    const nueva = new Reservas(formValues);
    nueva.guardarReserva();

    reservas = Reservas.obtenerReservas();

    Swal.fire(
      "Reserva creada",
      "Tu reserva fue registrada correctamente.",
      "success"
    );
  }

  // =================== FUNCIONES AUXILIARES =================== //

  function construirHTMLReserva() {
    return `
      <div class="mb-2">
        <label class="form-label fw-semibold">Médico - Especialidad</label>
        <select id="swalMedico" class="form-select">
          <option value="">Seleccione un médico</option>
          ${opcionesMedicos}
        </select>
      </div>

      <div class="mb-2">
        <label class="form-label fw-semibold">Turno disponible</label>
        <select id="swalTurno" class="form-select">
          <option value="">Seleccione un turno</option>
        </select>
      </div>

      <div class="mb-2">
        <label class="form-label fw-semibold">Obra Social</label>
        <select id="swalObra" class="form-select">
          ${opcionesObras}
        </select>
      </div>

      <div class="mb-2">
        <label class="form-label fw-semibold">DNI</label>
        <input id="swalDocumento" type="text" class="form-control" />
      </div>

      <div class="mb-2">
        <label class="form-label fw-semibold">Apellido y Nombre</label>
        <input id="swalPaciente" type="text" class="form-control" />
      </div>

      <div class="mb-2">
        <label class="form-label fw-semibold">Valor Total</label>
        <input id="swalValor" type="text" class="form-control" readonly />
      </div>`;
  }

  function configurarFormularioModal(medicoId = null) {
    const selMedico = document.getElementById("swalMedico");
    const selTurno = document.getElementById("swalTurno");
    const selObra = document.getElementById("swalObra");
    const inputValor = document.getElementById("swalValor");

    // === Cargar turnos por médico ===
    function cargarTurnosPorMedico(idMedico) {
      selTurno.innerHTML = `<option value="">Seleccione un turno</option>`;

      // 🕒 Fecha actual en horario de Argentina (UTC-3)
      const ahora = new Date();
      const ahoraArgentina = new Date(
        ahora.toLocaleString("en-US", {
          timeZone: "America/Argentina/Buenos_Aires",
        })
      );

      const disponibles = turnos.filter((t) => {
        const fechaTurno = new Date(t.fechaHora);
        return (
          t.idMedico === idMedico &&
          t.disponible &&
          fechaTurno >= ahoraArgentina
        );
      });

      disponibles.forEach((t) => {
        const fecha = new Date(t.fechaHora);
        const texto = `${fecha.toLocaleDateString(
          "es-AR"
        )} ${fecha.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
        selTurno.innerHTML += `<option value="${t.id}">${texto}</option>`;
      });
    }

    // === Recalcular valor según obra social ===
    function recalcularValor(medicoId, obraId) {
      const medico = medicos.find((m) => m.id === medicoId);
      const obra = obrasSociales.find((o) => o.id === obraId);
      const descuento = obra ? parseFloat(obra.porcentaje) / 100 : 0;
      inputValor.value = medico
        ? (medico.valorConsulta * (1 - descuento)).toFixed(2)
        : "";
    }

    // === EVENTOS ===
    selMedico.addEventListener("change", () => {
      const id = parseInt(selMedico.value);
      if (isNaN(id)) return;
      const medico = medicos.find((m) => m.id === id);
      cargarTurnosPorMedico(id);
      inputValor.value = medico ? medico.valorConsulta.toFixed(2) : "";
    });

    selObra.addEventListener("change", () => {
      const idMedico = parseInt(selMedico.value);
      const idObra = parseInt(selObra.value);
      recalcularValor(idMedico, idObra);
    });

    // === Si vino desde una card (con médico preseleccionado) ===
    if (medicoId) {
      selMedico.value = medicoId;
      const medico = medicos.find((m) => m.id === medicoId);
      cargarTurnosPorMedico(medicoId);
      inputValor.value = medico ? medico.valorConsulta.toFixed(2) : "";
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
