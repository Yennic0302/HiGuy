import { Dictionary } from "@prisma/client/runtime/library";
import { Static, Type } from "@sinclair/typebox";
import Ajv from "ajv";
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";
import { NextFunction, Request, Response } from "express";

const signUpDTOSchema = Type.Object(
  {
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
    password: Type.String({
      minLength: 8,
      errorMessage: {
        type: " its's should be a string",
        minLength: "it's migth have min 8 characters",
      },
    }),
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: "received more data than is require",
    },
  }
);

type SignUpDTOType = Static<typeof signUpDTOSchema>;

const ajv = new Ajv({ allErrors: true }).addKeyword("instanceOf");
addFormats(ajv, ["email"]);
addErrors(ajv);
const validateDTO = ajv.compile<SignUpDTOType>(signUpDTOSchema);

const validateSignUpDto = (req: Request, res: Response, next: NextFunction) => {
  const removeSpaces = (obj: Dictionary<string>) => {
    const valuesWithOutSpaces: Dictionary<string> = {};

    const valuesFromObject: string[] = Object.keys(obj);

    for (let value of valuesFromObject) {
      valuesWithOutSpaces[value] = obj[value].trim();
    }
    return valuesWithOutSpaces;
  };
  const isDTOvalid = validateDTO(removeSpaces(req.body));

  if (!isDTOvalid)
    return res.status(400).json({
      ok: false,
      statusText: "data received isn't valid",
      errors: validateDTO.errors,
    });

  return next();
};

export default validateSignUpDto;
