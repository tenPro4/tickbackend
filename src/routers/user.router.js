const express = require("express");
const { hashPassword,comparePassword } = require("../helpers/bcrypt.helper");
const { crateAccessJWT, crateRefreshJWT } = require("../helpers/jwt.helper");
const router = express.Router();

const {
	insertUser,
    getUserByEmail
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

router.post("/login", async (req, res) => {
	console.log(req.body);

	const { email, password } = req.body;

	if (!email || !password) {
		return res.json({ status: "error", message: "Invalid form submition!" });
	}

	const user = await getUserByEmail(email);

	if (!user.isVerified) {
		return res.json({
			status: "error",
			message:
				"You account has not been verified. Please check your email and verify you account before able to login!",
		});
	}

	const passFromDb = user && user._id ? user.password : null;

	if (!passFromDb)
		return res.json({ status: "error", message: "Invalid email or password!" });

	const result = await comparePassword(password, passFromDb);

	if (!result) {
		return res.json({ status: "error", message: "Invalid email or password!" });
	}

	const accessJWT = await crateAccessJWT(user.email, `${user._id}`);
	const refreshJWT = await crateRefreshJWT(user.email, `${user._id}`);

	res.json({
		status: "success",
		message: "Login Successfully!",
		accessJWT,
		refreshJWT,
	});
});


module.exports = router;