"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentSettingController_1 = require("../controllers/paymentSettingController");
const auth_1 = require("../middleware/auth");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.get('/', paymentSettingController_1.getPaymentSettings);
router.put('/:method', auth_1.adminProtect, upload_1.default.single('qrCode'), paymentSettingController_1.updatePaymentSetting);
exports.default = router;
