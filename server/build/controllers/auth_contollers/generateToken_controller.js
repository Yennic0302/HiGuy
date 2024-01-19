"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenGenerator_1 = require("../../src/tokenGenerator");
const generateToken = (req, res, next) => {
    try {
        const appId = Number(process.env.ZEGO_APP_ID);
        const serverSecret = process.env.ZEGO_SERVER_ID;
        const userId = req.params.userId;
        const effectiveTime = 3600;
        const payload = "";
        if (appId && serverSecret && userId) {
            const token = (0, tokenGenerator_1.generateToken04)(appId, userId, serverSecret, effectiveTime, payload);
            res.status(200).json({ ok: true, token });
        }
        else {
            res.status(300).json({
                ok: false,
                statusError: "User id, app id and server secret id are required",
            });
        }
    }
    catch (e) {
        next(e);
    }
};
exports.default = generateToken;
