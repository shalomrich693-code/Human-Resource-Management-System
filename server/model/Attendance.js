import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: () => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
    },
    checkIn: {
        type: Date,
        default: null
    },
    checkOut: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'half-day'],
        default: 'present'
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

// Compound index to ensure one attendance record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Virtual for hours worked
attendanceSchema.virtual('hoursWorked').get(function() {
    if (this.checkIn && this.checkOut) {
        const diff = this.checkOut - this.checkIn;
        return (diff / (1000 * 60 * 60)).toFixed(2);
    }
    return 0;
});

attendanceSchema.set('toJSON', { virtuals: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
