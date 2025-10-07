// js/index_medicos.js
import { Medico } from "./claseMedico.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Cargar todo desde LocalStorage o JSON si está vacío
  const medicos = await Medico.cargarDatosIniciales();
  console.log("Médicos cargados:", medicos);

  // Render inicial
  renderizarMedicos(medicos);
  configurarFiltros(medicos);

  // ============================
  // FUNCIONES
  // ============================
  // --- Detectar si hay filtros activos y cambiar color del botón ---
  function actualizarEstadoBotonFiltros() {
    const botonFiltro = document.querySelector(
      'button[data-bs-target="#offcanvasFiltros"]'
    );
    const filtros = JSON.parse(localStorage.getItem("filtrosMedicos"));

    // Verifica si hay al menos un filtro seleccionado
    const hayFiltro =
      filtros &&
      ((filtros.especialidad &&
        filtros.especialidad !== 0 &&
        filtros.especialidad !== "") ||
        (filtros.obraSocial &&
          filtros.obraSocial !== 0 &&
          filtros.obraSocial !== ""));

    if (hayFiltro) {
      // Cambiar a color activo
      botonFiltro.classList.remove("btn-outline-primary");
      botonFiltro.classList.add("btn-primary");
    } else {
      // Volver al color original
      botonFiltro.classList.remove("btn-primary");
      botonFiltro.classList.add("btn-outline-primary");
    }
  }

  // Llamar al cargar la página
  actualizarEstadoBotonFiltros();

  // Configurar filtros y eventos
  function configurarFiltros(listaMedicos) {
    const selectEspecialidad = document.getElementById("filtroEspecialidad");
    const selectObraSocial = document.getElementById("filtroObraSocial");
    const btnAplicar = document.getElementById("btnAplicarFiltros");
    const btnLimpiar = document.getElementById("btnLimpiarFiltros");
    const offcanvas = document.getElementById("offcanvasFiltros");

    // Cargar opciones desde localStorage cuando se abre el offcanvas
    offcanvas.addEventListener("show.bs.offcanvas", () => {
      cargarSelectDesdeLocalStorage("especialidades", selectEspecialidad);
      cargarSelectDesdeLocalStorage("obrasSociales", selectObraSocial);

      // 🔄 Cargar selección previa si existe
      const filtrosPrevios = JSON.parse(localStorage.getItem("filtrosMedicos"));
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
      console.log("Aplicando filtros:", {
        espSeleccionada,
        obraSeleccionada,
      });

      // 💾 Guardar filtros en localStorage
      localStorage.setItem(
        "filtrosMedicos",
        JSON.stringify({
          especialidad: espSeleccionada,
          obraSocial: obraSeleccionada,
        })
      );

      const filtrados = listaMedicos.filter((medico) => {
        // Si no hay filtros seleccionados → incluir todos
        if (!espSeleccionada && !obraSeleccionada) return true;

        let coincideEspecialidad = true;
        let coincideObra = true;

        // Comparar especialidad si se seleccionó una
        if (espSeleccionada) {
          coincideEspecialidad =
            medico.especialidad &&
            parseInt(medico.especialidad) === espSeleccionada;
        }

        // Comparar obra social si se seleccionó una
        if (obraSeleccionada) {
          const obrasIds = medico.obrasSociales || [];
          coincideObra = obrasIds
            .map((id) => parseInt(id))
            .includes(obraSeleccionada);
        }

        return coincideEspecialidad && coincideObra;
      });

      console.log("Filtrados:", filtrados);
      renderizarMedicos(filtrados);
      actualizarEstadoBotonFiltros();

      // Cerrar offcanvas después de aplicar filtros
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
      offcanvasInstance.hide();
    });

    // Limpiar filtros
    btnLimpiar.addEventListener("click", () => {
      selectEspecialidad.value = "";
      selectObraSocial.value = "";
      localStorage.removeItem("filtrosMedicos");
      actualizarEstadoBotonFiltros();
      renderizarMedicos(listaMedicos);
    });
  }

  // Cargar opciones en select
  function cargarSelectDesdeLocalStorage(key, selectElement) {
    const data = JSON.parse(localStorage.getItem(key)) || [];
    console.log(`Cargando ${key}:`, data);

    selectElement.innerHTML = '<option value="">Todas</option>';

    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id || item.nombre || item;
      option.textContent = item.nombre || item;
      selectElement.appendChild(option);
    });
  }

  // Renderizar tarjetas de médicos
  function renderizarMedicos(listaMedicos) {
    const contenedor = document.querySelector(
      ".row.g-4.justify-content-center"
    );
    contenedor.innerHTML = "";

    if (listaMedicos.length === 0) {
      contenedor.innerHTML =
        '<p class="text-center text-muted mt-4">No hay médicos para mostrar</p>';
      return;
    }

    listaMedicos.forEach((medico) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

      const card = document.createElement("div");
      card.className = "card text-center h-100 shadow-sm border-0";

      const img = document.createElement("img");
      img.src = medico.fotografia || "https://via.placeholder.com/120";
      img.alt = `Foto de ${medico.nombreCompleto()}`;
      img.className = "card-img-top rounded-circle mx-auto mt-4";
      img.style.width = "120px";
      img.style.height = "120px";
      img.style.objectFit = "cover";

      const body = document.createElement("div");
      body.className = "card-body";

      const h5 = document.createElement("h5");
      h5.className = "card-title fs-4";
      h5.textContent = medico.nombreCompleto();

      const especialidad = document.createElement("p");
      especialidad.className = "card-text fs-6";
      especialidad.textContent = `Especialidad: ${medico.getEspecialidadNombre()}`;

      const obras = document.createElement("p");
      obras.className = "card-text";
      const small = document.createElement("small");
      small.className = "text-muted";
      small.textContent = `Obras Sociales: ${medico.getObrasSocialesNombres()}`;
      obras.appendChild(small);

      body.appendChild(h5);
      body.appendChild(especialidad);
      body.appendChild(obras);

      card.appendChild(img);
      card.appendChild(body);
      col.appendChild(card);
      contenedor.appendChild(col);
    });
  }
});
