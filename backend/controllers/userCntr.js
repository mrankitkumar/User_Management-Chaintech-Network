const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User Already Exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });

        // Save user to the database
        await user.save();

        // Respond with success message
        res.status(201).json({ success: true, message: "User Created Successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the details carefully" });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "User does not exist" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ success: false, message: "Password is not matching" });
        }

        // Create JWT payload
        const payload = { id: user._id, email: user.email, role: user.role };

        // Sign token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

        // Remove password from the user object before returning
        user = user.toObject();
        user.password = undefined;

        // Respond with success
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Login failed", error: error.message });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        // Find user by ID (req.user.id should come from the auth middleware)
        const user = await User.findById(req.user.id).select('-password');
         console.log("bac",user);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Respond with user profile
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



exports.updateUserProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        // Find user by ID
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update user information
        if (name) user.name = name;
        if (email) user.email = email;

        // If password is provided, hash it and update
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Save the updated user to the database
        await user.save();
        const { password: _, ...userWithoutPassword } = user.toObject(); // Exclude password
        res.status(200).json({ success: true, message: "Profile updated successfully", user: userWithoutPassword });
    } catch (error) {
        console.error("Error updating user profile:", error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Server error" });
    }
};

