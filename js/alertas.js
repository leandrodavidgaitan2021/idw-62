//js/alertas.js

// ================== ALERTA DE CONFIRMACIÓN REUTILIZABLE ==================
export async function confirmarAccion({
  titulo = "¿Estás seguro?",
  texto = "Esta acción no se puede deshacer.",
  icono = null,
  textoConfirmar = "Sí, confirmar",
  textoCancelar = "Cancelar",
}) {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: textoConfirmar,
    cancelButtonText: textoCancelar,
  });

  return result.isConfirmed;
}

// ================== ALERTA SIMPLE REUTILIZABLE ==================
export function mostrarAlerta(
  icono = "success",
  mensaje = "Operación exitosa"
) {
  Swal.fire({
    icon: icono,
    title: mensaje,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
}

// ================== CONFIRMAR DATOS DE RESERVA ==================
export async function confirmarReserva(reserva) {
  // 🔹 Obtener listas desde localStorage (ya están cargadas en tu app)
  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  const especialidades =
    JSON.parse(localStorage.getItem("especialidades")) || [];
  const obrasSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];

  // 🔹 Extraer datos de la reserva
  const {
    paciente,
    documento,
    turnoId,
    especialidadId,
    obraSocialId,
    valorTotal,
  } = reserva;

  // 🔹 Buscar datos relacionados
  const turno = turnos.find((t) => t.id === turnoId);
  const medico = turno ? medicos.find((m) => m.id === turno.idMedico) : null;
  const especialidad = especialidades.find((e) => e.id === especialidadId);
  const obra = obrasSociales.find((o) => o.id === obraSocialId);

  // 🔹 Formatear fecha y hora del turno
  const fechaHora = turno
    ? new Date(turno.fechaHora).toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "Sin fecha";

  // 🔹 Construir contenido HTML con clases Bootstrap y espaciado a la izquierda
  const texto = `
    <div class="text-start ps-3">
      <div class="mb-2"><strong>Paciente:</strong> ${paciente}</div>
      <div class="mb-2"><strong>DNI:</strong> ${documento}</div>
      <div class="mb-2"><strong>Médico:</strong> ${
        medico ? `${medico.apellido}, ${medico.nombre}` : "Desconocido"
      }</div>
      <div class="mb-2"><strong>Especialidad:</strong> ${
        especialidad?.nombre || "No especificada"
      }</div>
      <div class="mb-2"><strong>Obra Social:</strong> ${
        obra?.nombre || "Consulta Particular"
      }</div>
      <div class="mb-2"><strong>Turno:</strong> ${fechaHora}</div>
      <div class="mt-3 fw-semibold"><strong>Valor Total:</strong> $${valorTotal}</div>
    </div>
  `;

  // 🔹 Mostrar confirmación
  const result = await Swal.fire({
    title:
      '<h4 class="mb-3 text-primary"><i class="fa-solid fa-calendar-check me-2"></i>Confirmar reserva</h4>',
    html: texto,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "rounded-4 shadow-lg p-3",
    },
  });
}
