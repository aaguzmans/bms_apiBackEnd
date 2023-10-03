const { handleHttpError } = require("../utils/handleError")
/**
 * Array con los roles permitidos
 * @param {*} rol 
 * @returns 
 */
const checkRol = (roles) => (req, res, next) => {
    try {
        const { user } = req;

        const rolesByUser = user.rol;
        //verifica el rol
        const checkValueRol = roles.some((rolSingle) => rolesByUser.includes(rolSingle))
        
        if(!checkValueRol){
            handleHttpError(res,"USER_NOT_PERMISSIONS",403);
            return;
        }

        next();
    } catch (error) {
        handleHttpError(res, "ERROR_PERMISSIONS",403)
    }
}

module.exports = checkRol;