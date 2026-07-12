import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], required: true },
    profileImage: { type: String },
    createdAt: { type: Date, default: Date.now }, // Fixed capitalization
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update `updatedAt` before saving
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now(); // Update the timestamp before saving
    next();
});

const User = mongoose.model("User", userSchema);
export default User; 