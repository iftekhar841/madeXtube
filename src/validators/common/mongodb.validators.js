import { param } from "express-validator";

/**
 *
 * @param {string} idName
 * @description A common validator responsible to validate mongodb ids passed in the url's path variable
 */

export const mongoIdPathVariableValidator = (idName) => {
    console.log("idname", idName);
    return [
        param(idName).notEmpty().isMongoId().withMessage(`Invalid mongodb id: ${idName}`)
    ]
}