export class ObraSocial {
  constructor({ id, nombre, descripcion }) {
    this.id = id;               // número identificador
    this.nombre = nombre;       // string
    this.descripcion = descripcion; // string
  }

  // Método para mostrar datos resumidos
  resumen() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion
    };
  }

  // ---------------------------------------------
  // Métodos estáticos para manejar LocalStorage
  // ---------------------------------------------

  // Guardar esta obra social en LocalStorage
  guardar() {
    const obras = JSON.parse(localStorage.getItem("obrasSociales")) || [];
    obras.push(this);
    localStorage.setItem("obrasSociales", JSON.stringify(obras));
  }

  // Obtener todas las obras sociales
  static obtenerTodas() {
    const obras = JSON.parse(localStorage.getItem("obrasSociales")) || [];
    return obras.map(o => new ObraSocial(o));
  }
}
