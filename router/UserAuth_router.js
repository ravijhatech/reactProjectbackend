 const express = require('express');
const createuser = require('../controllers/UserControoler');
 const router = express.Router();

 router.post('/register',createuser);