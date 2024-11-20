import { Router } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
export const login = async (req, res) => {
    // TODO: If the user exists and the password is correct, return a JWT token
    console.log(req.body);
    const loggedInUser = await User.findOne({ where: { username: req.body.username } });
    if (!loggedInUser) {
        return res.status(401).json(({ message: 'User not found' }));
    }
    else {
        const validPassword = await bcrypt.compare(req.body.password, loggedInUser.password);
        if (!validPassword) {
            return res.sendStatus(403);
        }
    }
    ;
    const { username } = req.body;
    const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY);
    if (!token) {
        return res.sendStatus(403);
    }
    else {
        res.json({ token });
    }
};
const router = Router();
// POST /login - Login a user
router.post('/login', login);
export default router;
