// ================== ALERTA DE CONFIRMACIÓN REUTILIZABLE ==================
export async function confirmarAccion({
  titulo = "¿Estás seguro?",
  texto = "Esta acción no se puede deshacer.",
  icono = "warning",
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
