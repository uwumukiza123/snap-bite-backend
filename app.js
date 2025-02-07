const express = require('express')
const app = express()
const authRouter = require('./src/routes/auth')
const authenticate = require('./midleware/auth')
const sequelize = require('./src/database')
const cors = require('cors')

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false}).then(() => {
  console.log(" Database synced successfully")
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}).catch((error) => {
  console.log("Error syncing database: ", error)
})

app.use('/api/auth', authRouter)
app.get('/api/private', authenticate, (req, res) => {
  res.send({ message: 'hello, authenticated user!', user: req.user})
})