
const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Database connected Suceesfully');
        
    }
    catch (err){
        console.log('database connection failed ',err);
        process.exit(1) ;
        
    }
}

module.exports = connectDB ;