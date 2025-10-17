document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("loginForm");
    const loaderOverlay = document.getElementById("loader-overlay");
    const messageContainer = document.getElementById("messageContainer");
    const API_URL = "https://teal-lollipop-0c9bb0.netlify.app/api/login";
    
    // Variables para gestionar las alertas y sus temporizadores
    let activeAlert = {
        bootstrapInstance: null,
        countdownInterval: null,
        autoCloseTimeout: null,
    };

    const showLoader = () => loaderOverlay.classList.add('show');
    const hideLoader = () => loaderOverlay.classList.remove('show');

    const setFormDisabled = (disabled) => {
        form.querySelectorAll("input, button").forEach(el => el.disabled = disabled);
    };

    // --- Función showAlert Refactorizada ---
    const showAlert = (tipo, texto, options = {}) => {
        const { autoClose = false, countdownMinutes = 0 } = options;
        
        // **CLAVE 1: Destrucción total de la alerta anterior y sus timers**
        // Esto previene la "condición de carrera" que causa el problema.
        if (activeAlert.bootstrapInstance) {
            activeAlert.bootstrapInstance.dispose();
        }
        clearInterval(activeAlert.countdownInterval);
        clearTimeout(activeAlert.autoCloseTimeout);
        messageContainer.innerHTML = '';

        const iconMap = {
            success: 'fa-check-circle',
            danger: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle'
        };
        const icon = `<i class="fa-solid ${iconMap[tipo] || 'fa-info-circle'} me-2"></i>`;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="alert alert-${tipo} d-flex align-items-center fade show" role="alert">
                <span class="message-content">${icon} ${texto}</span>
            </div>
        `;
        messageContainer.append(wrapper);
        
        // Guardamos la instancia de la nueva alerta para tener control total sobre ella.
        const newAlertElement = messageContainer.querySelector('.alert');
        activeAlert.bootstrapInstance = new bootstrap.Alert(newAlertElement);

        const messageContent = wrapper.querySelector('.message-content');

        if (countdownMinutes > 0) {
            setFormDisabled(true);
            const roundedMinutes = Math.floor(countdownMinutes);
            const endTime = Date.now() + roundedMinutes * 60 * 1000;

            const updateCountdown = () => {
                const distance = endTime - Date.now();
                if (distance < 0) {
                    clearInterval(activeAlert.countdownInterval);
                    messageContent.innerHTML = `${icon} ${texto} <strong>0m 00s</strong>`;
                    setFormDisabled(false);
                    return;
                }
                const minutes = Math.floor(distance / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                messageContent.innerHTML = `${icon} ${texto} <strong>${minutes}m ${seconds.toString().padStart(2, '0')}s</strong>`;
            };
            
            updateCountdown(); // Ejecutar inmediatamente
            activeAlert.countdownInterval = setInterval(updateCountdown, 1000);

        } else if (autoClose) {
            // **CLAVE 2: El nuevo timer solo actuará sobre la instancia activa**
            activeAlert.autoCloseTimeout = setTimeout(() => {
                if (activeAlert.bootstrapInstance) {
                    activeAlert.bootstrapInstance.close();
                }
            }, 4000);
        }
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
                sessionStorage.setItem("authToken", data.token);
                sessionStorage.setItem("usuario", username);
                showAlert("success", `¡Bienvenido, <strong>${username}</strong>!`);
                setTimeout(() => window.location.href = "dashboard.html", 1500);
            } else if (response.status === 429) {
                const baseMessage = data.message.split('. Intenta')[0];
                showAlert("danger", `${baseMessage}.`, {
                    autoClose: false,
                    countdownMinutes: data.timeLeftMinutes,
                });
            } else {
                showAlert("danger", data.message);
            }
        } catch (error) {
            console.error("Error en la petición de login:", error);
            showAlert("danger", "Error de conexión. Intente más tarde.");
        } finally {
            hideLoader();
            // **CLAVE 3: La condición aquí es más robusta**
            if (!sessionStorage.getItem('authToken') && !activeAlert.countdownInterval) {
                setFormDisabled(false);
            }
        }
    });
});