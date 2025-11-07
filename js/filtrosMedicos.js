// js/filtrosMedicos.js

// 🔹 Renderiza el Offcanvas de filtros
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
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", offcanvasHTML);
}

// 🔹 Actualiza el color del botón de filtros según si hay alguno activo
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

  if (!botonFiltro) return; // 👈 evita error si el botón no existe aún

  botonFiltro.classList.toggle("btn-primary", hayFiltro);
  botonFiltro.classList.toggle("btn-outline-primary", !hayFiltro);
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

// 🔹 Configura comportamiento de filtros y aplica si hay guardados
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

  if (!selectEspecialidad || !selectObraSocial || !btnAplicar || !offcanvas)
    return;

  // 🔹 Cargar selects cuando se abre el panel
  offcanvas.addEventListener("show.bs.offcanvas", () => {
    cargarSelectDesdeLocalStorage("especialidades", selectEspecialidad);
    cargarSelectDesdeLocalStorage("obrasSociales", selectObraSocial);

    const filtrosPrevios = JSON.parse(localStorage.getItem(storageKey));
    if (filtrosPrevios) {
      selectEspecialidad.value = filtrosPrevios.especialidad || "";
      selectObraSocial.value = filtrosPrevios.obraSocial || "";
    }
  });

  // 🔹 Aplicar filtros manualmente
  btnAplicar.addEventListener("click", () => {
    const espSeleccionada = parseInt(selectEspecialidad.value) || null;
    const obraSeleccionada = parseInt(selectObraSocial.value) || null;

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        especialidad: espSeleccionada,
        obraSocial: obraSeleccionada,
      })
    );

    aplicarFiltros();
    const instancia = bootstrap.Offcanvas.getInstance(offcanvas);
    if (instancia) instancia.hide();
  });

  // 🔹 Limpiar filtros
  btnLimpiar.addEventListener("click", () => {
    selectEspecialidad.value = "";
    selectObraSocial.value = "";
    localStorage.removeItem(storageKey);
    actualizarEstadoBotonFiltros(storageKey);
    renderCallback(lista);
  });

  // 🔹 Función reutilizable para aplicar filtros guardados
  function aplicarFiltros() {
    if (!lista || lista.length === 0) return;

    const filtros = JSON.parse(localStorage.getItem(storageKey));
    if (!filtros) {
      renderCallback(lista);
      actualizarEstadoBotonFiltros(storageKey);
      return;
    }

    const { especialidad, obraSocial } = filtros;

    const filtrados = lista.filter((item) => {
      const coincideEsp =
        !especialidad || parseInt(item.especialidad) === especialidad;
      const coincideObra =
        !obraSocial ||
        (Array.isArray(item.obrasSociales) &&
          item.obrasSociales.map(Number).includes(obraSocial));

      return coincideEsp && coincideObra;
    });

    renderCallback(filtrados);
    actualizarEstadoBotonFiltros(storageKey);
  }

  // ✅ Aplicar automáticamente si hay filtros previos
  setTimeout(() => aplicarFiltros(), 200);
}
