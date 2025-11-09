


const express = require('express')
const cors = require('cors')
const { config } = require('dotenv')
const dotenv = require('dotenv')
const connectDB = require('./Config/db')

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

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
    
})