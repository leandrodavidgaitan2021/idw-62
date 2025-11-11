// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("loginForm");
    const loaderOverlay = document.getElementById("loader-overlay");
    const messageContainer = document.getElementById("messageContainer");
    
    const API_URL = "https://dummyjson.com/auth/login"; 
    
    const showLoader = () => loaderOverlay.classList.add('show');
    const hideLoader = () => loaderOverlay.classList.remove('show');

    const setFormDisabled = (disabled) => {
        form.querySelectorAll("input, button").forEach(el => el.disabled = disabled);
    };

    const showAlert = (tipo, texto) => {
        messageContainer.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${texto}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            showAlert("warning", "Por favor, ingrese usuario y contraseña.");
            return;
        }

        showLoader();
        setFormDisabled(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            
            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem("accessToken", data.token);
                sessionStorage.setItem("usuario", data.username);
                
                showAlert("success", `¡Bienvenido, <strong>${data.username}</strong>! Redirigiendo...`);
                setTimeout(() => window.location.href = "dashboard.html", 2000);
            
            } else {
                showAlert("danger", data.message || "Error desconocido.");
                setFormDisabled(false);
            }
        } catch (error) {
            console.error("Error en la petición de login:", error);
            showAlert("danger", "Error de conexión. Intente más tarde.");
            setFormDisabled(false);
        } finally {
            hideLoader();
        }
    });
});