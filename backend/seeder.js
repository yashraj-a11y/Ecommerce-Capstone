
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('./models/Product')
const User = require('./models/User')
const products = require('./Data/products')

dotenv.config() ;

// Connect to db

mongoose.connect(process.env.MONGO_URL);

// Function to seed data

const seedData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany() ;
        await User.deleteMany()

        // Create a default admin User
        const createdUser = await User.create({
            name : 'Admin User' ,
            email : 'admin@example.com' ,
            password : '123456' ,
            role : 'admin' ,
        }) ;

        // Assign the default user ID to each product
        const userID = createdUser._id 

        const sampleProducts = products.map((product) => {
            return {...product , user :userID} ;

        }) ;

        // Insert the products into the database
        await Product.insertMany(sampleProducts) ;

        console.log('Product data seeded succesfully');
        process.exit()
        

    } catch (err) {
        console.error('Error seeding the data' , err);
        process.exit(1) ;
        

    }
}

seedData() ;