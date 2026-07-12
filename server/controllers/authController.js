import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import Employee from '../model/Employee.js';
import bcrypt from 'bcryptjs';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Log incoming credentials
        console.log('Login attempt:', { email, passwordLength: password ? password.length : 0 });
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: "Email and password are required" 
            });
        }

        // First try to find in User collection (for admins)
        let user = await User.findOne({ email });
        if (!user) {
            // If not found, try to find in Employee collection
            user = await Employee.findOne({ email })
                .select('+password')
                .populate('department', 'name');
            if (!user) {
                console.log('User not found in database');
                return res.status(404).json({ 
                    success: false, 
                    error: "User not found" 
                });
            }
        }

        // Log user details
        console.log('Found user:', {
            id: user._id,
            email: user.email,
            role: user.role,
            hasPassword: !!user.password
        });

        // Check if password exists
        if (!user.password) {
            console.log('No password set for this account');
            return res.status(400).json({ 
                success: false, 
                error: "No password set for this account" 
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', {
            isMatch,
            passwordLength: password.length,
            hashedPasswordLength: user.password.length
        });

        if (!isMatch) {
            // Try comparing with a new hash to check if the password was stored incorrectly
            const newHash = await bcrypt.hash(password, 10);
            console.log('New hash:', newHash);
            console.log('Stored hash:', user.password);
            return res.status(401).json({ 
                success: false, 
                error: "Wrong password" 
            });
        }

        // Generate JWT token
        const token = jwt.sign({ 
            _id: user._id, 
            role: user.role || 'employee',
            type: user.constructor.modelName === 'Employee' ? 'employee' : 'admin'
        }, process.env.JWT_KEY, { expiresIn: "1d" });

        // Format response based on user type
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'employee',
            department: user.department,
            employeeId: user.employeeId
        };

        console.log('Login successful:', { userId: user._id, role: user.role });
        
        res.status(200).json({
            success: true,
            token,
            user: userData
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Server error occurred" 
        });
    }
};

const verify = async (req, res) => {
    try {
        res.json({ success: true });
    } catch (error) {
        console.error("Verify Error:", error);
        res.status(500).json({ success: false, error: "Server error occurred" });
    }
};

export { login, verify };
