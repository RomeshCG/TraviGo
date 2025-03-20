const mongoose=  require('mongoose');

const conntectDB = async()=> {
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log.apply('MongoDB Connected');
    }catch (error){
        console.error('MonogoDB Connection Error:', error);
        process.exit(1);
    }
};

module.exports = conntectDB