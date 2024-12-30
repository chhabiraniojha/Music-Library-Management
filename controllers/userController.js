const { User } = require('../models');
const bcrypt = require('bcryptjs');
const axios = require("axios")

// Get all users
exports.getAllUsers = async (req, res) => {
    const { limit, offset, role } = req.query;

    
    if ((limit && isNaN(limit)) || (offset && isNaN(offset))) {
        return res.status(400).json({ message: 'Invalid limit or offset. They must be numeric values.' });
    }

    const parsedLimit = parseInt(limit) > 0 ? parseInt(limit):5; 
    const parsedOffset = parseInt(offset) >=0 ? parseInt(offset) :0;


    try {
        if (role && role !== 'Editor' && role !== 'Viewer') {
            return res.status(400).json({ message: "Invalid role. Role must be 'Editor' or 'Viewer'." });
        }


        const whereClause = {};
        if (role) {
            whereClause.role = role;
        }


        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            where: whereClause, 
            limit: parsedLimit, 
            offset: parsedOffset,
        });
        return res.status(200).json({ message: "users fetched successfully", data: users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to retrieve users.' });
    }
};

// Add a new user
exports.addUser = async (req, res) => {
    const user = req.user; // Authenticated user details
    const { name, email, password, role, organisationId } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password || !role || !organisationId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {

        if (user.role != "Admin") {
            return res.status(403).json({ message: "Forbidden. Only Admins can add users." });
        }


        // Try registering the user by calling the signup API
        try {
            const registeringUser = await axios.post(`${process.env.BASE_URL}/api/auth/signup`, {
                name,
                email,
                password,
                role,
                organisationId,
            });

            return res.status(201).json(registeringUser.data);
        } catch (axiosError) {
            // Handle errors from the signup API call
            if (axiosError.response) {
                const statusCode = axiosError.response.status;
                const message = axiosError.response.data;

                return res.status(statusCode).json(message);
            } else {
                // For other types of Axios errors (e.g., network issues)
                console.error("Axios Error:", axiosError);
                return res.status(500).json({ message: "Failed to register user. Please try again later." });
            }
        }
    } catch (error) {
        // Handle unexpected errors
        console.error("Error:", error);
        return res.status(500).json({ message: "An internal server error occurred." });
    }
};


// Delete a user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    // console.log(id)
    const user = req.user;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {

        // checking user is admin or editor or not
        if (user.role !== 'Admin' && user.role !== "Edior") {
            return res.status(403).json({ message: 'Forbidden. Only Admins or can delete users.' });
        }

        // checking if user delete his own id
        if (user.id == id) {
            return res.status(403).json({ message: 'You can not delete you  your own account' });
        }

        // Check if the user exists
        const userToDelete = await User.findByPk(id);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Perform the delete operation
        await userToDelete.destroy();

        return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while deleting the user.' });
    }
};

// Update user password
exports.updatePassword = async (req, res) => {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    // checking user is admin or editor or not
    if (user.role !== 'Admin' && user.role !== "Edior") {
        return res.status(403).json({ message: 'Forbidden. Only Admins or can delete users.' });
    }
    try {
        const user = await User.findByPk(user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update password.', error: error.message });
    }
};
