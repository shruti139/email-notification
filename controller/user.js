const User = require("../models/user");
const bcrypt = require("bcrypt");

// Get all users
const getUsers = async (req, res) => {
    try {
        if (req.user.role != 'admin') {
            return res.status(500).send({
                error: "You Don't have permission for this operation",
                message: "You Don't have permission for this operation",
                isSuccess: false
            });
        }
        const users = await User.find({ role: 'user' }).select('_id email role userName');
        return res.status(200).send({
            isSuccess: true,
            message: "Users retrieved successfully",
            users
        });

    } catch (error) {
        return res.status(500).send({
            error: error.message,
            message: "Something went wrong, please try again!",
            isSuccess: false
        });
    }
};

// Update a user by ID
const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, userName } = req.body;
        // const hashedPassword = await bcrypt.hash(password, 10);

        if (req.user.role != 'admin') {
            return res.status(500).send({
                error: "You Don't have permission for this operation",
                message: "You Don't have permission for this operation",
                isSuccess: false
            });
        }
        const updatedUser = await User.findByIdAndUpdate(id, { email, userName }, { new: true });
        if (!updatedUser) {
            return res.status(404).send({
                isSuccess: false,
                message: "User not found"
            });
        }
        return res.status(200).send({
            isSuccess: true,
            message: "User updated successfully",
            updatedUser
        });

    } catch (error) {
        return res.status(500).send({
            error: error.message,
            message: "Something went wrong, please try again!",
            isSuccess: false
        });
    }
};

// Delete a user by ID
const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role != 'admin') {
            return res.status(500).send({
                error: "You Don't have permission for this operation",
                message: "You Don't have permission for this operation",
                isSuccess: false
            });
        }
        const deletedUser = await User.findByIdAndDelete(id).select('_id email');
        if (!deletedUser) {
            return res.status(404).send({
                isSuccess: false,
                message: "User not found"
            });
        }
        return res.status(200).send({
            isSuccess: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        return res.status(500).send({
            error: error.message,
            message: "Something went wrong, please try again!",
            isSuccess: false
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { email, password, role, userName } = req.body;

        // Validate request
        if (!email || !password || !userName) {
            return res.status(400).send({
                isSuccess: false,
                message: "Email, Password and Username are required"
            });
        }
        if (req.user.role != 'admin') {
            return res.status(500).send({
                error: "You Don't have permission for this operation",
                message: "You Don't have permission for this operation",
                isSuccess: false
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
            password: hashedPassword,
            userName,
            role: role ? 'admin' : 'user'
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
    getUsers,
    updateUserById,
    deleteUserById,
    createUser
};
