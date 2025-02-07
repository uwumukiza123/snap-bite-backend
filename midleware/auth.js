const jwt = require('jsonwebtoken');
const User = require('../src/models/User')

const authenticate = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findOne({
            where: { id: decoded.id},
            attributes: ['id', 'username', 'email']
        })

        if(!user) {
            throw new Error('Invalid token')
        }
        req.token = token;
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({ message: 'You need to be authenticated' })
    }
}

module.exports = authenticate;