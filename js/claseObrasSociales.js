import { mostrarAlerta } from "./alertas.js";

export class ObraSocial {
  static obrasSocialesLS = JSON.parse(localStorage.getItem("obrasSociales"));
  static siguienteId = ObraSocial.obrasSocialesLS.length
    ? Math.max(...ObraSocial.obrasSocialesLS.map((m) => m.id)) + 1
    : 1;

  constructor({ id, nombre, descripcion }) {
    this.id = id ?? ObraSocial.siguienteId++;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  // ========================= MÉTODOS DE INSTANCIA =========================
  guardarObraSocial() {
    const obrasSociales =
      JSON.parse(localStorage.getItem("obrasSociales")) || [];
    const index = obrasSociales.findIndex((o) => o.id === this.id);

    if (index !== -1) {
      obrasSociales[index] = this; // Actualizar existente
      mostrarAlerta("success", "Obra Social actualizada correctamente.");
    } else {
      obrasSociales.push(this); // Agregar nuevo
      mostrarAlerta("success", "Obra Social agregada correctamente.");
    }

    localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
  }

  // ========================== MÉTODOS ESTÁTICOS ==========================

  static eliminarObraSocial(id) {
    const obrasSociales =
      JSON.parse(localStorage.getItem("obrasSociales")) || [];
    const index = obrasSociales.findIndex((o) => o.id === id);

    if (index !== -1) {
      obrasSociales.splice(index, 1);
      localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
      mostrarAlerta("success", "Obra social eliminada correctamente.");
      return true;
    }
    return false;
  }

  static obtenerObrasSociales() {
    const obrasSociales =
      JSON.parse(localStorage.getItem("obrasSociales")) || [];
    return obrasSociales.map((o) => new ObraSocial(o));
  }

  // ======================= Carga de datos iniciales Obras Sociales =======================
  static async cargarDatosInicialesOB() {
    try {
      // Obras Sociales
      let obrasSocialesLS = JSON.parse(localStorage.getItem("obrasSociales"));

      if (!obrasSocialesLS || !obrasSocialesLS.length) {
        const response = await fetch("./data/obrasSociales.json");

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.statusText}`);
        }
        const dataJSON = await response.json();
        localStorage.setItem("obrasSociales", JSON.stringify(dataJSON));

        obrasSocialesLS = dataJSON;
        //console.log("Obras sociales cargadas desde su clase:", obrasSocialesLS);
      }

      return obrasSocialesLS.map((o) => new ObraSocial(o));
    } catch (error) {
      console.error("Error cargando obras sociales:", error);
      localStorage.setItem("obrasSociales", JSON.stringify([]));
      return [];
    }
  }
}
