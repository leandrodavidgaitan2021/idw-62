// js/claseEspecialidad.js
import { mostrarAlerta } from "./alertas.js";

export class Especialidad {
  static especialidadesLS =
    JSON.parse(localStorage.getItem("especialidades")) || [];

  static siguienteId() {
    return this.especialidadesLS.length ? Math.max(...this.especialidadesLS.map((e) => e.id)) + 1 : 1;
  }

  constructor({ id, nombre }) {
    this.id = id ?? Especialidad.siguienteId();
    this.nombre = nombre;
  }

  // ========================= MÉTODOS DE INSTANCIA =========================

  guardarEspecialidad() {
    // Cargar especialidades actuales
    const especialidades =
      JSON.parse(localStorage.getItem("especialidades")) || [];
    const index = especialidades.findIndex((e) => e.id === this.id);

    if (index !== -1) {
      especialidades[index] = this; // Actualizar existente
      mostrarAlerta("success", "Especialidad actualizada correctamente.");
    } else {
      especialidades.push(this); // Agregar nuevo
      mostrarAlerta("success", "Especialidad agregada correctamente.");
    }

    localStorage.setItem("especialidades", JSON.stringify(especialidades));
  }

  // ========================== MÉTODOS ESTÁTICOS ==========================

  static eliminarEspecialidad(id) {
    const especialidades =
      JSON.parse(localStorage.getItem("especialidades")) || [];
    const index = especialidades.findIndex((e) => e.id === id);

    if (index !== -1) {
      especialidades.splice(index, 1);
      localStorage.setItem("especialidades", JSON.stringify(especialidades));
      mostrarAlerta("success", "Especialidad eliminada correctamente.");
      return true;
    }
    return false;
  }

  static obtenerEspecialidades() {
    const especialidades =
      JSON.parse(localStorage.getItem("especialidades")) || [];
    return especialidades.map((e) => new Especialidad(e));
  }

  // ======================= Carga de datos iniciales Especialidades =======================
  static async cargarDatosInicialesEsp() {
    try {
      // Especialidades
      let espLS = JSON.parse(localStorage.getItem("especialidades")) || [];
      if (!espLS.length) {
        const response = await fetch("./data/especialidades.json");

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.statusText}`);
        }
        const dataJSON = await response.json();
        localStorage.setItem("especialidades", JSON.stringify(dataJSON));

        espLS = dataJSON;
      }

      return espLS.map((e) => new Especialidad(e));
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
      localStorage.setItem("especialidades", JSON.stringify([]));
      return [];
    }
  }
}
