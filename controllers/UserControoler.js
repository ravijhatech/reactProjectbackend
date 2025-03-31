const User = require('../models');
const bcrypt = require('bcryptjs');

  const createuser=  async(req,res)=>{
    const {username,email,password} = req.body;
    if(username == "" || email == "" || password == "")
       return res.json("All fields is requried");
    const haspassword = await bcrypt.hash(password , 10);

    let user = await User.create({username,email,password:haspassword});
    res.json({message: "user created sucessfully ",sucess:true})
 }