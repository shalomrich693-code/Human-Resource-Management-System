import User from './model/user.js';
import bcrypt from 'bcryptjs';

const userRegister = async () => {
    try {
        const hashPassword = await bcrypt.hash("admin", 10);
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
        });

        await newUser.save(); // Save the new user to the database
        console.log("User registered successfully:", newUser);
    } catch (error) {
        console.log("Error registering user:", error); // Fixed variable name and removed extra parenthesis
    }
};

export default userRegister; // Export the function if needed