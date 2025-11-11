// js/index_medicos.js
import { Medico } from "./claseMedico.js";
import {
  configurarFiltros,
  actualizarEstadoBotonFiltros,
  renderizarOffcanvasFiltros,
} from "./filtrosMedicos.js";

document.addEventListener("DOMContentLoaded", async () => {
  const medicos = await Medico.cargarDatosIniciales();
  console.log("Médicos cargados:", medicos);

  renderizarMedicos(medicos);
  renderizarOffcanvasFiltros();

  // Inicializar filtros reutilizables
  configurarFiltros({
    lista: medicos,
    renderCallback: renderizarMedicos,
  });

  actualizarEstadoBotonFiltros();

  configurarModalMedico();
});

// 🧠 LÓGICA DEL MODAL
// =================================================================

/**
 * Razón: Esta función configura el escuchador de eventos de Bootstrap para
 * interceptar el momento en que se va a mostrar el modal y rellenarlo.
 */
function configurarModalMedico() {
    // El ID 'modalDetalleMedico' debe coincidir con el ID en index.html
    const modalDetalleMedico = document.getElementById('modalDetalleMedico');
    
    // Escuchar el evento 'show.bs.modal'
    modalDetalleMedico.addEventListener('show.bs.modal', (event) => {
        // 'relatedTarget' es el botón que se hizo clic
        const boton = event.relatedTarget; 
        
        // Obtener el ID del médico del atributo data-medico-id
        const medicoId = parseInt(boton.getAttribute('data-medico-id'));

        // Usar el método estático de la clase Medico (que añadimos antes)
        const medico = Medico.buscarMedicoPorId(medicoId); 

        if (medico) {
            rellenarModal(medico);
        } else {
            console.error(`Médico con ID ${medicoId} no encontrado.`);
        }
    });
}

// 🧠 LÓGICA DEL MODAL
/**
 *  función que inyecta los datos del objeto Medico en la estructura
 * del modal definida en el index.html.
 */
function rellenarModal(medico) {
    // Ajuste del formato del valor de consulta
    const valorConsultaStr = medico.valorConsulta > 0 ? `$${medico.valorConsulta.toFixed(2)}` : 'Consultar';
    const fotoURL = medico.fotografia || 'https://via.placeholder.com/150';

    // Rellenar elementos estáticos del modal
    document.getElementById('detalleMedicoFoto').src = fotoURL;
    document.getElementById('detalleMedicoNombreCompleto').textContent = `${medico.nombre} ${medico.apellido}`;
    document.getElementById('detalleMedicoEspecialidad').textContent = medico.getEspecialidadNombre();
    document.getElementById('detalleMedicoMatricula').textContent = medico.matricula || 'N/A';
    document.getElementById('detalleMedicoValorConsulta').textContent = valorConsultaStr;
    document.getElementById('detalleMedicoDescripcion').textContent = medico.descripcion || 'No hay descripción disponible para este profesional.';
    
    // Rellenar Obras Sociales (Lista dinámica)
    const ulObrasSociales = document.getElementById('detalleMedicoObrasSociales');
    ulObrasSociales.innerHTML = ''; // Limpiar lista anterior
    
    const obrasSocialesNombres = medico.getObrasSocialesNombres();
    
    if (obrasSocialesNombres && obrasSocialesNombres.length > 0) {
        obrasSocialesNombres.forEach(os => {
            const li = document.createElement('li');
            li.classList.add('d-flex', 'align-items-center', 'mb-1');
            li.innerHTML = `<i class="fa-solid fa-check text-success me-2"></i> ${os}`;
            ulObrasSociales.appendChild(li);
        });
    } else {
        ulObrasSociales.innerHTML = '<li><i class="fa-solid fa-triangle-exclamation text-warning me-2"></i> Solo atiende consultas privadas.</li>';
    }

    // Rellenar el selector de descuento
    const selectorOS = document.getElementById('selectorObraSocial');
    
    selectorOS.innerHTML = '<option value="">Precio sin Obra Social</option>'; // Opción por defecto
    selectorOS.dataset.precioBase = medico.valorConsulta; // Guardamos el precio base en el selector

    // Normalizar los IDs de Obra Social del médico a strings
    const idsObraSocialMedico = medico.obrasSociales.map(id => id.toString());
    //filtrar las obras sociales que atiende el médico
    const obrasAtendidas = Medico.obrasSociales.filter(os => 
        idsObraSocialMedico.includes(os.id.toString())
    );

    //crear las opciones del selector
    obrasAtendidas.forEach(os => {
      const option = document.createElement('option');
       // Guardamos el ID de la OS y el porcentaje de cobertura 
      option.value = os.id;
      option.dataset.cobertura = os.porcentaje || 0; // guardamos el porcentaje de cobertura
      option.textContent = `${os.nombre} (${os.porcentaje || 0}% de cobertura)`;
      selectorOS.appendChild(option);
    });

    // 4. Asignar/Reasignar el Listener de cambio
    // Es crucial asignar el listener DESPUÉS de haber llenado el selector con todas las opciones.
    // removeEventListener evita que se acumulen múltiples listeners cada vez que se abre el modal. 

    selectorOS.removeEventListener('change', calcularPrecioFinal); // Evitar duplicados
    selectorOS.addEventListener('change', calcularPrecioFinal);

    // Inicializar el Precio Final con el precio base
    document.getElementById('detalleMedicoPrecioFinal').textContent = 
        medico.valorConsulta.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    // Actualizar el enlace del botón "Sacar Turno" en el modal
    const btnTurnoModal = document.getElementById('btnSacarTurnoModal');
        btnTurnoModal.href = `reservas.html?medicoId=${medico.id}`; 
  } 

