import { param, body,  validationResult } from "express-validator";

/**
 *
 * @param {string} idName
 * @description A common validator responsible to validate mongodb ids passed in the url's path variable
 */

export const mongoIdPathVariableValidator = (idName) => {
  console.log("idname", idName);
  return [
    param(idName)
      .notEmpty()
      .isMongoId()
      .withMessage(`Invalid mongodb id: ${idName}`),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation error",
          errors: errors.array(),
        });
      }
      next();
    },
  ];
};




/**
 *
 * @param {string} idName
 * @description  A common validator responsible to validate mongodb ids passed in the request body
 */

export const mongoIdRequestBodyValidator  = (idName) => {
  return [
    body(idName)
      .notEmpty()
      .isMongoId()
      .withMessage(`Invalid mongodb id: ${idName}`),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation error",
          errors: errors.array(),
        });
      }
      next();
    },
  ];
};