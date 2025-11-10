
import { Especialidad } from "./claseEspecialidad.js";
import { confirmarAccion } from "./alertas.js";

// ================== CARGA INICIAL ==================
document.addEventListener("DOMContentLoaded", async () => {
  let especialidades = await Especialidad.cargarDatosInicialesEsp();
  
  renderizarTabla(especialidades);

  // NUEVA ESPECIALIDAD
  document.getElementById("btnNuevaEsp").addEventListener("click", () => {
    abrirModalEspecialidad(null); // null = nueva
  });

  // EVENTOS DE TABLA (editar/eliminar)
  document
    .getElementById("especialidadesTableBody")
    .addEventListener("click", async (a) => {
      const id = parseInt(a.target.closest("button")?.dataset.id);
      if (!id) return;

      const especialidad = especialidades.find((e) => e.id === id);

      if (a.target.closest(".btn-eliminar")) {
        const confirmado = await confirmarAccion({
          titulo: `¿Eliminar especialidad: ${especialidad.nombre}?`,
          texto: "Esta acción no se puede deshacer.",
          textoConfirmar: "Sí, eliminar",
        });
        if (!confirmado) return;

        Especialidad.eliminarEspecialidad(id);
        especialidades = Especialidad.obtenerEspecialidades();
        renderizarTabla(especialidades);
      }

      if (a.target.closest(".btn-editar")) {
        abrirModalEspecialidad(especialidad);
      }
    });

  // ================= FUNCIONES =================
  function renderizarTabla(lista) {
    const tbody = document.getElementById("especialidadesTableBody");
    tbody.innerHTML = "";
    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No hay especialidades registradas.</td></tr>`;
      return;
    }
    lista.forEach((especialidad) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${especialidad.id}</td>
        <td>${especialidad.nombre}</td>
        <td class="text-center">
          <div class="d-flex gap-2">
            <button class="btn btn-warning btn-sm btn-editar" data-id="${especialidad.id}">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${especialidad.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  async function abrirModalEspecialidad(especialidad) {
    const { value: formValues } = await Swal.fire({
      title: especialidad ? "Editar Especialidad" : "Nueva Especialidad",
      html: `
      <div class="container-fluid p-0">
        <div class="row justify-content-center">

          <div class="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto"
            <div class="mb-3">
              <label for="swalNombre" class="form-label fw-semibold">Nombre</label>
              <input id="swalNombre" type="text" class="form-control w-100" placeholder="Nombre" value="${
                especialidad?.nombre || ""
              }">
            </div>
          </div>
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: especialidad ? "Actualizar" : "Agregar",
      cancelButtonText: "Cancelar",
      width: window.innerWidth < 576 ? "90%" : "600px", // más angosto en móvil
      customClass: {
        title: especialidad ? "text-warning" : "text-primary", // Amarillo para editar, verde para nuevo
      },
      preConfirm: () => {
        const nombre = document.getElementById("swalNombre").value.trim();
        if (!nombre) {
          Swal.showValidationMessage("Completa el campo");
          return false;
          }
          
        return { nombre };
      },
    });

    if (!formValues) return;

    if (especialidad) {
      // Editar
      especialidad.nombre = formValues.nombre;
      especialidad.guardarEspecialidad();
    } else {
      // Nueva
      const nuevaEspecialidad = new Especialidad({
        id: Especialidad.siguienteId(),
        nombre: formValues.nombre,
      });
      nuevaEspecialidad.guardarEspecialidad();
    }

    especialidades = Especialidad.obtenerEspecialidades();
    renderizarTabla(especialidades);
  }
});