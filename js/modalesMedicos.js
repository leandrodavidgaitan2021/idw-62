export const modalNuevoMedico = `
<!-- Modal Nuevo Médico -->
    <div
      class="modal fade"
      id="modalNuevoMedico"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nuevo Médico</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
            <form id="formNuevoMedico">
              <div class="row mb-1">
                <div
                  class="col-12 col-md-4 d-flex align-items-center mb-2 mb-md-0"
                >
                  <label for="nuevoMatricula" class="form-label me-2 mb-0 fw-bold"
                    >Matrícula</label
                  >
                  <input
                    type="number"
                    class="form-control"
                    id="nuevoMatricula"
                    required
                  />
                </div>
                <div
                  class="col-12 col-md-8 d-flex align-items-center mb-2 mb-md-0"
                >
                  <label for="nuevoApellido" class="form-label me-2 mb-0 fw-bold"
                    >Apellido</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="nuevoApellido"
                    required
                  />
                </div>
              </div>
              <div class="row mb-1">
                <div
                  class="col-12 col-md-7 d-flex align-items-center mb-2 mb-md-0"
                >
                  <label for="nuevoNombre" class="form-label me-2 mb-0 fw-bold"
                    >Nombre</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="nuevoNombre"
                    required
                  />
                </div>
                <div
                  class="col-12 col-md-5 d-flex align-items-center mb-2 mb-md-0"
                >
                  <label for="nuevoEspecialidad" class="form-label me-2 mb-0 fw-bold"
                    >Especialidad</label
                  >
                  <select
                    class="form-select"
                    id="nuevoEspecialidad"
                    required
                  ></select>
                </div>
              </div>
              <div class="row mb-1">
                <div class="col-12 col-md-6 mb-2 mb-md-0">
                  <label for="nuevoDescripcion" class="form-label fw-bold"
                    >Descripción</label
                  >
                  <textarea
                    class="form-control"
                    id="nuevoDescripcion"
                    rows="6"
                    required
                  ></textarea>
                </div>
                <div class="col-12 col-md-6 mb-2 mb-md-0">
                  <label for="nuevoFoto" class="form-label fw-bold">Fotografía</label>
                  <input
                    type="file"
                    class="form-control"
                    id="nuevoFoto"
                    accept="image/*"
                  />
                  <div class="text-center mt-1">
                    <img
                      id="previewNuevoFoto"
                      src="https://placehold.co/120x120"
                      alt="Vista previa"
                      class="rounded-circle img-custom"
                    />
                  </div>
                </div>
              </div>
              <hr class="my-1" />
              <div class="row mb-1 justify-content-center">
                <div class="col-12">
                  <label class="form-label d-block text-center fw-bold"
                    >Obras Sociales</label
                  >
                  <div class="row m-1" id="obrasSocialesContainer">
                    <!-- Checkboxes generados desde JS -->
                  </div>
                </div>
              </div>
              <hr class="my-1" />
              <div class="row mt-2 justify-content-center">
                <div class="col-12 col-md-6 mb-2 mb-md-0">
                  <div class="row align-items-center">
                    <div
                      class="col-4 col-sm-5 col-md-5 d-flex justify-content-end"
                    >
                      <label for="nuevoValorConsulta" class="form-label mb-0 fw-bold"
                        >Valor Consulta</label
                      >
                    </div>
                    <div class="col-8 col-sm-7 col-md-7">
                      <input
                        type="text"
                        class="form-control"
                        id="nuevoValorConsulta"
                        required
                        placeholder="Ingrese valor consulta"
                      />
                    </div>
                  </div>
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
            <button type="button" class="btn btn-success" id="btnGuardarNuevo">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
`;

export const modalEditarMedico = `
    <!-- Modal Editar Médico -->
    <div
      class="modal fade"
      id="modalEditarMedico"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
           <div class="modal-header">
            <h5 class="modal-title">Editar Médico</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
            <form id="formEditarMedico">
              <div class="row mb-1">
                <div
                  class="col-12 col-md-4 d-flex align-items-center mb-2 mb-md-0"
                >
                  <label for="editarMatricula" class="form-label me-2 mb-0 fw-bold"
                    >Matrícula</label
                  >
                  <input
                    type="number"
                    class="form-control"
                    id="editarMatricula"
                    disabled
                  />
                </div>
                <div
                  class="col-12 col-md-8 d-flex align-items-center mb-2 mb-md-0"
                >
                  <label for="editarApellido" class="form-label me-2 mb-0 fw-bold"
                    >Apellido</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="editarApellido"
                    required
                  />
                </div>
              </div>
              <div class="row mb-1">
                <div
                  class="col-12 col-md-7 d-flex align-items-center mb-2 mb-md-0"
                >
                  <label for="editarNombre" class="form-label me-2 mb-0 fw-bold"
                    >Nombre</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="editarNombre"
                    required
                  />
                </div>
                <div
                  class="col-12 col-md-5 d-flex align-items-center mb-2 mb-md-0"
                >
                  <label for="editarEspecialidad" class="form-label me-2 mb-0 fw-bold"
                    >Especialidad</label
                  >
                  <select
                    class="form-select"
                    id="editarEspecialidad"
                    required
                  ></select>
                </div>
              </div>
              <div class="row mb-1">
                <div class="col-12 col-md-6 mb-2 mb-md-0">
                  <label for="editarDescripcion" class="form-label fw-bold"
                    >Descripción</label
                  >
                  <textarea
                    class="form-control"
                    id="editarDescripcion"
                    rows="6"
                    required
                  ></textarea>
                </div>
                <!-- Dentro del Modal Editar Médico -->

                <div class="col-12 col-md-6 mb-2 mb-md-0">
                  <label for="editarFoto" class="form-label fw-bold">Fotografía</label>
                  <input
                    type="file"
                    class="form-control"
                    id="editarFoto"
                    accept="image/*"
                  />
                  <div class="text-center mt-1">
                    <img
                      id="previewEditarFoto"
                      src="https://placehold.co/120x120"
                      alt="Vista previa"
                      class="rounded-circle img-custom"
                    />
                  </div>
                </div>
              </div>
              <hr class="my-1" />
              <div class="row mb-1 justify-content-center">
                <div class="col-12">
                  <label class="form-label d-block text-center fw-bold"
                    >Obras Sociales</label
                  >
                  <div class="row m-1" id="editarObrasSocialesContainer">
                    <!-- Checkboxes generados desde JS -->
                  </div>
                </div>
              </div>
              <hr class="my-1" />
              <div class="row mt-2 justify-content-center">
                <div class="col-12 col-md-6 mb-2 mb-md-0">
                  <div class="row align-items-center">
                    <div
                      class="col-4 col-sm-5 col-md-5 d-flex justify-content-end"
                    >
                      <label for="editarValorConsulta" class="form-label mb-0 fw-bold"
                        >Valor Consulta</label
                      >
                    </div>
                    <div class="col-8 col-sm-7 col-md-7">
                      <input
                        type="text"
                        class="form-control"
                        id="editarValorConsulta"
                        required
                      />
                    </div>
                    <!-- 👇 agregá este campo oculto -->
                    <input type="hidden" id="editarId" />
                  </div>
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
            <button type="button" class="btn btn-primary" id="btnGuardarEditar">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
`;

export const modalEliminarMedico = `
    <!-- Modal Eliminar Médico -->
    <div
      class="modal fade"
      id="modalEliminarMedico"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Eliminar Médico</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
            <label>Seleccionar Médico</label>
            <select class="form-select" id="selectEliminarMedico"></select>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" id="btnEliminarMedico">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
`;
