const mongoose=require('mongoose');

const connectDB = async () => {
    try{
        const conn = await mongoose.connect("mongodb+srv://rakshitverma0911:2J8I4Ah8V8zun1HW@cluster0.kc31f4p.mongodb.net/?retryWrites=true&w=majority", {
            useUnifiedTopology:true,
            useNewUrlParser:true,
        });
        console.log(`MongoDB connected %${conn.connection.host}`)
    } catch(error){
        console.error(error.message);
        process.exit();
    }
}

module.exports = connectDB;