import Attendance from '../model/Attendance.js';
import Employee from '../model/Employee.js';

// Employee: Check in
export const checkIn = async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already checked in today
        let attendance = await Attendance.findOne({ employee: employeeId, date: today });
        if (attendance && attendance.checkIn) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        const now = new Date();
        // Determine status: late if after 9 AM
        const nineAM = new Date(today);
        nineAM.setHours(9, 0, 0, 0);
        const status = now > nineAM ? 'late' : 'present';

        if (attendance) {
            attendance.checkIn = now;
            attendance.status = status;
            await attendance.save();
        } else {
            attendance = new Attendance({
                employee: employeeId,
                date: today,
                checkIn: now,
                status
            });
            await attendance.save();
        }

        res.json(attendance);
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Employee: Check out
export const checkOut = async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({ employee: employeeId, date: today });
        if (!attendance || !attendance.checkIn) {
            return res.status(400).json({ message: 'You have not checked in today' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'Already checked out today' });
        }

        attendance.checkOut = new Date();

        // Check for half-day (less than 4 hours)
        const hoursWorked = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
        if (hoursWorked < 4) {
            attendance.status = 'half-day';
        }

        await attendance.save();
        res.json(attendance);
    } catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Employee: Get today's attendance
export const getTodayAttendance = async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({ employee: employeeId, date: today });
        res.json(attendance || { checkedIn: false, checkedOut: false });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Employee: Get own attendance history
export const getMyAttendanceHistory = async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const attendance = await Attendance.find({ employee: employeeId })
            .sort({ date: -1 })
            .limit(30)
            .populate('employee', 'name employeeId');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get all attendance for a date
export const getAttendanceByDate = async (req, res) => {
    try {
        const date = new Date(req.query.date || new Date());
        date.setHours(0, 0, 0, 0);

        const attendance = await Attendance.find({ date })
            .populate('employee', 'name employeeId department')
            .populate({ path: 'employee', populate: { path: 'department', select: 'name' } })
            .sort({ 'employee.name': 1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get attendance summary
export const getAttendanceSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalEmployees, presentToday, lateToday, absentToday] = await Promise.all([
            Employee.countDocuments(),
            Attendance.countDocuments({ date: today, status: 'present' }),
            Attendance.countDocuments({ date: today, status: 'late' }),
            Attendance.countDocuments({ date: today, status: 'absent' })
        ]);

        res.json({
            totalEmployees,
            presentToday: presentToday + lateToday,
            lateToday,
            absentToday: totalEmployees - presentToday - lateToday
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
