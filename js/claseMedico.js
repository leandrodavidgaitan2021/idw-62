// js/claseMedico.js
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
    this.id = id;
    this.matricula = matricula;
    this.apellido = apellido;
    this.nombre = nombre;
    this.especialidad = especialidad;
    this.descripcion = descripcion;
    this.obrasSociales = obrasSociales;
    this.fotografia = fotografia;
    this.valorConsulta = valorConsulta;
  }

  nombreCompleto() {
    return `${this.apellido}, ${this.nombre}`;
  }

  aceptaObraSocial(idObraSocial) {
    return this.obrasSociales.includes(idObraSocial);
  }

  resumen() {
    return {
      id: this.id,
      nombre: this.nombreCompleto(),
      especialidad: this.especialidad,
      valorConsulta: this.valorConsulta,
    };
  }

  guardar() {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const index = medicos.findIndex((m) => m.id === this.id);

    if (index !== -1) {
      medicos[index] = this; // actualiza
    } else {
      medicos.push(this); // agrega nuevo
    }

    localStorage.setItem("medicos", JSON.stringify(medicos));
  }

  static eliminar(id) {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const index = medicos.findIndex((m) => m.id === id);

    if (index !== -1) {
      medicos.splice(index, 1); // eliminar
      localStorage.setItem("medicos", JSON.stringify(medicos));
      return true;
    }

    return false; // no encontrado
  }

  static obtenerTodos() {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    return medicos.map((m) => new Medico(m));
  }

  static async cargarMedicosDesdeJSON() {
    return fetch("./data/medicos.json")
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error cargando JSON:", error);
        return [];
      });
  }

  static async sincronizarLocalStorage() {
    let medicosLS = JSON.parse(localStorage.getItem("medicos"));

    if (!medicosLS || medicosLS.length === 0) {
      console.log("LocalStorage vacío, cargando desde JSON...");
      const dataJSON = await Medico.cargarMedicosDesdeJSON();
      localStorage.setItem("medicos", JSON.stringify(dataJSON));
      medicosLS = dataJSON;
    } else {
      console.log("Usando datos desde LocalStorage.");
    }

    return medicosLS.map((m) => new Medico(m));
  }
}
