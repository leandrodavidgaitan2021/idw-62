const html = document.documentElement;
const switchInput = document.getElementById("modoSwitch");

// Leer tema guardado en localStorage
if (localStorage.getItem("tema") === "dark") {
  html.setAttribute("data-bs-theme", "dark");
  switchInput.checked = true;
}

// Cambiar tema al usar el switch
switchInput.addEventListener("change", () => {
  if (switchInput.checked) {
    html.setAttribute("data-bs-theme", "dark");
    localStorage.setItem("tema", "dark");
  } else {
    html.setAttribute("data-bs-theme", "light");
    localStorage.setItem("tema", "light");
  }
});
