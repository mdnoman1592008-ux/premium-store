"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.post('/', auth_1.protect, upload_1.default.single('screenshot'), orderController_1.createOrder);
router.get('/myorders', auth_1.protect, orderController_1.getMyOrders);
router.get('/:id', orderController_1.getOrderById);
exports.default = router;
