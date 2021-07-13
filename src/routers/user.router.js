const express = require("express");
const { hashPassword } = require("../helpers/bcrypt.helper");
const router = express.Router();

const {
	insertUser,
} = require('../model/user/User.model');

router.post("/", async (req, res) => {
    const { name, company, address, phone, email, password } = req.body;
    try{
        const newUserObj = {
			name,
			company,
			address,
			phone,
			email,
			password : await hashPassword(password)
		};
    const result = await insertUser(newUserObj);
    console.log(result);

    res.json({message:'new user created',result});
    }catch(error){
        console.log(error);
        res.json({status:'error',message:error.message});
    }
});


module.exports = router;