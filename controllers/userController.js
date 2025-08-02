import Intern from '../models/Intern.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingIntern = await Intern.findOne({ email });
        if (existingIntern) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const intern = await Intern.create({
            name,
            email,
            password,
            referralCode,
            donations: 0,
            rewards: [],
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        intern.password = hashedPassword;
        await intern.save();

        const token = jwt.sign({ id: intern._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 });

        const { password: _, ...internData } = intern.toObject();

        res.status(201).json({
            success: true,
            user: internData,
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const intern = await Intern.findOne({ email });
        if (!intern) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, intern.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password',
            });
        }
        const token = jwt.sign({ id: intern._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 });

        const { password: _, ...internData } = intern.toObject();

        res.status(200).json({
            success: true,
            user: internData,
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
