const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User Already Exists" });
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });

       
        await user.save();


        res.status(201).json({ success: true, message: "User Created Successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

      
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the details carefully" });
        }

   
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ success: false, message: "Password is not matching" });
        }

        const payload = { id: user._id, email: user.email, role: user.role };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

       
        user = user.toObject();
        user.password = undefined;

      
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
        
        const user = await User.findById(req.user.id).select('-password');
         console.log("bac",user);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

       
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};



exports.updateUserProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
       
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;

       
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        
        await user.save();
        const { password: _, ...userWithoutPassword } = user.toObject(); 
        res.status(200).json({ success: true, message: "Profile updated successfully", user: userWithoutPassword });
    } catch (error) {
        console.error("Error updating user profile:", error); 
        res.status(500).json({ success: false, message: "Server error" });
    }
};

