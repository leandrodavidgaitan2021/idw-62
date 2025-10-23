import { ObraSocial } from "./claseObrasSociales.js";
import { confirmarAccion } from "./alertas.js";

document.addEventListener("DOMContentLoaded", async () => {
  let obrasSociales = await ObraSocial.cargarDatosInicialesOB();
  renderizarTabla(obrasSociales);

  // NUEVA OBRA
  document.getElementById("btnNuevaObra").addEventListener("click", () => {
    abrirModalObraSocial(null); // null = nueva
  });

  // EVENTOS DE TABLA (editar/eliminar)
  document
    .getElementById("obrasSocialesTableBody")
    .addEventListener("click", async (e) => {
      const id = parseInt(e.target.closest("button")?.dataset.id);
      if (!id) return;

      const obra = obrasSociales.find((o) => o.id === id);

      if (e.target.closest(".btn-eliminar")) {
        const confirmado = await confirmarAccion({
          titulo: "¿Eliminar obra social?",
          texto: "Esta acción no se puede deshacer.",
          icono: "warning",
          textoConfirmar: "Sí, eliminar",
        });
        if (!confirmado) return;

        ObraSocial.eliminarObraSocial(id);
        obrasSociales = ObraSocial.obtenerObrasSociales();
        renderizarTabla(obrasSociales);
      }

      if (e.target.closest(".btn-editar")) {
        abrirModalObraSocial(obra);
      }
    });

  // ================= FUNCIONES =================
  function renderizarTabla(lista) {
    const tbody = document.getElementById("obrasSocialesTableBody");
    tbody.innerHTML = "";
    if (!lista.length) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No hay obras sociales registradas.</td></tr>`;
      return;
    }
    lista.forEach((obra) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${obra.nombre}</td>
        <td class="d-none d-sm-table-cell">${obra.descripcion}</td>
        <td class="text-center">
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-warning btn-sm btn-editar" data-id="${obra.id}">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${obra.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  async function abrirModalObraSocial(obra) {
    const { value: formValues } = await Swal.fire({
      title: obra ? "Editar Obra Social" : "Nueva Obra Social",
      html: `
      <div class="container-fluid p-0">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto"
            <div class="mb-3">
              <label for="swalNombre" class="form-label fw-semibold">Nombre</label>
              <input id="swalNombre" type="text" class="form-control w-100" placeholder="Nombre" value="${
                obra?.nombre || ""
              }">
            </div>
            <div class="mb-3">
              <label for="swalDescripcion" class="form-label fw-semibold">Descripción</label>
              <textarea id="swalDescripcion" class="form-control w-100" placeholder="Descripción" rows="4">${
                obra?.descripcion || ""
              }</textarea>
            </div>
          </div>
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: obra ? "Actualizar" : "Agregar",
      cancelButtonText: "Cancelar",
      width: "auto", // deja que SweetAlert2 ajuste el ancho
      customClass: {
        title: obra ? "text-warning" : "text-primary", // Amarillo para editar, verde para nuevo
      },
      preConfirm: () => {
        const nombre = document.getElementById("swalNombre").value.trim();
        const descripcion = document
          .getElementById("swalDescripcion")
          .value.trim();
        if (!nombre || !descripcion) {
          Swal.showValidationMessage("Completa todos los campos");
          return false;
        }
        return { nombre, descripcion };
      },
    });

    if (!formValues) return;

    if (obra) {
      // Editar
      obra.nombre = formValues.nombre;
      obra.descripcion = formValues.descripcion;
      obra.guardarObraSocial();
    } else {
      // Nueva
      const nuevaObra = new ObraSocial({
        id: ObraSocial.siguienteId(),
        nombre: formValues.nombre,
        descripcion: formValues.descripcion,
      });
      nuevaObra.guardarObraSocial();
    }

    obrasSociales = ObraSocial.obtenerObrasSociales();
    renderizarTabla(obrasSociales);
  }
});
