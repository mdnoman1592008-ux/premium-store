import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, discountPercentage, validUntil } = req.body;
    const coupon = new Coupon({
      code,
      discountPercentage,
      validUntil
    });
    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, discountPercentage, validUntil, isActive } = req.body;
    
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      res.status(404).json({ message: 'Coupon not found' });
      return;
    }

    if (code !== undefined) coupon.code = code;
    if (discountPercentage !== undefined) coupon.discountPercentage = discountPercentage;
    if (validUntil !== undefined) coupon.validUntil = validUntil;
    if (isActive !== undefined) coupon.isActive = isActive;

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      res.status(404).json({ message: 'Coupon not found' });
      return;
    }
    
    await Coupon.findByIdAndDelete(id);
    res.json({ message: 'Coupon deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      res.status(404).json({ message: 'Invalid coupon code' });
      return;
    }

    if (!coupon.isActive) {
      res.status(400).json({ message: 'Coupon is no longer active' });
      return;
    }

    if (new Date(coupon.validUntil) < new Date()) {
      res.status(400).json({ message: 'Coupon has expired' });
      return;
    }

    res.json(coupon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
