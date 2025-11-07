// === filtrosTurnos.js ===
// Filtro Offcanvas para turnos: por nombre de médico y especialidad

export function renderizarOffcanvasFiltrosTurnos() {
  const offcanvasHTML = `
    <!-- Offcanvas Filtros Turnos -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasFiltrosTurnos" aria-labelledby="offcanvasFiltrosTurnosLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasFiltrosTurnosLabel">Filtros de Turnos</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
      </div>
      <div class="offcanvas-body">
        <div class="mb-3">
          <label for="filtroNombreMedico" class="form-label">Nombre o Apellido del Médico</label>
          <input type="text" id="filtroNombreMedico" class="form-control" placeholder="Ej: Pérez o Juan">
        </div>
        <div class="mb-3">
          <label for="filtroEspecialidad" class="form-label">Especialidad</label>
          <select class="form-select" id="filtroEspecialidad">
            <option value="">Todas</option>
          </select>
        </div>
        <div class="d-flex gap-3 mt-4">
          <button class="btn btn-outline-secondary flex-fill" id="btnLimpiarFiltrosTurnos">
            Limpiar
          </button>
          <button class="btn btn-primary flex-fill" id="btnAplicarFiltrosTurnos">
            Aplicar
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", offcanvasHTML);
}

// 🔹 Actualiza el color del botón según si hay filtros activos
export function actualizarEstadoBotonFiltrosTurnos(
  storageKey = "filtrosTurnos"
) {
  const botonFiltro = document.querySelector(
    'button[data-bs-target="#offcanvasFiltrosTurnos"]'
  );
  if (!botonFiltro) return;

  const filtros = JSON.parse(localStorage.getItem(storageKey));
  const hayFiltro =
    filtros &&
    ((filtros.nombre && filtros.nombre.trim() !== "") ||
      (filtros.especialidad && filtros.especialidad !== ""));

  botonFiltro.classList.toggle("btn-primary", hayFiltro);
  botonFiltro.classList.toggle("btn-outline-primary", !hayFiltro);
}

// 🔹 Cargar <select> de especialidades desde localStorage
export function cargarSelectEspecialidades(selectElement) {
  const especialidades =
    JSON.parse(localStorage.getItem("especialidades")) || [];
  selectElement.innerHTML = '<option value="">Todas</option>';

  especialidades.forEach((e) => {
    const option = document.createElement("option");
    option.value = e.id;
    option.textContent = e.nombre;
    selectElement.appendChild(option);
  });
}

// 🔹 Configurar filtros de turnos
export function configurarFiltrosTurnos({
  lista,
  medicos,
  renderCallback,
  storageKey = "filtrosTurnos",
}) {
  const inputNombre = document.getElementById("filtroNombreMedico");
  const selectEspecialidad = document.getElementById("filtroEspecialidad");
  const btnAplicar = document.getElementById("btnAplicarFiltrosTurnos");
  const btnLimpiar = document.getElementById("btnLimpiarFiltrosTurnos");
  const offcanvas = document.getElementById("offcanvasFiltrosTurnos");

  if (!inputNombre || !selectEspecialidad || !btnAplicar || !offcanvas) return;

  const normalizar = (texto) =>
    texto
      ? texto
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      : "";

  function aplicarFiltros(desdeInicio = false) {
    const nombreFiltro = inputNombre.value.trim().toLowerCase();
    const especialidadFiltro = parseInt(selectEspecialidad.value) || null;

    const inputFecha = document.getElementById("fechaFiltro");
    if (inputFecha) inputFecha.value = "";

    if (!desdeInicio) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          nombre: nombreFiltro,
          especialidad: especialidadFiltro,
        })
      );
    }

    const filtrados = lista.filter((turno) => {
      const medico = medicos.find((m) => m.id === turno.idMedico);
      if (!medico) return false;

      let coincideNombre = true;
      let coincideEspecialidad = true;

      if (nombreFiltro) {
        const nombre = normalizar(medico.nombre);
        const apellido = normalizar(medico.apellido);
        coincideNombre =
          nombre.includes(nombreFiltro) || apellido.includes(nombreFiltro);
      }

      if (especialidadFiltro) {
        coincideEspecialidad =
          parseInt(medico.especialidad) === especialidadFiltro;
      }

      return coincideNombre && coincideEspecialidad;
    });

    renderCallback(filtrados);
    actualizarEstadoBotonFiltrosTurnos(storageKey);
  }

  // 🔹 Cuando se abre el panel, cargar selects y valores previos
  offcanvas.addEventListener("show.bs.offcanvas", () => {
    cargarSelectEspecialidades(selectEspecialidad);
    const filtrosPrevios = JSON.parse(localStorage.getItem(storageKey));
    if (filtrosPrevios) {
      inputNombre.value = filtrosPrevios.nombre || "";
      selectEspecialidad.value = filtrosPrevios.especialidad || "";
    }
  });

  // 🔹 Aplicar filtros con botón
  btnAplicar.addEventListener("click", () => {
    aplicarFiltros();
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
    if (offcanvasInstance) offcanvasInstance.hide();
  });

  // 🔹 Aplicar filtros al presionar Enter
  inputNombre.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      aplicarFiltros();
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
      if (offcanvasInstance) offcanvasInstance.hide();
    }
  });

  // 🔹 Limpiar filtros
  btnLimpiar.addEventListener("click", () => {
    inputNombre.value = "";
    selectEspecialidad.value = "";
    localStorage.removeItem(storageKey);
    actualizarEstadoBotonFiltrosTurnos(storageKey);
    renderCallback(lista);
  });

  // ✅ Aplicar filtros automáticamente si hay filtros previos
  setTimeout(() => {
    const filtrosPrevios = JSON.parse(localStorage.getItem(storageKey));
    if (
      filtrosPrevios &&
      (filtrosPrevios.nombre || filtrosPrevios.especialidad)
    ) {
      inputNombre.value = filtrosPrevios.nombre || "";
      selectEspecialidad.value = filtrosPrevios.especialidad || "";
      aplicarFiltros(true);
    } else {
      renderCallback(lista);
    }
  }, 300);
}
