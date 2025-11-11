


const express = require('express')
const cors = require('cors')
const { config } = require('dotenv')
const dotenv = require('dotenv')
const connectDB = require('./Config/db')
const userRoutes = require('./routes/userRoutes')

  
const app = express()
app.use(express.json())
app.use(cors())

dotenv.config()

const PORT= process.env.PORT || 3000 


// connect to databse
connectDB()


app.get('/' , (req,res) => {
    res.send('welcome to Rabbit Api')

})

// API Routes 
app.use('/api/users',userRoutes)

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
    
})