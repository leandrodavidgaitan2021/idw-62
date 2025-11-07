// claseReservas.js

import { mostrarAlerta } from "./alertas.js";

export class Reservas {
  // ========================== PROPIEDADES ESTÁTICAS ==========================
  static reservasLS = JSON.parse(localStorage.getItem("reservas")) || [];

  static siguienteId() {
    return this.reservasLS.length
      ? Math.max(...this.reservasLS.map((r) => r.id)) + 1
      : 1;
  }

  // ============================== CONSTRUCTOR ==============================
  constructor({
    id,
    documento,
    paciente,
    turnoId,
    especialidadId,
    obraSocialId,
    valorTotal,
  }) {
    this.id = id ?? Reservas.siguienteId();
    this.documento = documento;
    this.paciente = paciente; // Apellido y nombre del paciente
    this.turnoId = turnoId; // ID de Turno (relación)
    this.especialidadId = especialidadId; // ID de Especialidad (relación)
    this.obraSocialId = obraSocialId; // ID de Obra Social (relación)
    this.valorTotal = valorTotal;
  }

  // ========================= MÉTODOS DE INSTANCIA =========================
  guardarReserva() {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const index = reservas.findIndex((r) => r.id === this.id);

    if (index !== -1) {
      reservas[index] = this;
      mostrarAlerta("success", "Reserva actualizada correctamente.");
    } else {
      reservas.push(this);
      mostrarAlerta("success", "Reserva agregada correctamente.");
    }

    localStorage.setItem("reservas", JSON.stringify(reservas));
  }

  // ========================== MÉTODOS ESTÁTICOS ==========================
  static eliminarReserva(id) {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const index = reservas.findIndex((r) => r.id === id);

    if (index !== -1) {
      reservas.splice(index, 1);
      localStorage.setItem("reservas", JSON.stringify(reservas));
      mostrarAlerta("success", "Reserva eliminada correctamente.");
      return true;
    }
    return false;
  }

  static obtenerReservas() {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    return reservas.map((r) => new Reservas(r));
  }

  // ======================= CARGA DE DATOS INICIALES =======================
  static async cargarDatosIniciales() {
    try {
      let reservasLS = JSON.parse(localStorage.getItem("reservas"));

      if (!reservasLS || !reservasLS.length) {
        const response = await fetch("./data/reservas.json");

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.statusText}`);
        }

        const dataJSON = await response.json();
        localStorage.setItem("reservas", JSON.stringify(dataJSON));

        reservasLS = dataJSON;
      }

      return reservasLS.map((r) => new Reservas(r));
    } catch (error) {
      console.error("Error cargando reservas:", error);
      localStorage.setItem("reservas", JSON.stringify([]));
      return [];
    }
  }
}
