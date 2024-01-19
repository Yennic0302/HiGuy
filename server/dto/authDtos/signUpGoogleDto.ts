import { Static, Type } from "@sinclair/typebox";
import Ajv from "ajv";
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";
import { NextFunction, Request, Response } from "express";

const signUpGoogleDTOSchema = Type.Object(
  {
    typeSingUp: Type.String({
      default: "google",
      errorMessage: {
        type: "its's should be a string",
        required: "its is required",
      },
    }),
    name: Type.String({
      minLength: 3,
      maxLength: 15,
      errorMessage: {
        type: "its's should be a string",
        required: "its is required",
        maxLength: "it's migth have min 3 and max 15 characters",
        minLength: "it's migth have min 3 and max 15 characters",
      },
    }),
    lastName: Type.String({
      minLength: 3,
      maxLength: 15,
      errorMessage: {
        type: "its's should be a string",
        required: "its is required",
        maxLength: "it's migth have min 3 and max 15 characters",
        minLength: "it's migth have min 3 and max 15 characters",
      },
    }),

    email: Type.String({
      format: "email",
      errorMessage: {
        type: "its's should be a string",
        format: " it's should be an email valid",
        required: "its is required",
      },
    }),
  },
  {
    additionalProperties: true,
  }
);

type SignUpDTOType = Static<typeof signUpGoogleDTOSchema>;

const ajv = new Ajv({ allErrors: true }).addKeyword("instanceOf");
addFormats(ajv, ["email"]);
addErrors(ajv);
const validateDTO = ajv.compile<SignUpDTOType>(signUpGoogleDTOSchema);

const validateSignUpGoogleDto = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isDTOvalid = validateDTO(req.body);

  if (!isDTOvalid)
    return res.status(400).json({
      ok: false,
      statusText: "data received isn't valid",
      errors: validateDTO.errors,
    });

  return next();
};

export default validateSignUpGoogleDto;
