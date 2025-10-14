// js/filtrosMedicos.js

export function renderizarOffcanvasFiltros() {
  const offcanvasHTML = `
    <!-- Offcanvas Filtros -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasFiltros" aria-labelledby="offcanvasFiltrosLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasFiltrosLabel">Filtros</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
      </div>
      <div class="offcanvas-body">
        <div class="mb-3">
          <label for="filtroEspecialidad" class="form-label">Especialidad</label>
          <select class="form-select" id="filtroEspecialidad">
            <option value="">Todas</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="filtroObraSocial" class="form-label">Obra Social</label>
          <select class="form-select" id="filtroObraSocial">
            <option value="">Todas</option>
          </select>
        </div>
        <div class="d-flex gap-3 mt-4">
          <button class="btn btn-outline-secondary flex-fill" id="btnLimpiarFiltros">
            Limpiar
          </button>
          <button class="btn btn-primary flex-fill" id="btnAplicarFiltros">
            Aplicar
          </button>
        </div
      </div>
    </div>
  `;

  // 🔽 Insertar al final del body
  document.body.insertAdjacentHTML("beforeend", offcanvasHTML);
}

// 🔹 Actualiza el color del botón según si hay filtros activos
export function actualizarEstadoBotonFiltros(storageKey = "filtrosMedicos") {
  const botonFiltro = document.querySelector(
    'button[data-bs-target="#offcanvasFiltros"]'
  );
  const filtros = JSON.parse(localStorage.getItem(storageKey));

  const hayFiltro =
    filtros &&
    ((filtros.especialidad &&
      filtros.especialidad !== 0 &&
      filtros.especialidad !== "") ||
      (filtros.obraSocial &&
        filtros.obraSocial !== 0 &&
        filtros.obraSocial !== ""));

  if (hayFiltro) {
    botonFiltro.classList.remove("btn-outline-primary");
    botonFiltro.classList.add("btn-primary");
  } else {
    botonFiltro.classList.remove("btn-primary");
    botonFiltro.classList.add("btn-outline-primary");
  }
}

// 🔹 Carga un <select> con datos desde localStorage
export function cargarSelectDesdeLocalStorage(key, selectElement) {
  const data = JSON.parse(localStorage.getItem(key)) || [];
  selectElement.innerHTML = '<option value="">Todas</option>';

  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id || item.nombre || item;
    option.textContent = item.nombre || item;
    selectElement.appendChild(option);
  });
}

// 🔹 Configura el comportamiento de los filtros
export function configurarFiltros({
  lista,
  storageKey = "filtrosMedicos",
  renderCallback,
}) {
  const selectEspecialidad = document.getElementById("filtroEspecialidad");
  const selectObraSocial = document.getElementById("filtroObraSocial");
  const btnAplicar = document.getElementById("btnAplicarFiltros");
  const btnLimpiar = document.getElementById("btnLimpiarFiltros");
  const offcanvas = document.getElementById("offcanvasFiltros");

  // Cuando se abre el panel, carga los selects
  offcanvas.addEventListener("show.bs.offcanvas", () => {
    cargarSelectDesdeLocalStorage("especialidades", selectEspecialidad);
    cargarSelectDesdeLocalStorage("obrasSociales", selectObraSocial);

    // Cargar selección previa
    const filtrosPrevios = JSON.parse(localStorage.getItem(storageKey));
    if (filtrosPrevios) {
      if (filtrosPrevios.especialidad)
        selectEspecialidad.value = filtrosPrevios.especialidad;
      if (filtrosPrevios.obraSocial)
        selectObraSocial.value = filtrosPrevios.obraSocial;
    }
  });

  // Aplicar filtros
  btnAplicar.addEventListener("click", () => {
    const espSeleccionada = parseInt(selectEspecialidad.value) || null;
    const obraSeleccionada = parseInt(selectObraSocial.value) || null;

    // Guardar filtros
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        especialidad: espSeleccionada,
        obraSocial: obraSeleccionada,
      })
    );

    // Filtrar lista
    const filtrados = lista.filter((item) => {
      if (!espSeleccionada && !obraSeleccionada) return true;

      let coincideEsp = true;
      let coincideObra = true;

      if (espSeleccionada)
        coincideEsp = parseInt(item.especialidad) === parseInt(espSeleccionada);

      if (obraSeleccionada) {
        const obras = item.obrasSociales || [];
        coincideObra = obras.map(Number).includes(obraSeleccionada);
      }

      return coincideEsp && coincideObra;
    });

    renderCallback(filtrados);
    actualizarEstadoBotonFiltros(storageKey);

    // Cerrar panel
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
    offcanvasInstance.hide();
  });

  // Limpiar filtros
  btnLimpiar.addEventListener("click", () => {
    selectEspecialidad.value = "";
    selectObraSocial.value = "";
    localStorage.removeItem(storageKey);
    actualizarEstadoBotonFiltros(storageKey);
    renderCallback(lista);
  });
}
