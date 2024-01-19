import { Static, Type } from "@sinclair/typebox";
import Ajv from "ajv";
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";
import { NextFunction, Request, Response } from "express";

const signInGoogleDTOSchema = Type.Object(
  {
    email: Type.String({
      format: "email",
      errorMessage: {
        format: " it isn't a email valid",
        type: "its's should be a string",
      },
    }),
  },
  {
    additionalProperties: true,
  }
);

type SignInGoogleDTOSchema = Static<typeof signInGoogleDTOSchema>;

const ajv = new Ajv({ allErrors: true }).addKeyword("instanceOf");
addErrors(ajv);
addFormats(ajv, ["email"]);

const validate = ajv.compile<SignInGoogleDTOSchema>(signInGoogleDTOSchema);

const validateSignInGoogleDto = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let isDTOvalid = validate(req.body);

  if (!isDTOvalid) {
    return res.status(400).json({
      ok: false,
      statusText: "data received isn't valid",
      errors: validate.errors,
    });
  }

  return next();
};

export default validateSignInGoogleDto;
