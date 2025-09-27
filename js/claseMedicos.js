export class Medico {
  constructor({
    id,
    matricula,
    apellido,
    nombre,
    especialidad,
    descripcion,
    obrasSociales = [],
    fotografia,
    valorConsulta,
  }) {
    this.id = id; // número entero
    this.matricula = matricula; // número entero
    this.apellido = apellido; // string
    this.nombre = nombre; // string
    this.especialidad = especialidad; // id de Especialidad
    this.descripcion = descripcion; // presentación del profesional
    this.obrasSociales = obrasSociales; // array de ids de Obra Social
    this.fotografia = fotografia; // base64
    this.valorConsulta = valorConsulta; // número decimal
  }

  // Método para obtener nombre completo
  nombreCompleto() {
    return `${this.apellido}, ${this.nombre}`;
  }

  // Método para verificar si acepta una obra social específica
  aceptaObraSocial(idObraSocial) {
    return this.obrasSociales.includes(idObraSocial);
  }

  // Método para mostrar datos resumidos
  resumen() {
    return {
      id: this.id,
      nombre: this.nombreCompleto(),
      especialidad: this.especialidad,
      valorConsulta: this.valorConsulta,
    };
  }

  // ---------------------------------------------
  // Métodos estáticos para manejar LocalStorage
  // ---------------------------------------------

  // Guardar este médico en LocalStorage
  guardar() {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    medicos.push(this);
    localStorage.setItem("medicos", JSON.stringify(medicos));
  }

  // Obtener todos los médicos
  static obtenerTodos() {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    return medicos.map((m) => new Medico(m));
  }

  // Leer medicos.json y cargar los médicos en LocalStorage
  static cargarDesdeJSON() {
    fetch("./data/medicos.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // acá tenés el JSON como objeto de JS
        localStorage.setItem("medicos", JSON.stringify(data));
      })
      .catch((error) => console.error("Error cargando JSON:", error));
  }
}
