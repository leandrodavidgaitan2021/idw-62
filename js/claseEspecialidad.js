// js/claseEspecialidad.js
export class Especialidad {
    static especialidades = [];

    constructor({
        id,
        nombre,
    }) {
        this.id = id;
        this.nombre = nombre;
    }

    //nombreEspecialidad() {
    //    return `${this.id}, ${this.nombre}`;
    //}

    guardarEspecialidad() {
        const especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];
        const index = especialidades.findIndex((e) => e.id === this.id);

        if (index !== -1) {
            especialidades[index] = this;
        } else {
            const nuevaId = especialidades.reduce((max, e) => (e.id > max ? e.id : max), 0);
            this.id = nuevaId + 1;
            especialidades.push(this);
        }
        localStorage.setItem("especialidades", JSON.stringify(especialidades));
    }

    static eliminarEspecialidad(id) {
        const especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];
        const index = especialidades.findIndex((e) => e.id === id);

        if (index !== -1) {
            especialidades.splice(index, 1);
            localStorage.setItem("especialidades", JSON.stringify(especialidades));
            return true;
        }
        return false;
    }

    static obtenerEspecialidades() {
        const especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];
        return especialidades.map((e) => new Especialidad(e));
    }


    // ======================= NUEVA FUNCIÓN CENTRAL =======================
    static async cargarDatosIniciales() {

        try {
            // Especialidades
            let espLS = JSON.parse(localStorage.getItem("especialidades")) || [];
            if (!espLS.length) {
                const espResponse = await fetch("./data/especialidades.json");
                
                if (!espResponse.ok) {
                    throw new Error(`Error HTTP: ${espResponse.statusText}`);
                }
                const dataJSON = await espResponse.json();
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