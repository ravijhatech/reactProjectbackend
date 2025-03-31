const mongoose = require ("mongoose");
const DbConnect= async()=>{
    const dbConnection =await mongoose.connect("mongodb://localhost:27017/authapp")
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
}

module.exports = DbConnect;

// mongodb+srv://ravipratihast71:MulXPIvOR3ZBW25P@cluster0.hkwcuwh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/react-app