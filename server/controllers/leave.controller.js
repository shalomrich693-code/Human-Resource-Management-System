import Leave from '../model/Leave.js';
import Employee from '../model/Employee.js';

// Get leave statistics for employee
export const getEmployeeLeaveStats = async (req, res) => {
    try {
        if (!req.employee || !req.employee._id) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const employeeId = req.employee._id;
        
        const [totalLeaves, approvedLeaves, pendingLeaves] = await Promise.all([
            Leave.countDocuments({ employee: employeeId }).exec(),
            Leave.countDocuments({ employee: employeeId, status: 'approved' }).exec(),
            Leave.countDocuments({ employee: employeeId, status: 'pending' }).exec()
        ]);

        const leaveHistory = await Leave.find({ employee: employeeId })
            .sort({ startDate: -1 })
            .limit(5)
            .populate('employee', 'name')
            .exec();

        res.json({
            totalLeaves,
            approvedLeaves,
            pendingLeaves,
            leaveHistory
        });
    } catch (error) {
        console.error('Error in getEmployeeLeaveStats:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Admin: Get all leave requests
export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate({
                path: 'employee',
                select: 'name employeeId department',
                populate: { path: 'department', select: 'name' }
            })
            .sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        console.error('Error fetching all leaves:', error);
        res.status(500).json({ message: error.message });
    }
};

// Admin: Update leave status
export const updateLeaveStatus = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        leave.status = req.body.status;
        if (req.body.status === 'approved') {
            leave.approvalDate = new Date();
        }
        await leave.save();

        const updated = await Leave.findById(req.params.id)
            .populate({
                path: 'employee',
                select: 'name employeeId department',
                populate: { path: 'department', select: 'name' }
            });

        res.json(updated);
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(400).json({ message: error.message });
    }
};
