import { Request, Response, NextFunction } from "express";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
import { Type, Static } from "@sinclair/typebox";
import { DataToSignIn } from "../../types/authTypes";

const signInDTOSchemaByEmail = Type.Object(
  {
    email: Type.String({
      format: "email",
      errorMessage: {
        format: " it isn't a email valid",
        type: "its's should be a string",
      },
    }),
    password: Type.String({
      errorMessage: {
        type: "it should be a string",
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

type SignInDTOSchemaByEmail = Static<typeof signInDTOSchemaByEmail>;

const signInDTOSchemaByUsername = Type.Object(
  {
    username: Type.String({
      errorMessage: {
        type: " it should be a string",
      },
    }),
    password: Type.String({
      errorMessage: {
        type: " it should be a string",
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

type SignInDTOSchemaByUsername = Static<typeof signInDTOSchemaByUsername>;

const ajv = new Ajv({ allErrors: true }).addKeyword("instanceOf");
addErrors(ajv);
addFormats(ajv, ["email"]);

const validateByEmail = ajv.compile<SignInDTOSchemaByEmail>(
  signInDTOSchemaByEmail
);
const validateByUsername = ajv.compile<SignInDTOSchemaByUsername>(
  signInDTOSchemaByUsername
);

const validateSignInDto = (req: Request, res: Response, next: NextFunction) => {
  let { typeToSignIn, usernameOrEmail, password }: DataToSignIn = req.body;

  if (typeToSignIn !== "username" && typeToSignIn !== "email")
    return res
      .status(400)
      .json({ ok: false, statustext: "error in type of SignIn " });

  let isDTOvalid;
  if (typeToSignIn === "username")
    isDTOvalid = validateByUsername({ username: usernameOrEmail, password });

  if (typeToSignIn === "email")
    isDTOvalid = validateByEmail({ email: usernameOrEmail, password });

  if (!isDTOvalid) {
    if (typeToSignIn === "email") {
      return res.status(400).json({
        ok: false,
        statusText: "data received isn't valid",
        errors: validateByEmail.errors,
      });
    }

    if (typeToSignIn === "username") {
      return res.status(400).json({
        ok: false,
        statusText: "data received isn't valid",
        errors: validateByUsername.errors,
      });
    }
  }

  return next();
};

export default validateSignInDto;
