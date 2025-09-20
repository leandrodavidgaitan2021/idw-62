export class Turno {
  constructor({ id, medicoId, fechaHora, disponible = true }) {
    this.id = id; // número identificador
    this.medicoId = medicoId; // id del médico
    this.fechaHora = new Date(fechaHora); // fecha y hora
    this.disponible = disponible; // booleano
  }

  // Método para reservar turno
  reservar() {
    if (!this.disponible) {
      throw new Error("El turno no está disponible.");
    }
    this.disponible = false;
  }

  // Método para cancelar turno
  cancelar() {
    this.disponible = true;
  }

  // Método para mostrar datos resumidos
  resumen() {
    return {
      id: this.id,
      medicoId: this.medicoId,
      fechaHora: this.fechaHora.toLocaleString(),
      disponible: this.disponible,
    };
  }

  // ---------------------------------------------
  // Métodos estáticos para manejar LocalStorage
  // ---------------------------------------------

  // Guardar este turno en LocalStorage
  guardar() {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    turnos.push(this);
    localStorage.setItem("turnos", JSON.stringify(turnos));
  }

  // Obtener todos los turnos
  static obtenerTodos() {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    return turnos.map((t) => new Turno(t));
  }
}
