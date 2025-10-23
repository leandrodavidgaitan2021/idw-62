// js/turnos.js

import { Especialidad } from "./claseEspecialidad.js" ; // Importación correcta de la clase

// ===================================================
// 1. CONSTANTES Y REFERENCIAS DOM
// ===================================================

const LS_KEY_TURNOS = 'turnos';
const LS_KEY_MEDICOS = 'medicos';


const tablaTurnosBody = document.querySelector('#tablaTurnos tbody');
const selectMedico = document.getElementById('medico');
// Razón: Necesitas inicializar los modales con la clase bootstrap.Modal
const modalTurno = new bootstrap.Modal(document.getElementById('modalTurno'));
const modalDetalleTurno = new bootstrap.Modal(document.getElementById('modalDetalleTurno'));
const formTurno = document.getElementById('formTurno');
const btnCrearTurno = document.getElementById('btnCrearTurno');


// ===================================================
// 2. GESTIÓN DE LOCALSTORAGE (LECTURA Y ESCRITURA)
// ===================================================

/**
 * Usa la clase importada. Obtiene la lista de especialidades.
 */
const getEspecialidades = () => {
    return Especialidad.obtenerEspecialidades(); 
};

/**
 * Obtiene la lista de turnos SIN filtros (para CRUD interno).
 */
const getTurnosRaw = () => {
    const turnosJSON = localStorage.getItem(LS_KEY_TURNOS);
    return turnosJSON ? JSON.parse(turnosJSON) : [];
};

/**
 * Obtiene la lista de médicos.
 */
const getMedicos = () => {
    const medicosJSON = localStorage.getItem(LS_KEY_MEDICOS);
    return medicosJSON ? JSON.parse(medicosJSON) : []; 
};

/**
 * Razón: Retorna la lista de turnos (filtrados) y renderiza la tabla.
 */
const obtenerTurnos = () => {
    const turnosJSON = localStorage.getItem(LS_KEY_TURNOS);
    let turnos = turnosJSON ? JSON.parse(turnosJSON) : [];
    
    // Razón: FILTRO CRÍTICO. Elimina registros con ID nulo o inválido para evitar fallos.
    turnos = turnos.filter(t => t && t.id && !isNaN(parseInt(t.id)) && parseInt(t.id) >= 1); 

    renderizarTabla(turnos);
    return turnos;
};


// ===================================================
// 3. FUNCIONES DE UTILERÍA (Búsqueda por ID)
// ===================================================

/**
 * Razón: Busca el nombre de la especialidad usando su ID.
 */
const buscarEspecialidadPorId = (id) => {
    const especialidades = getEspecialidades(); 
    const especialidad = especialidades.find(e => e.id === parseInt(id)); 
    
    if (especialidad) {
        return especialidad.nombre;
    } else {
        return 'Especialidad Desconocida';
    }
};

/**
 * Razón: Retorna el objeto Médico completo por su ID.
 */
const buscarMedicoPorId = (id) => {
    const medicos = getMedicos();
    return medicos.find(m => m.id === parseInt(id));
};


// ===================================================
// 4. FUNCIONES DE VISTA (Renderizado y Formulario)
// ===================================================

/**
 * Razón: Carga los médicos en el <select> e incluye compatibilidad de 'especialidad'/'especialidadId'.
 */
const cargarMedicosEnSelect = () => {
    const medicos = getMedicos();
    
    // Razón: Limpiar y establecer opción por defecto
    selectMedico.innerHTML = '<option value="">Seleccione un Médico...</option>'; 

    medicos.forEach(medico => {
        // Razón: COMPATIBILIDAD. Usa 'especialidadId' o 'especialidad' (el nombre corto).
        const especialidadID = medico.especialidadId || medico.especialidad;
        
        const nombreEspecialidad = buscarEspecialidadPorId(especialidadID); 
        
        const option = document.createElement('option');
        option.value = medico.id; 
        option.textContent = `${medico.nombre} ${medico.apellido} (${nombreEspecialidad})`; 
        // Razón: Guardamos el ID compatible para usarlo al guardar el turno.
        option.setAttribute('data-especialidad-id', especialidadID); 
        selectMedico.appendChild(option);
    });
};

/**
 * Muestra la lista de turnos en la tabla
 */
