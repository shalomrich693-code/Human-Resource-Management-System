import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,  // Will store the image URL
        default: ''
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false  // Don't include in queries by default
    },
    passwordChangedAt: Date,
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add these methods after the schema definition
employeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = Date.now();
    next();
});

employeeSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;