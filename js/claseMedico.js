// js/claseMedico.js
export class Medico {
  static especialidades = [];
  static obrasSociales = [];

  static async cargarDatosAuxiliares() {
    try {
      const esp = await fetch("./data/especialidades.json");
      Medico.especialidades = await esp.json();

      const os = await fetch("./data/obrasSociales.json");
      Medico.obrasSociales = await os.json();
    } catch (error) {
      console.error("Error cargando datos auxiliares:", error);
      Medico.especialidades = [];
      Medico.obrasSociales = [];
    }
  }

  constructor({
    id,
    matricula,
    apellido,
    nombre,
    especialidad,
    descripcion,
    obrasSociales: obrasSocialesEntrada = [],
    fotografia,
    valorConsulta,
  }) {
    this.id = id;
    this.matricula = matricula;
    this.apellido = apellido;
    this.nombre = nombre;

    // Normalizar especialidad
    if (typeof especialidad === "string") {
      const esp = Medico.especialidades.find((e) => e.nombre === especialidad);
      this.especialidad = esp ? esp.id : null;
    } else {
      this.especialidad = especialidad;
    }

    // Normalizar obras sociales
    this.obrasSociales = obrasSocialesEntrada
      .map((os) => {
        if (typeof os === "string") {
          const obj = Medico.obrasSociales.find((o) => o.nombre === os);
          return obj ? obj.id : null;
        }
        return os;
      })
      .filter((id) => id !== null);

    this.descripcion = descripcion;
    this.fotografia = fotografia;
    this.valorConsulta = valorConsulta;
  }

  nombreCompleto() {
    return `${this.apellido}, ${this.nombre}`;
  }

  // ❌ Antes: especialidades.find(...)
  getEspecialidadNombre() {
    return (
      Medico.especialidades.find((e) => e.id === parseInt(this.especialidad))
        ?.nombre || "Desconocida"
    );
  }

  getObrasSocialesNombres() {
    return this.obrasSociales
      .map(
        (id) =>
          Medico.obrasSociales.find((o) => o.id === parseInt(id))?.nombre ||
          "Desconocida"
      )
      .join(", ");
  }

  aceptaObraSocial(idObraSocial) {
    return this.obrasSociales.includes(idObraSocial);
  }

  resumen() {
    return {
      id: this.id,
      nombre: this.nombreCompleto(),
      especialidad: this.getEspecialidadNombre(),
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
      medicos.splice(index, 1);
      localStorage.setItem("medicos", JSON.stringify(medicos));
      return true;
    }

    return false;
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

      // Normalizamos al crear instancias
      const instancias = dataJSON.map((m) => new Medico(m));
      localStorage.setItem("medicos", JSON.stringify(instancias));
      return instancias;
    } else {
      console.log("Usando datos desde LocalStorage.");
      return medicosLS.map((m) => new Medico(m));
    }
  }
}
