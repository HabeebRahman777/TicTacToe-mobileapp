import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hash });
    console.log('successfull');
    
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'register error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET);
    res.json({ token,user });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
};
