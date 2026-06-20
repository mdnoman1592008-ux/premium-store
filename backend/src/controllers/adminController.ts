import { Request, Response } from 'express';
import Admin from '../models/Admin';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (admin && (await (admin as any).matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

import ApiKey from '../models/ApiKey';

export const getApiKeys = async (req: Request, res: Response) => {
  try {
    const keys = await ApiKey.find({}).sort({ createdAt: -1 });
    res.json(keys);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addApiKeys = async (req: Request, res: Response): Promise<void> => {
  try {
    const { provider, keys } = req.body; // 'keys' should be a string (multiline or comma-separated)
    if (!provider || !keys) {
      res.status(400).json({ message: 'Provider and keys are required' });
      return;
    }

    const keyArray = keys.split(/[\n,]+/).map((k: string) => k.trim()).filter((k: string) => k.length > 0);
    
    let addedCount = 0;
    for (const key of keyArray) {
      try {
        await ApiKey.create({ provider, key });
        addedCount++;
      } catch (err: any) {
        // Ignore duplicate key errors
        if (err.code !== 11000) {
          console.error('Error adding key:', err);
        }
      }
    }

    res.json({ message: `Successfully added ${addedCount} keys for ${provider}` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteApiKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await ApiKey.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Key not found' });
      return;
    }
    res.json({ message: 'API Key deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
