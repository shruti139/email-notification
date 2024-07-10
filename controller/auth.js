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
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).send({
            isSuccess: true,
            message: "Login successful",
            token,
            role: user?.role,
            userId: user?._id,
            userName: user?.userName
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
    login
}
