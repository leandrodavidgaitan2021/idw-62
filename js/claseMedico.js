// js/claseMedico.js
import { mostrarAlerta } from "./alertas.js";

import { ObraSocial } from "./claseObrasSociales.js";
import { Especialidad } from "./claseEspecialidad.js";
import { Turnos } from "./claseTurnos.js";
import { Reservas } from "./claseReservas.js";

export class Medico {
  static especialidades = [];
  static obrasSociales = [];
  static turnos = [];
  static reservas = [];

  static medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  static siguienteId = Medico.medicos.length
    ? Math.max(...Medico.medicos.map((m) => m.id)) + 1
    : 1;

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
    this.id = id ?? Medico.siguienteId++;
    this.matricula = parseInt(matricula);
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
    this.valorConsulta = parseFloat(valorConsulta) || 0.0;
  }

  nombreCompleto() {
    return `${this.apellido}, ${this.nombre}`;
  }

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

  guardarMedico() {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const index = medicos.findIndex((m) => m.id === this.id);

    if (index !== -1) {
      medicos[index] = this;
      mostrarAlerta("success", "Médico actualizado correctamente.");
    } else {
      medicos.push(this);
      mostrarAlerta("success", "Médico agregado correctamente.");
    }

    localStorage.setItem("medicos", JSON.stringify(medicos));
  }

  static eliminarMedico(id) {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const index = medicos.findIndex((m) => m.id === id);

    if (index !== -1) {
      medicos.splice(index, 1);
      localStorage.setItem("medicos", JSON.stringify(medicos));
      mostrarAlerta("success", "Médico eliminado correctamente.");
      return true;
    }
    return false;
  }

  static obtenerMedicos() {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    return medicos.map((m) => new Medico(m));
  }

  // ======================= Carga de datos iniciales todo =======================
  static async cargarDatosIniciales() {
    try {
      // Especialidades
      Medico.especialidades = await Especialidad.cargarDatosInicialesEsp();

      // Obras Sociales
      Medico.obrasSociales = await ObraSocial.cargarDatosInicialesOB();

      // Turnos
      Medico.turnos = await Turnos.cargarDatosInicialesT();

      // Reservas
      Medico.reservas = await Reservas.cargarDatosInicialesR();

      // Médicos
      let medicosLS = JSON.parse(localStorage.getItem("medicos")) || [];
      if (!medicosLS.length) {
        const medicosResponse = await fetch("./data/medicos.json");
        const dataJSON = await medicosResponse.json();
        const instancias = dataJSON.map((m) => new Medico(m));
        localStorage.setItem("medicos", JSON.stringify(instancias));
        medicosLS = instancias;
      }

      return medicosLS.map((m) => new Medico(m));
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
      Medico.especialidades = [];
      Medico.obrasSociales = [];
      localStorage.setItem("medicos", JSON.stringify([]));
      return [];
    }
  }
}
