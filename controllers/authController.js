const { User, Organisation } = require('../models');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup Controller
exports.signup = async (req, res) => {
    const { name, email, password, organisationId, role } = req.body;

    if (!name || !email || !password || !organisationId || !role) {
        return res.status(400).json({ data:null,message: "bad request! All fields are required",error:null });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be 6 or more characters" });
    }

    if (role !== "Admin" && role !== "Editor" && role !== "Viewer") {
        console.log(role);
        return res.status(400).json({ message: "Role is not acceptable" });
    }

    try {
        const organisationExist = await Organisation.findByPk(organisationId);
        if (!organisationExist) {
            return res.status(404).json({ message: "Organisation not found" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({data:null, message: 'Email already registered.',error:null });
        }

        const userCount = await User.count({ where: { organisationId } });

        // Assign role based on user count in the organization
        const userRole = userCount === 0 ? "Admin" : role;

        if (userRole === 'Admin' && userCount > 0) {
            //   here find if user exist with the role admin or not
            const existingAdmin = await User.findOne({ where: { organisationId, role: 'Admin' } });
            if(existingAdmin){
                return res.status(403).json({ message: 'An organization can have only one admin.' });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            organisationId,
            role: userRole
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(201).json({ message: "User created successfully.", user, token,error:null });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Signup failed. Please try again later.' });
    }
};




    // Login Controller
    exports.login = async (req, res) => {
        const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Exclude password from the response
        const { password: _, ...userDetails } = user.toJSON();

        return res.status(200).json({
            message: "Login successful.",
            user: userDetails,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Login failed. Please try again later." });
    }
    };

    // Logout Controller
    exports.logout = (req, res) => {
        try {
            return res.status(200).json({ data:null,message: 'Logout successful.',error:null });
        } catch (error) {
            return res.status(500).json({ data:null,message: 'bad request,Logout failed.', error: error.message });
        }
    };