function calcularPrecioFinal() {
    const selectorOS = document.getElementById('selectorObraSocial');
    const displayPrecioFinal = document.getElementById('detalleMedicoPrecioFinal');
    const precioBase = parseFloat(selectorOS.dataset.precioBase);
    
    // Obtener la opción seleccionada
    const selectedOption = selectorOS.options[selectorOS.selectedIndex];
    
    // Si se selecciona la opción por defecto (value=""), no hay descuento
    if (selectorOS.value === "") {
        displayPrecioFinal.textContent = precioBase.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
        displayPrecioFinal.classList.remove('text-primary');
        displayPrecioFinal.classList.add('text-success'); // Vuelve a color original
        return;
    }
    
    // Obtener el porcentaje de descuento del data-atributo
    const cobertura = parseFloat(selectedOption.dataset.cobertura) / 100;

    // Calculamos el porcentaje que PAGA el paciente (el copago)
    const copago = 1 - cobertura; // Si la cobertura es 0.90 (90%), el copago es 0.10 (10%)

    const precioFinal = precioBase * copago;
    
    // Mostrar el precio calculado
    displayPrecioFinal.textContent = precioFinal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    displayPrecioFinal.classList.remove('text-success');
    displayPrecioFinal.classList.add('text-primary'); // Cambia a color de descuento
}
// =================================================================
// 🎨 FUNCIÓN DE RENDERIZADO

function renderizarMedicos(lista) {
  const contenedor = document.getElementById("medicosContainer");
  
  if (!contenedor) { 
        console.error("Contenedor de médicos no encontrado.");
        return;
    }
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML =
      '<p class="text-center text-muted mt-4">No hay médicos para mostrar</p>';
    return;
  }

  lista.forEach((medico) => {
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

    const obrasText = medico.getObrasSocialesNombres().join(", ");
    small.textContent = obrasText
      ? `Obras Sociales : ${obrasText}`
      : "Consultas Privadas";

    obras.appendChild(small);

    //  NUEVA SECCIÓN: BOTONES DE ACCIÓN 
    // =========================================
    
    const botonera = document.createElement("div");
    // ms-auto y mt-auto aseguran que los botones se peguen al final si la tarjeta es alta
    botonera.className = "d-grid gap-2 d-md-block mt-3 w-100 mt-auto"; 

    // 1. Botón Sacar Turno
    const btnTurno = document.createElement("a");
    btnTurno.className = "btn btn-primary btn-sm";
    btnTurno.href = `reservas.html?medico_id=${medico.id}`;
    btnTurno.innerHTML = '<i class="fa-solid fa-calendar-check me-1"></i> Sacar Turno';

    // 2. Botón Más Información
    const btnInfo = document.createElement("button");
    btnInfo.className = "btn btn-outline-secondary btn-sm";
    // Asumimos que tiene generarUrlDetalle(), si no, usamos el fallback
    const urlDetalle = medico.generarUrlDetalle ? medico.generarUrlDetalle() : `medico-detalle.html?id=${medico.id}`;
    btnInfo.href = urlDetalle;
    btnInfo.textContent = 'Más Información';

    // ATRIBUTOS CLAVE DE BOOTSTRAP Y EL ID
    btnInfo.setAttribute('type', 'button');
    btnInfo.setAttribute('data-bs-toggle', 'modal');
    btnInfo.setAttribute('data-bs-target', '#modalDetalleMedico'); // ID del modal en index.html
    btnInfo.setAttribute('data-medico-id', medico.id); // ID ÚNICO DEL MÉDICO

    botonera.append(btnTurno, btnInfo);


    body.append(h5, especialidad, obras, botonera);
    card.append(img, body);
    col.append(card);
    contenedor.append(col);
  });
}
