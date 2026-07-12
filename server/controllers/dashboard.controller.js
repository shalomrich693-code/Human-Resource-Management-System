import Employee from '../model/Employee.js';
import Department from '../model/Department.js';
import Salary from '../model/Salary.js';
import Leave from '../model/Leave.js';

export const getDashboardSummary = async (req, res) => {
    try {
        const [
            totalEmployees,
            totalDepartments,
            monthlySalaryResult,
            leaveApplied,
            leaveApproved,
            leavePending,
            leaveReject
        ] = await Promise.all([
            Employee.countDocuments(),
            Department.countDocuments(),
            Salary.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: {
                                $add: [
                                    '$basicSalary',
                                    { $ifNull: ['$allowances', 0] },
                                    { $multiply: [{ $ifNull: ['$deductions', 0] }, -1] }
                                ]
                            }
                        }
                    }
                }
            ]),
            Leave.countDocuments(),
            Leave.countDocuments({ status: 'approved' }),
            Leave.countDocuments({ status: 'pending' }),
            Leave.countDocuments({ status: 'rejected' })
        ]);

        res.json({
            totalEmployees,
            totalDepartments,
            monthlySalary: monthlySalaryResult[0]?.total || 0,
            leaveApplied,
            leaveApproved,
            leavePending,
            leaveReject
        });
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({ message: 'Error fetching dashboard summary' });
    }
};
