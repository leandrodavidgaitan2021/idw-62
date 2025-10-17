export class ObraSocial {
  constructor({ id, nombre, descripcion }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  // ========================= MÉTODOS DE INSTANCIA =========================
  guardarObraSocial() {
    const obrasSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];
    const index = obrasSociales.findIndex((o) => o.id === this.id);

    if (index !== -1) {
      obrasSociales[index] = this; // Actualizar existente
    } else {
      obrasSociales.push(this); // Agregar nuevo
    }

    localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
  }

  // ========================== MÉTODOS ESTÁTICOS ==========================

  static eliminarObraSocial(id) {
    const obrasSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];
    const index = obrasSociales.findIndex((o) => o.id === id);

    if (index !== -1) {
      obrasSociales.splice(index, 1);
      localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
      return true;
    }
    return false;
  }

  static obtenerObrasSociales() {
    const obrasSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];
    return obrasSociales.map((o) => new ObraSocial(o));
  }

  // ======================= CARGA DE DATOS INICIALES =======================
  static async cargarDatosInicialesOB() {
    try {
      let obrasSocialesLS = JSON.parse(localStorage.getItem("obrasSociales"));
      if (!obrasSocialesLS || !obrasSocialesLS.length) {
        const response = await fetch("./data/obrasSociales.json");
        obrasSocialesLS = await response.json();
        localStorage.setItem("obrasSociales", JSON.stringify(obrasSocialesLS));
      }
      return obrasSocialesLS.map((o) => new ObraSocial(o));
    } catch (error) {
      console.error("Error cargando obras sociales:", error);
      localStorage.setItem("obrasSociales", JSON.stringify([]));
      return [];
    }
  }

  // ============================ UTILIDAD EXTRA ============================
  static siguienteId() {
    const obrasSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];
    if (obrasSociales.length === 0) return 1;
    return Math.max(...obrasSociales.map((o) => o.id)) + 1;
  }
}
