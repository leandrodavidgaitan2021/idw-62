// js/usuarios.js

document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('usuariosTableBody');
    const API_URL_USERS = 'https://dummyjson.com/users';

    // Función para obtener y mostrar los usuarios
    const cargarUsuarios = async () => {
        try {
            const response = await fetch(API_URL_USERS);
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de usuarios.');
            }
            const data = await response.json();
            
            // Limpiamos el cuerpo de la tabla
            tbody.innerHTML = ''; 

            // REQUERIMIENTO: Mostrar usuarios sin datos sensibles
            data.users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.username}</td>
                    <td>${user.age}</td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${error.message}</td></tr>`;
        }
    };

    // Llamamos a la función al cargar la página
    cargarUsuarios();
});