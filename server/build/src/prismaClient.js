"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
let prisma = null;
function getPrismaInstance() {
    if (!prisma) {
        prisma = new client_1.PrismaClient();
    }
    return prisma;
}
exports.default = getPrismaInstance;
