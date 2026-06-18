"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', productController_1.getProducts);
router.get('/:id', productController_1.getProductById);
router.put('/:id/plans/:planId', auth_1.adminProtect, productController_1.updatePlanPrice);
exports.default = router;