const renderizarTabla = (turnos) => {
    tablaTurnosBody.innerHTML = '';
    
    turnos.forEach(turno => {
        const medico = buscarMedicoPorId(turno.medicoId);
        const nombreMedico = medico ? `${medico.nombre} ${medico.apellido}` : 'Médico Desconocido';
        
        // Lógica de compatibilidad de nombres de paciente
        const dniPaciente = turno.dniPaciente || turno.paciente || 'N/A';
        const nombrePaciente = turno.nombrePaciente || 'Sin Nombre';

        // VINCULACIÓN DE ESPECIALIDAD REFORZADA
        // Razón: Busca el ID compatible en el objeto médico.
        const especialidadID = medico ? medico.especialidadId || medico.especialidad : null;
        
        const nombreEspecialidad = especialidadID 
            ? buscarEspecialidadPorId(especialidadID) 
            : 'Especialidad Desconocida';

        const row = tablaTurnosBody.insertRow();
        row.dataset.id = turno.id;
        
        row.innerHTML = `
            <td>${turno.id}</td>
            <td>${dniPaciente}</td>
            <td>${nombrePaciente}</td>
            <td>${nombreMedico}</td>
            <td>${nombreEspecialidad}</td>
            <td>${turno.fecha} ${turno.hora}</td>
            <td><span class="badge text-bg-success">${turno.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-info ver-detalle" data-id="${turno.id}"><i class="fa-solid fa-eye"></i></button>
                <button class="btn btn-sm btn-primary editar" data-id="${turno.id}"><i class="fa-solid fa-edit"></i></button>
                <button class="btn btn-sm btn-danger eliminar" data-id="${turno.id}"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
    });
    // Añadir listeners a los botones de la tabla
    document.querySelectorAll('.ver-detalle').forEach(btn => btn.addEventListener('click', (e) => visualizarDetalles(e.currentTarget.dataset.id)));
    document.querySelectorAll('.editar').forEach(btn => btn.addEventListener('click', (e) => cargarFormularioTurno(e.currentTarget.dataset.id)));
    document.querySelectorAll('.eliminar').forEach(btn => btn.addEventListener('click', (e) => eliminarTurno(e.currentTarget.dataset.id)));
};

/**
 * Razón: Carga los datos del turno seleccionado en el formulario para editar.
 */
const cargarFormularioTurno = (id = null) => {
    formTurno.reset();
    document.getElementById('turnoId').value = '';
    document.getElementById('modalTurnoLabel').textContent = 'Crear Nuevo Turno';

    if (id) {
        const turnos = obtenerTurnos();
        const turno = turnos.find(t => t.id == parseInt(id));
        if (turno) {
            document.getElementById('modalTurnoLabel').textContent = 'Modificar Turno';
            document.getElementById('turnoId').value = turno.id;
            
            document.getElementById('dniPaciente').value = turno.dniPaciente || turno.paciente;
            document.getElementById('nombrePaciente').value = turno.nombrePaciente || '';
            
            selectMedico.value = turno.medicoId;
            document.getElementById('fecha').value = turno.fecha;
            document.getElementById('hora').value = turno.hora;
            document.getElementById('motivo').value = turno.motivo;
        }
    }
    modalTurno.show();
};

/**
 * Razón: Muestra el detalle del turno en el modal.
 */
const visualizarDetalles = (id) => {
    const turnos = obtenerTurnos();
    const turno = turnos.find(t => t.id == parseInt(id));
    if (turno) {
        const medico = buscarMedicoPorId(turno.medicoId);
        const nombreMedico = medico ? `${medico.nombre} ${medico.apellido}` : 'Desconocido';
        
        const especialidadID = medico ? medico.especialidadId || medico.especialidad : null;
        const nombreEspecialidad = especialidadID 
            ? buscarEspecialidadPorId(especialidadID) 
            : 'Especialidad Desconocida';

        document.getElementById('detalleId').textContent = turno.id;
        document.getElementById('detallePaciente').textContent = `${turno.nombrePaciente || 'Sin Nombre'} (DNI: ${turno.dniPaciente || turno.paciente || 'N/A'})`;
        document.getElementById('detalleMedico').textContent = nombreMedico;
        document.getElementById('detalleEspecialidad').textContent = nombreEspecialidad;
        document.getElementById('detalleFechaHora').textContent = `${turno.fecha} ${turno.hora}`;
        document.getElementById('detalleMotivo').textContent = turno.motivo;
        modalDetalleTurno.show();
    }
};


// ===================================================
// 5. LÓGICA CRUD (Guardar y Eliminar)
// ===================================================

const guardarTurno = (e) => {
    e.preventDefault();
    
    const turnoIdExistente = document.getElementById('turnoId').value;
    const medicoId = selectMedico.value;
    
    const dniPaciente = document.getElementById('dniPaciente').value.trim();
    const nombrePaciente = document.getElementById('nombrePaciente').value.trim();
    
    // Razón: Obtenemos el ID compatible (sea 'especialidad' o 'especialidadId')
    const especialidadIdAttr = selectMedico.options[selectMedico.selectedIndex].getAttribute('data-especialidad-id');
    
    if (!medicoId || !especialidadIdAttr || !dniPaciente || !nombrePaciente) {
        alert('Por favor, complete todos los datos del paciente y seleccione un médico válido.');
        return;
    }
    
    let turnos = getTurnosRaw(); // Obtenemos la lista sin limpiar para el cálculo de ID.
    let turnoID;
    
    if (turnoIdExistente) {
        turnoID = parseInt(turnoIdExistente); 
    } else {
        // Razón: Buscamos el ID más alto de los turnos existentes.
        const maxId = turnos.reduce(
            (max, t) => (t.id > max ? t.id : max), 
            0
        );
        turnoID = maxId + 1;
    }
    
    const nuevoTurno = {
        id: turnoID, 
        dniPaciente: dniPaciente, 
        nombrePaciente: nombrePaciente, 
        medicoId: parseInt(medicoId),
        especialidadId: parseInt(especialidadIdAttr), // Guardamos el ID compatible
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        motivo: document.getElementById('motivo').value,
        estado: 'Confirmado',
    };

    if (turnoIdExistente) {
        turnos = turnos.map(t => t.id === nuevoTurno.id ? nuevoTurno : t);
    } else {
        turnos.push(nuevoTurno);
    }

    localStorage.setItem(LS_KEY_TURNOS, JSON.stringify(turnos));
    
    obtenerTurnos(); // Vuelve a cargar y renderizar con el filtro
    modalTurno.hide();
};

const eliminarTurno = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este turno?')) {
        let turnos = getTurnosRaw(); // Obtenemos la lista sin limpiar
        
        const idAEliminar = parseInt(id, 10); 
        
        turnos = turnos.filter(t => t.id !== idAEliminar); 
        
        localStorage.setItem(LS_KEY_TURNOS, JSON.stringify(turnos));
        obtenerTurnos(); 
    }
};


// ===================================================
// 6. INICIALIZACIÓN DE EVENTOS
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
    cargarMedicosEnSelect(); // La función ahora tiene la lógica de compatibilidad
    obtenerTurnos(); 

    btnCrearTurno.addEventListener('click', () => cargarFormularioTurno(null));
    formTurno.addEventListener('submit', guardarTurno);
});