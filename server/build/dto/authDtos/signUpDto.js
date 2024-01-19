"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const ajv_1 = __importDefault(require("ajv"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const signUpDTOSchema = typebox_1.Type.Object({
    name: typebox_1.Type.String({
        minLength: 3,
        maxLength: 15,
        errorMessage: {
            type: "its's should be a string",
            required: "its is required",
            maxLength: "it's migth have min 3 and max 15 characters",
            minLength: "it's migth have min 3 and max 15 characters",
        },
    }),
    lastName: typebox_1.Type.String({
        minLength: 3,
        maxLength: 15,
        errorMessage: {
            type: "its's should be a string",
            required: "its is required",
            maxLength: "it's migth have min 3 and max 15 characters",
            minLength: "it's migth have min 3 and max 15 characters",
        },
    }),
    email: typebox_1.Type.String({
        format: "email",
        errorMessage: {
            type: "its's should be a string",
            format: " it's should be an email valid",
            required: "its is required",
        },
    }),
    password: typebox_1.Type.String({
        minLength: 8,
        errorMessage: {
            type: " its's should be a string",
            minLength: "it's migth have min 8 characters",
        },
    }),
}, {
    additionalProperties: false,
    errorMessage: {
        additionalProperties: "received more data than is require",
    },
});
const ajv = new ajv_1.default({ allErrors: true }).addKeyword("instanceOf");
(0, ajv_formats_1.default)(ajv, ["email"]);
(0, ajv_errors_1.default)(ajv);
const validateDTO = ajv.compile(signUpDTOSchema);
const validateSignUpDto = (req, res, next) => {
    const removeSpaces = (obj) => {
        const valuesWithOutSpaces = {};
        const valuesFromObject = Object.keys(obj);
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
exports.default = validateSignUpDto;
