const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request
        if (!email || !password) {
            return res.status(400).send({
                isSuccess: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({
                isSuccess: false,
                message: "User not found"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                isSuccess: false,
                message: "Invalid password"
            });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).send({
            isSuccess: true,
            message: "Login successful",
            token
        });
    } catch (error) {
        return res.status(500).send({
            error: error.message,
            message: "Something went wrong, please try again!",
            isSuccess: false
        });
    }
}


const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request
        if (!email || !password) {
            return res.status(400).send({
                isSuccess: false,
                message: "Email and password are required"
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                isSuccess: false,
                message: "User already exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        return res.status(201).send({
            isSuccess: true,
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        return res.status(500).send({
            error: error.message,
            message: "Something went wrong, please try again!",
            isSuccess: false
        });
    }
}


module.exports = {
    login, createUser
}
