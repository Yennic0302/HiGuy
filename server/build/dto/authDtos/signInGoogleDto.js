"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const ajv_1 = __importDefault(require("ajv"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const signInGoogleDTOSchema = typebox_1.Type.Object({
    email: typebox_1.Type.String({
        format: "email",
        errorMessage: {
            format: " it isn't a email valid",
            type: "its's should be a string",
        },
    }),
}, {
    additionalProperties: true,
});
const ajv = new ajv_1.default({ allErrors: true }).addKeyword("instanceOf");
(0, ajv_errors_1.default)(ajv);
(0, ajv_formats_1.default)(ajv, ["email"]);
const validate = ajv.compile(signInGoogleDTOSchema);
const validateSignInGoogleDto = (req, res, next) => {
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
exports.default = validateSignInGoogleDto;
