const html = document.documentElement;
const switchInput = document.getElementById("modoSwitch");

// Leer tema guardado en sessionStorage
if (sessionStorage.getItem("tema") === "dark") {
  html.setAttribute("data-bs-theme", "dark");
  switchInput.checked = true;
}

// Cambiar tema al usar el switch
switchInput.addEventListener("change", () => {
  if (switchInput.checked) {
    html.setAttribute("data-bs-theme", "dark");
    sessionStorage.setItem("tema", "dark");
  } else {
    html.setAttribute("data-bs-theme", "light");
    sessionStorage.setItem("tema", "light");
  }
});
