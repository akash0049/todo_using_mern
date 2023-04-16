const User = require('../models/user.js');
const bcrpyt = require('bcryptjs');
const { generateToken } = require('../validators/auth.js');
const client = require('../redis_service/redis_config.js');

const signUp = async (req, res) => {
    try {
        const { userName, password, imageUrl } = req.body;
        const isUserExists = await User.findOne({ userName: userName });

        if (isUserExists) {
            res.status(400).send({ message: "Username already registered" });
        }

        const user = User({
            userName: userName,
            password: bcrpyt.hashSync(password, 8),
            imageUrl: imageUrl
        });
        await user.save();
        res.status(201).send({ message: "SignUp Sucessful" });
    } catch (error) {
        res.status(500).send('Server Error!!!')
    }
}

const signIn = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName: userName });
        if (!user) {
            res.status(401).send({ message: "User Not Registered" });
            return;
        }
        if (!bcrpyt.compareSync(password, user.password)) {
            res.status(401).send({ message: "Incorrect Password" });
            return;
        }
        const token = await generateToken(user);
        await client.set(`${userName}`, token);

        res.status(200).send({
            token: token,
            message: "SignIn Sucessful",
        });
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error!!!')
    }
}

module.exports = { signIn, signUp }
