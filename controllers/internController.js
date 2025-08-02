import Intern from '../models/Intern.js';
import Leaderboard from '../models/Leaderboard.js';
import jwt from 'jsonwebtoken';

export const getIntern = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const intern = await Intern.findById(decoded.id).select('-password');

        if (!intern) {
            return res.status(404).json({ message: 'Intern not found' });
        }

        res.json(intern);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createIntern = async (req, res) => {
    try {
        const { name, referralCode, donations, rewards } = req.body;
        const newIntern = new Intern({ name, referralCode, donations, rewards });
        const savedIntern = await newIntern.save();
        res.status(201).json(savedIntern);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find().sort({ donations: -1 });
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createLeaderboardEntry = async (req, res) => {
    try {
        const { name, donations } = req.body;
        const newEntry = new Leaderboard({ name, donations });
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
