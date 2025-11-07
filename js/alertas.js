// ================== ALERTA DE CONFIRMACIÓN REUTILIZABLE ==================
export async function confirmarAccion({
  titulo = "¿Estás seguro?",
  texto = "Esta acción no se puede deshacer.",
  icono = null,
  textoConfirmar = "Sí, confirmar",
  textoCancelar = "Cancelar",
}) {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: textoConfirmar,
    cancelButtonText: textoCancelar,
  });

  return result.isConfirmed;
}

// ================== ALERTA SIMPLE REUTILIZABLE ==================
export function mostrarAlerta(
  icono = "success",
  mensaje = "Operación exitosa"
) {
  Swal.fire({
    icon: icono,
    title: mensaje,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
}
