// Clase Especialidades
export class Especialidad {
  constructor({ id, nombre }) {
    this.id = id;         // número identificador
    this.nombre = nombre; // string
  }

  // ---------------------------------------------
  // Métodos estáticos para manejar LocalStorage
  // ---------------------------------------------

  // Guardar esta especialidad en LocalStorage
  guardar() {
    const especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];
    especialidades.push(this);
    localStorage.setItem("especialidades", JSON.stringify(especialidades));
  }

  // Obtener todas las especialidades
  static obtenerTodas() {
    const especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];
    return especialidades.map(e => new Especialidad(e));
  }
}
