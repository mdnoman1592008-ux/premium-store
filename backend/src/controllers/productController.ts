import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ appId: req.params.id });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlanPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, planId } = req.params;
    const { durations } = req.body;

    const product = await Product.findOne({ appId: id });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const plan = product.plans.id(planId as string);
    if (!plan) {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }

    if (durations && Array.isArray(durations)) {
      // @ts-ignore
      plan.durations = durations;
    }

    await product.save();
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const cleanup18Months = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    let updatedCount = 0;
    for (const product of products) {
      if (product.appId.toLowerCase() === 'gemini') continue;
      let updated = false;
      product.plans.forEach((plan: any) => {
        const initialLength = plan.durations.length;
        plan.durations = plan.durations.filter((d: any) => d.months !== 18 && !d.label.includes('18 Month'));
        if (plan.durations.length !== initialLength) {
          updated = true;
        }
      });
      if (updated) {
        await product.save();
        updatedCount++;
      }
    }
    res.json({ message: `Successfully cleaned up 18 months from ${updatedCount} non-Gemini apps.` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
