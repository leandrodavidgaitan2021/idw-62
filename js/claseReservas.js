export class Reserva {
  constructor({
    id,
    documento,
    paciente,
    turnoId,
    especialidadId,
    obraSocialId,
    valorConsulta,
  }) {
    this.id = id; // número identificador
    this.documento = documento; // string (permite extranjeros)
    this.paciente = paciente; // "Apellido y nombre"
    this.turnoId = turnoId; // id de Turno
    this.especialidadId = especialidadId; // id de Especialidad
    this.obraSocialId = obraSocialId; // id de Obra Social
    this.valorTotal = valorConsulta; // valor final (puede ajustarse)
  }

  // Método para mostrar resumen de la reserva
  resumen() {
    return {
      id: this.id,
      paciente: this.paciente,
      documento: this.documento,
      turnoId: this.turnoId,
      especialidadId: this.especialidadId,
      obraSocialId: this.obraSocialId,
      valorTotal: this.valorTotal,
    };
  }

  // ---------------------------------------------
  // Métodos estáticos para manejar LocalStorage
  // ---------------------------------------------

  // Guardar esta reserva en LocalStorage
  guardar() {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    reservas.push(this);
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }

  // Obtener todas las reservas
  static obtenerTodas() {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    return reservas.map((r) => new Reserva(r));
  }
}
