// backend/models/User.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentFirstName: { type: String, },
    studentLastName: { type: String, },
    dateOfBirth: { type: String, },
    gender: { type: String },

    bloodGroup: { type: String, },
     category:{ type:String},
     phoneNumber:{type:String},
        email:{type:String},
        currentAddress:{
            type:String,
            
        },
        city:{
            type:String,
           
        },
        state:{
            type:String,
          
        },
        pincode:{
            type:String,
            
        },
        // Academic information
        admissionNumber:{
            type:String,
            
            
        },
        enrollmentNumber:{
            type:String,
           
        },
        className:{
        type: String,
    
       

        },
        section:{
            type: String,
           
           
        },
        previousSchoolName:{
            type:String
        },
        stream:{
            type: String,
           
            
        },
        yearsofAddmission:{
            type:String,
           
        },
        // Guardian Details
        fatherName:{
            type:String,
           

        },
        motherName:{
            type:String,
            

        },
        occupation:{
            type:String,
            

        },
        relatioshipwithStudent:{
            type:String,
            
          

        },
        // documents upload

        passportSizePhoto:{
            type:String,
           
            
        },
        birthCertificate:{
            type:String,
        
            
        },
        previousMarksheet:{
            type:String,
            
            
        },
        transferCertificate:{
            type:String,
            
            
        },
        aadharCard:{
            type:String,
            
            
        },
        casteCertificate:{
            type:String,
           
            
        },
        //other information
        transportRequried:{
            type:String,
            
            
            
        },
        
    
     
    });

module.exports = mongoose.model("StudentsRegistration", studentSchema);
