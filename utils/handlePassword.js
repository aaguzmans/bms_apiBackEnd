const bcryptjs = require("bcryptjs");

const encrypt = async (passwordPlain) => {
  const hash = await bcryptjs.hash(passwordPlain, 10);
  return hash;
};

/**
 * Pasar contraseña sin encriptar y pasar contraseña encriptada
 * @param {*} passwordPlain 
 * @param {*} hashPassword 
 * @returns 
 */
const compare = async (passwordPlain, hashPassword) => {
  try {
    const passwordMatch = await bcryptjs.compare(passwordPlain, hashPassword);

    if (passwordMatch) {
      // Las contraseñas coinciden
      return true;
    } else {
      // Las contraseñas no coinciden
      return false;
    }
  } catch (error) {
    // Manejar errores de comparación
    console.error("Error Comparing Passwords:", error);
    throw error; // Puedes personalizar la gestión de errores según tus necesidades
  }
};

module.exports = { encrypt, compare };
