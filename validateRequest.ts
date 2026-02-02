import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { ApiError } from "../utils/ApiError";

type ValidationSchema = {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
  headers?: ObjectSchema;
};

export const validateRequest =
  (schema: ValidationSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const errors: string[] = [];

    const validate = (
      joiSchema: ObjectSchema | undefined,
      data: unknown,
      property: string
    ) => {
      if (!joiSchema) return;

      const { error, value } = joiSchema.validate(data, {
        abortEarly: false,      // collect all errors
        allowUnknown: false,   // reject extra fields
        stripUnknown: true,    // remove unexpected keys
      });

      if (error) {
        error.details.forEach((detail) => {
          errors.push(`${property}: ${detail.message}`);
        });
      } else {
        // overwrite with sanitized values
        (req as any)[property] = value;
      }
    };

    validate(schema.body, req.body, "body");
    validate(schema.params, req.params, "params");
    validate(schema.query, req.query, "query");
    validate(schema.headers, req.headers, "headers");

    if (errors.length > 0) {
      return next(
        new ApiError(400, "Validation failed", errors)
      );
    }

    next();
  };
