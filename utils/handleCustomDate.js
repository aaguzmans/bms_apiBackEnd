// Función de validación personalizada para verificar el formato de fecha
const isValidDate = (value) => {
    // Expresión regular para el formato dd-MM-yyyy
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  
    // Comprueba si el valor coincide con el formato dd-MM-yyyy
    if (!dateRegex.test(value)) {
      throw new Error("La fecha debe estar en formato dd-MM-yyyy");
    }
  
    // La fecha tiene el formato correcto
    return true;
  };

module.exports = isValidDate