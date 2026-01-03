"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const client_1 = __importDefault(require("../prisma/client"));
class UploadsService {
    async saveFileInfo(data) {
        return client_1.default.uploadedDocument.create({
            data,
        });
    }
}
exports.UploadsService = UploadsService;
