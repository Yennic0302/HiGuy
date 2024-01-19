"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const typebox_1 = require("@sinclair/typebox");
const signInDTOSchemaByEmail = typebox_1.Type.Object({
    email: typebox_1.Type.String({
        format: "email",
        errorMessage: {
            format: " it isn't a email valid",
            type: "its's should be a string",
        },
    }),
    password: typebox_1.Type.String({
        errorMessage: {
            type: "it should be a string",
        },
    }),
}, {
    additionalProperties: false,
    errorMessage: {
        additionalProperties: "received more data than is require",
    },
});
const signInDTOSchemaByUsername = typebox_1.Type.Object({
    username: typebox_1.Type.String({
        errorMessage: {
            type: " it should be a string",
        },
    }),
    password: typebox_1.Type.String({
        errorMessage: {
            type: " it should be a string",
        },
    }),
}, {
    additionalProperties: false,
    errorMessage: {
        additionalProperties: "received more data than is require",
    },
});
const ajv = new ajv_1.default({ allErrors: true }).addKeyword("instanceOf");
(0, ajv_errors_1.default)(ajv);
(0, ajv_formats_1.default)(ajv, ["email"]);
const validateByEmail = ajv.compile(signInDTOSchemaByEmail);
const validateByUsername = ajv.compile(signInDTOSchemaByUsername);
const validateSignInDto = (req, res, next) => {
    let { typeToSignIn, usernameOrEmail, password } = req.body;
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
exports.default = validateSignInDto;
