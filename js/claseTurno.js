import { mostrarAlerta } from "./alertas.js";

export class Turno {
  // Inicializa turnosLS siempre como un array válido
  static turnosLS = JSON.parse(localStorage.getItem("turnos")) || [];

  // Calcula el siguiente ID de forma segura
  static siguienteId = Turno.turnosLS.length
    ? Math.max(...Turno.turnosLS.map((m) => m.id)) + 1
    : 1;

  constructor({ id, idMedico, fechaHora, disponible }) {
    this.id = id ?? Turno.siguienteId++;
    this.idMedico = idMedico; // ID del médico asociado
    this.fechaHora = fechaHora; // Fecha y hora del turno
    this.disponible = disponible; // Booleano: true/false
  }

  // ========================= MÉTODOS DE INSTANCIA =========================
  guardarTurno() {
    // Cargar turnos actuales
    let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

    // Validar duplicado (solo si es nuevo turno)
    const esNuevo = !turnos.some((t) => t.id === this.id);
    if (esNuevo) {
      console.log("Validando duplicados para nuevo turno...");
      const existe = turnos.some(
        (t) => t.idMedico === this.idMedico && t.fechaHora === this.fechaHora
      );
      console.log("¿Existe duplicado?", existe);

      if (existe) {
        mostrarAlerta(
          "error",
          "Ya existe un turno para este médico en esa fecha y hora."
        );
        return false; // No guardar
      }
    }

    // Actualizar existente
    const index = turnos.findIndex((t) => t.id === this.id);
    if (index !== -1) {
      turnos[index] = this;
      mostrarAlerta("success", "Turno actualizado correctamente.");
    } else {
      turnos.push(this);
      mostrarAlerta("success", "Turno agregado correctamente.");
    }

    // Guardar en localStorage
    localStorage.setItem("turnos", JSON.stringify(turnos));
    return true;
  }

  // ========================== MÉTODOS ESTÁTICOS ==========================

  static eliminarTurno(id) {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    const index = turnos.findIndex((o) => o.id === id);

    if (index !== -1) {
      turnos.splice(index, 1);
      localStorage.setItem("turnos", JSON.stringify(turnos));
      mostrarAlerta("success", "Turno eliminado correctamente.");
      return true;
    }

    mostrarAlerta("error", "Turno no encontrado.");
    return false;
  }

  static obtenerturnos() {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    return turnos.map((o) => new Turno(o));
  }

  // ======================= Carga de datos iniciales =======================
  static async cargarDatosInicialesT() {
    try {
      let turnosLS = JSON.parse(localStorage.getItem("turnos")) || [];

      if (!turnosLS.length) {
        const response = await fetch("./data/turnos.json");
        if (!response.ok) throw new Error(`Error HTTP: ${response.statusText}`);

        const dataJSON = await response.json();
        localStorage.setItem("turnos", JSON.stringify(dataJSON));
        turnosLS = dataJSON;
      }

      return turnosLS.map((o) => new Turno(o));
    } catch (error) {
      console.error("Error cargando turnos:", error);
      localStorage.setItem("turnos", JSON.stringify([]));
      return [];
    }
  }
}
