import { ApiError } from "../utils/ApiError.js";

export const validateRequest = (schema) => {
  return (req, _res, next) => {
    const errors = [];

    const validate = (joiSchema, data, property) => {
      if (!joiSchema) return;

      const { error, value } = joiSchema.validate(data, {
        abortEarly: false,    // collect all errors
        allowUnknown: false, // reject extra fields
        stripUnknown: true,  // remove unknown keys
      });

      if (error) {
        error.details.forEach((detail) => {
          errors.push(`${property}: ${detail.message}`);
        });
      } else {
        req[property] = value; // overwrite with sanitized data
      }
    };

    validate(schema.body, req.body, "body");
    validate(schema.params, req.params, "params");
    validate(schema.query, req.query, "query");
    validate(schema.headers, req.headers, "headers");

    if (errors.length > 0) {
      return next(new ApiError(400, "Validation failed", errors));
    }

    next();
  };
};
