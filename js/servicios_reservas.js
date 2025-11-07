import { Reservas } from "./claseReservas.js";
import { confirmarAccion } from "./alertas.js";

document.addEventListener("DOMContentLoaded", async () => {
  let reservas = await Reservas.cargarDatosIniciales();
  renderizarTabla(reservas);

  // === NUEVA RESERVA ===
  document.getElementById("btnNuevaReserva").addEventListener("click", () => {
    abrirModalReserva(null);
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
        abrirModalReserva(reserva);
      }
    });

  // === FUNCIONES ===
  function renderizarTabla(lista) {
    const tbody = document.getElementById("reservasTableBody");
    tbody.innerHTML = "";
    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No hay reservas registradas.</td></tr>`;
      return;
    }

    lista.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.paciente}</td>
        <td>${r.documento}</td>
        <td>${r.turnoId}</td>
        <td>${r.especialidadId}</td>
        <td>${r.obraSocialId}</td>
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
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  async function abrirModalReserva(reserva) {
    const { value: formValues } = await Swal.fire({
      title: reserva ? "Editar Reserva" : "Nueva Reserva",
      html: `
        <div class="mb-3">
          <label class="form-label fw-semibold">Paciente</label>
          <input id="swalPaciente" type="text" class="form-control" value="${
            reserva?.paciente || ""
          }" />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Documento</label>
          <input id="swalDocumento" type="text" class="form-control" value="${
            reserva?.documento || ""
          }" />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Turno ID</label>
          <input id="swalTurno" type="number" class="form-control" value="${
            reserva?.turnoId || ""
          }" />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Especialidad ID</label>
          <input id="swalEspecialidad" type="number" class="form-control" value="${
            reserva?.especialidadId || ""
          }" />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Obra Social ID</label>
          <input id="swalObra" type="number" class="form-control" value="${
            reserva?.obraSocialId || ""
          }" />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Valor Total</label>
          <input id="swalValor" type="number" class="form-control" value="${
            reserva?.valorTotal || ""
          }" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: reserva ? "Actualizar" : "Agregar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const paciente = document.getElementById("swalPaciente").value.trim();
        const documento = document.getElementById("swalDocumento").value.trim();
        const turnoId = parseInt(document.getElementById("swalTurno").value);
        const especialidadId = parseInt(
          document.getElementById("swalEspecialidad").value
        );
        const obraSocialId = parseInt(
          document.getElementById("swalObra").value
        );
        const valorTotal = parseFloat(
          document.getElementById("swalValor").value
        );

        if (!paciente || !documento || isNaN(valorTotal)) {
          Swal.showValidationMessage("Completa todos los campos correctamente");
          return false;
        }

        return {
          paciente,
          documento,
          turnoId,
          especialidadId,
          obraSocialId,
          valorTotal,
        };
      },
    });

    if (!formValues) return;

    if (reserva) {
      // Editar
      Object.assign(reserva, formValues);
      reserva.guardarReserva();
    } else {
      // Nueva
      const nueva = new Reservas(formValues);
      nueva.guardarReserva();
    }

    reservas = Reservas.obtenerReservas();
    renderizarTabla(reservas);
  }
});
