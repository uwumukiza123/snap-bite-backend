const { sendEmail} = require('../utils/email')
const express = require('express');
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
  try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      const newUser = await User.create({ username, email, password });

      res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Failed to create user', error: error.message });
  } 
});

router.post('/reset-password-request', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email }})

  if(!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = jwt.sign({ userId: user.id}, process.env.SECRET_KEY, { expiresIn: '1h'})

  user.resetToken = token;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

  await sendEmail(user.email, "password Reset", `Click the link to reset your password: ${resetLink}`)

  res.json({ message: " Password reset link sent"})
})

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findByPk(decoded.userId);

    if (!user || user.resetToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password before saving
    user.password = await bcrypt.hash(newPassword, 10);

    // Invalidate the token immediately
    user.resetToken = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/login', async (req, res) => {
  try {
    if(!process.env.SECRET_KEY) {
      throw new Error('SECRET_KEY is not set in the environment variables');
    }

    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } })

    if(!user) {
      return res.status(404).send({ error: 'User not found' })
    }

   const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
      return res.status(401).send({ error: 'Invalid password' })
    }

    const token = jwt.sign({ id: user.id}, process.env.SECRET_KEY, { expiresIn: '1h'})
    res.send({ token, user})
    
  } catch (error) {
    console.error('Login error: ', error)
    res.status(500).send({ error: "Internal server error" })
  }
})

module.exports = router;

router.get('/user', async (req, res) => {
  const user = await User.findAll(req.user)
  res.send(user)
})

router.get('/user/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if(!user) {
    return res.status(404).send({ error: 'User not found' })
  }
  res.send(user)
})
