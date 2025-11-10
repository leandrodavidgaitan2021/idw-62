//servivios_obraSociales.js

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
          titulo: `¿Eliminar Obra Social: ${obra.nombre}?`,
          texto: "Esta acción no se puede deshacer.",
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
          <div class="d-flex gap-2">
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

           <!-- Porcentaje -->
            <div class="mb-3 d-flex align-items-center">
              <label for="swalPorcentaje" class="form-label fw-semibold me-2 mb-0">Porcentaje:</label>
              <div class="input-group" style="width: 120px;">
                <input
                  id="swalPorcentaje"
                  type="number"
                  class="form-control text-end"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="1"
                  value="${obra?.porcentaje || ""}"
                >
                <span class="input-group-text">%</span>
              </div>
            </div>
          
          </div>
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: obra ? "Actualizar" : "Agregar",
      cancelButtonText: "Cancelar",
      width: window.innerWidth < 576 ? "90%" : "600px", // más angosto en móvil
      customClass: {
        title: obra ? "text-warning" : "text-primary", // Amarillo para editar, verde para nuevo
      },
      preConfirm: () => {
        const nombre = document.getElementById("swalNombre").value.trim();
        const descripcion = document
          .getElementById("swalDescripcion")
          .value.trim();
        const porcentaje = parseFloat(
          document.getElementById("swalPorcentaje").value.trim()
        );

        if (!nombre || !descripcion || isNaN(porcentaje)) {
          Swal.showValidationMessage("Completa todos los campos");
          return false;
        }
        if (porcentaje < 0 || porcentaje > 100) {
          Swal.showValidationMessage("El porcentaje debe estar entre 0 y 100");
          return false;
        }

        return { nombre, descripcion, porcentaje };
      },
    });

    if (!formValues) return;

    if (obra) {
      // Editar
      obra.nombre = formValues.nombre;
      obra.descripcion = formValues.descripcion;
      obra.porcentaje = parseInt(formValues.porcentaje, 10);
      obra.guardarObraSocial();
    } else {
      // Nueva
      const nuevaObra = new ObraSocial({
        id: ObraSocial.siguienteId(),
        nombre: formValues.nombre,
        descripcion: formValues.descripcion,
        porcentaje: parseInt(formValues.porcentaje, 10),
      });
      nuevaObra.guardarObraSocial();
    }

    obrasSociales = ObraSocial.obtenerObrasSociales();
    renderizarTabla(obrasSociales);
  }
});
