import dbConnection from "../../config/db.js";
import dotenv from "dotenv";
dotenv.config({ path: "../../config.env" });

import fs from 'fs'
import productModel from "../../models/productModel.js";
import 'colors';

// Connect to DB
dbConnection()

// Read data
const parseProducts = JSON.parse(fs.readFileSync('./products.json'))

const insertData = async() => {
    try {
        await productModel.create(parseProducts)
        console.log("Product data inserted.".green.inverse)
        process.exit(1)
    } catch(err) {console.log(err)}
}
const destroyData = async() => {
    try {
        await productModel.deleteMany()
        console.log("Product data destroyed.".red.inverse) //"text".red as colors modifies string
        process.exit(1)
    } catch(err) {console.log(err)}
}

if(process.argv[2] == "-i") insertData() //argv => exact commands(argumat values) in terminal | ex: node seeder.js -i
if(process.argv[2] == "-d") destroyData()