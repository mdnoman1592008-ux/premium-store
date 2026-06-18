import { Request, Response } from 'express';
import PaymentSetting from '../models/PaymentSetting';

export const getPaymentSettings = async (req: Request, res: Response) => {
  try {
    const settings = await PaymentSetting.find({});
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePaymentSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { method } = req.params;
    const { number } = req.body;
    
    // Normalize method name to lowercase
    const normalizedMethod = (method as string).toLowerCase();

    let setting = await PaymentSetting.findOne({ method: normalizedMethod });
    
    if (!setting) {
      setting = new PaymentSetting({ method: normalizedMethod, number });
    } else {
      if (number) setting.number = number;
    }

    if (req.file) {
      const b64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;
      setting.qrCodeUrl = `data:${mimeType};base64,${b64}`;
    }

    const updatedSetting = await setting.save();
    res.json(updatedSetting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
