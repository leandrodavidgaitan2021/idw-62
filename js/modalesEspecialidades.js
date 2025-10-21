export const modalNuevaEspecialidad = `
<!-- Modal Nueva Especialidad -->
    <div
      class="modal fade"
      id="modalNuevaEsp"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nueva Especialidad</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
            <form id="formNuevaEsp">
              <div class="row mb-1">
                <div
                  class="col-12 col-md-8 d-flex align-items-center mb-2 mb-md-0"
                >
                  <label for="nuevaEsp" class="form-label me-2 mb-0 fw-bold"
                    >Nombre de la especialidad</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="nuevaEsp"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button type="button" class="btn btn-success" id="btnGuardarNuevaEsp">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
`;

export const modalEditarEspecialidad = `
    <!-- Modal Editar Especialidad -->
    <div
      class="modal fade"
      id="modalEditarEsp"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="mb-0 row align-items-center">
              <label
                for="selectEditarEsp"
                class="d-none d-sm-block col-auto col-form-label fw-bold"
              >Seleccionar especialidad a editar</label>
              <div class="col">
                <select
                  class="form-select"
                  id="selectEditarEsp"
                  required
                ></select>
              </div>
            </div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
            <form id="formEditarEsp">
              <div class="row mb-1">
                <div
                  class="col-12 col-md-8 d-flex align-items-center mb-2 mb-md-0"
                >
                  <label for="editarNombreEsp" class="form-label me-2 mb-0 fw-bold"
                    >Nombre de la especialidad</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="editarNombreEsp"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button type="button" class="btn btn-primary" id="btnGuardarEditarEsp">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
`;

export const modalEliminarEspecialidad = `
    <!-- Modal Eliminar Especialidad -->
    <div
      class="modal fade"
      id="modalEliminarEsp"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Eliminar Especialidad</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
            <label>Seleccionar Especialidad</label>
            <select class="form-select" id="selectEliminarEsp"></select>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" id="btnEliminarEsp">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
`;