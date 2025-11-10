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
      // === Buscar turno ===
      const turno = turnos.find((t) => t.id === r.turnoId);
      console.log("Turno encontrado", turno);

      let turnoInfo = "No disponible";
      if (turno) {
        const medico = medicos.find((m) => m.id === turno.idMedico);
        const fecha = new Date(turno.fechaHora);
        const fechaFormateada = fecha.toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const horaFormateada = fecha.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        turnoInfo = `${fechaFormateada} ${horaFormateada} - ${
          medico ? `Dr. ${medico.apellido}` : ""
        }`;
      }

      // === Buscar especialidad ===
      const especialidad = especialidades.find(
        (e) => e.id === r.especialidadId
      );
      const especialidadNombre = especialidad
        ? especialidad.nombre
        : "Sin datos";

      // === Buscar obra social ===
      const obra = obrasSociales.find((o) => o.id === r.obraSocialId);
      const obraNombre = obra ? obra.nombre : "Particular";

      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.paciente}</td>
      <td>${r.documento}</td>
      <td>${turnoInfo}</td>
      <td>${especialidadNombre}</td>
      <td>${obraNombre}</td>
      <td>$${r.valorTotal.toLocaleString()}</td>
      <td class="text-center">
        <div class="d-flex justify-content-center gap-2">
          <button class="btn btn-warning btn-sm btn-editar" data-id="${r.id}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-danger btn-sm btn-eliminar" data-id="${r.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
      tbody.appendChild(tr);
    });
  }

  async function abrirModalReserva(reserva) {
    // === CREAR MODAL PERSONALIZADO ===
    const { value: formValues } = await Swal.fire({
      title: reserva ? "Editar Reserva" : "Nueva Reserva",
      html: `
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
        <input id="swalDocumento" type="text" class="form-control" value="${
          reserva?.documento || ""
        }" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Apellido y Nombre</label>
        <input id="swalPaciente" type="text" class="form-control" value="${
          reserva?.paciente || ""
        }" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Valor Total</label>
        <input id="swalValor" type="text" class="form-control" readonly value="${
          reserva?.valorTotal || ""
        }" />
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: reserva ? "Actualizar" : "Guardar",
      cancelButtonText: "Cancelar",
      didOpen: () => {
        const selMedico = document.getElementById("swalMedico");
        const selTurno = document.getElementById("swalTurno");
        const selObra = document.getElementById("swalObra");
        const inputValor = document.getElementById("swalValor");

        // === FUNCIONES AUXILIARES ===
        function cargarTurnosPorMedico(medicoId, turnoActualId = null) {
          selTurno.innerHTML = `<option value="">Seleccione un turno</option>`;
          const ahora = new Date();

          const turnosDisponibles = turnos.filter((t) => {
            const fechaTurno = new Date(t.fechaHora);
            return (
              t.idMedico === medicoId &&
              (t.disponible || t.id === turnoActualId) &&
              fechaTurno >= ahora
            );
          });

          if (!turnosDisponibles.length) {
            selTurno.innerHTML = `<option value="">No hay turnos disponibles</option>`;
          } else {
            selTurno.innerHTML += turnosDisponibles
              .map((t) => {
                const fecha = new Date(t.fechaHora);
                const fechaFormateada = fecha.toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
                const horaFormateada = fecha.toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return `
            <option value="${t.id}">
              ${t.id} - ${fechaFormateada} - ${horaFormateada}
            </option>`;
              })
              .join("");
          }
        }

        function cargarObrasPorMedico(medico) {
          selObra.innerHTML = `<option value="0" data-descuento="0">Consulta Particular</option>`;
          if (medico && Array.isArray(medico.obrasSociales)) {
            const obrasDelMedico = obrasSociales.filter((o) =>
              medico.obrasSociales.includes(o.id)
            );
            obrasDelMedico.forEach((o) => {
              const descuento = parseFloat(o.porcentaje) || 0;
              selObra.innerHTML += `<option value="${o.id}" data-descuento="${descuento}">
          ${o.nombre} (${descuento}% desc.)
        </option>`;
            });
          }
        }

        function recalcularValor(medicoId, obraId) {
          const medico = medicos.find((m) => m.id === medicoId);
          if (!medico) return;
          const obra = obrasSociales.find((o) => o.id === obraId);
          const descuento = obra ? parseFloat(obra.porcentaje) / 100 : 0;
          const valor = medico.valorConsulta * (1 - descuento);
          inputValor.value = valor.toFixed(2);
        }

        // === EVENTOS ===
        selMedico.addEventListener("change", () => {
          const medicoId = parseInt(selMedico.value);
          if (isNaN(medicoId)) return;
          const medico = medicos.find((m) => m.id === medicoId);
          cargarTurnosPorMedico(medicoId);
          cargarObrasPorMedico(medico);
          if (medico) inputValor.value = medico.valorConsulta.toFixed(2);
        });

        selObra.addEventListener("change", () => {
          const medicoId = parseInt(selMedico.value);
          const obraId = parseInt(selObra.value);
          recalcularValor(medicoId, obraId);
        });

        // === MODO EDICIÓN ===
        if (reserva) {
          // Buscar médico vinculado con la especialidad de la reserva
          const medicoSeleccionado = medicos.find(
            (m) => m.especialidadId === reserva.especialidadId
          );

          if (medicoSeleccionado) {
            // 1️⃣ Seleccionar el médico
            selMedico.value = medicoSeleccionado.id;

            // 2️⃣ Cargar los turnos y obras del médico
            cargarTurnosPorMedico(medicoSeleccionado.id, reserva.turnoId);
            cargarObrasPorMedico(medicoSeleccionado);

            // 3️⃣ IMPORTANTE: esperar a que el DOM agregue los <option> antes de seleccionar
            requestAnimationFrame(() => {
              selTurno.value = reserva.turnoId;
              selObra.value = reserva.obraSocialId || "0";
              recalcularValor(medicoSeleccionado.id, reserva.obraSocialId);
            });
          }
        }
      },
      preConfirm: () => {
        const paciente = document.getElementById("swalPaciente").value.trim();
        const documento = document.getElementById("swalDocumento").value.trim();
        const medicoId = parseInt(document.getElementById("swalMedico").value);
        const turnoId = parseInt(document.getElementById("swalTurno").value);
        console.log("Turno Id", turnoId);
        const obraSocialId = parseInt(
          document.getElementById("swalObra").value
        );
        const valorTotal = parseFloat(
          document.getElementById("swalValor").value
        );

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
      },
    });

    if (!formValues) return;

    // === GUARDAR O EDITAR ===
    if (reserva) {
      Object.assign(reserva, formValues);
      reserva.guardarReserva();
    } else {
      const nueva = new Reservas(formValues);
      nueva.guardarReserva();
    }

    reservas = Reservas.obtenerReservas();
    renderizarTabla(reservas);
  }
});
