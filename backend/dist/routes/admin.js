"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/login', adminController_1.loginAdmin);
router.get('/orders', auth_1.adminProtect, orderController_1.getAllOrders);
router.put('/orders/:id/status', auth_1.adminProtect, orderController_1.updateOrderStatus);
router.get('/stats', auth_1.adminProtect, orderController_1.getAdminStats);
router.get('/users', auth_1.adminProtect, adminController_1.getUsers);
router.put('/users/:id/reset-password', auth_1.adminProtect, adminController_1.resetUserPassword);
exports.default = router;
