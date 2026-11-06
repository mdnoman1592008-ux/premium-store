import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, password, firebaseUid, photo } = req.body;

  try {
    const effectivePhone = phone || email;
    const query: any[] = [];
    if (effectivePhone) query.push({ phone: effectivePhone });
    if (email) query.push({ email });
    if (firebaseUid) query.push({ firebaseUid });

    const userExists = query.length > 0 ? await User.findOne({ $or: query }) : null;
    if (userExists) {
      // If registering via Firebase and user already exists in DB, update & return token
      if (firebaseUid) {
        if (name && !userExists.name) userExists.name = name;
        if (email) (userExists as any).email = email;
        if (firebaseUid) (userExists as any).firebaseUid = firebaseUid;
        if (photo && !userExists.photo) userExists.photo = photo;
        await userExists.save();

        res.status(200).json({
          _id: userExists._id,
          name: userExists.name,
          email: (userExists as any).email,
          phone: userExists.phone,
          photo: userExists.photo,
          token: generateToken(userExists._id.toString()),
        });
        return;
      }
      res.status(400).json({ message: 'User already exists with this email or phone number' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || Math.random().toString(36), salt);

    const user = await User.create({
      name,
      email,
      phone: effectivePhone,
      password: hashedPassword,
      photo,
      firebaseUid,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: (user as any).email,
        phone: user.phone,
        photo: user.photo,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { phone, password, firebaseUid, email, name } = req.body;
  const identifier = phone || email;

  try {
    const query: any[] = [{ phone: identifier }, { email: identifier }];
    if (firebaseUid) query.push({ firebaseUid });

    let user = await User.findOne({ $or: query });

    // If user authenticated via Firebase Email/Password on frontend, sync/allow login
    if (firebaseUid) {
      if (!user && identifier) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || Math.random().toString(36), salt);
        user = await User.create({
          name: name || (identifier.includes('@') ? identifier.split('@')[0] : identifier),
          email: identifier.includes('@') ? identifier : email,
          phone: identifier,
          password: hashedPassword,
          firebaseUid,
        });
      } else if (user) {
        (user as any).firebaseUid = firebaseUid;
        if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
        }
        await user.save();
      }

      if (user) {
        res.json({
          _id: user._id,
          name: user.name,
          email: (user as any).email,
          phone: user.phone,
          photo: user.photo,
          token: generateToken(user._id.toString()),
        });
        return;
      }
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: (user as any).email,
        phone: user.phone,
        photo: user.photo,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email/phone or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  const { name, email, photo, firebaseUid } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Google account email is required' });
    return;
  }

  try {
    const query: any[] = [{ email }, { phone: email }];
    if (firebaseUid) query.push({ firebaseUid });

    let user = await User.findOne({ $or: query });

    if (user) {
      if (name && !user.name) user.name = name;
      if (email) (user as any).email = email;
      if (firebaseUid) (user as any).firebaseUid = firebaseUid;
      if (photo && !user.photo) user.photo = photo;
      await user.save();
    } else {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(Math.random().toString(36) + Date.now().toString(36), salt);

      user = await User.create({
        name: name || email.split('@')[0],
        email,
        phone: email,
        password: randomPassword,
        photo: photo || '',
        firebaseUid,
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: (user as any).email,
      phone: user.phone,
      photo: user.photo,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
