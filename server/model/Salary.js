import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
    },
    allowances: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    payDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Virtual for net salary
salarySchema.virtual('netSalary').get(function() {
    return this.basicSalary + (this.allowances || 0) - (this.deductions || 0);
});

// Ensure virtuals are included in JSON output
salarySchema.set('toJSON', {
    virtuals: true
});

export default mongoose.model('Salary', salarySchema);