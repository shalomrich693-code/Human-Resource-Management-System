import Salary from '../model/Salary.js';
import Employee from '../model/Employee.js';

// Add new salary record
export const addSalary = async (req, res) => {
    try {
        console.log('Adding new salary record:', req.body);
        const salary = new Salary(req.body);
        const savedSalary = await salary.save();
        console.log('Salary record added:', savedSalary);
        const populatedSalary = await Salary.findById(savedSalary._id)
            .populate('employee', 'name employeeId');
        console.log('Populated salary record:', populatedSalary);
        res.status(201).json(populatedSalary);
    } catch (error) {
        console.error('Error in addSalary:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get salary history by employee ID
export const getSalaryHistory = async (req, res) => {
    try {
        console.log('Fetching salary history for employee:', req.params.employeeId);
        const salaries = await Salary.find({ employee: req.params.employeeId })
            .populate('employee', 'name employeeId')
            .sort({ payDate: -1 });
        console.log('Found salary history:', salaries);
        res.json(salaries);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get salary statistics for employee — FIXED: compute net salary in aggregation instead of using virtual
export const getEmployeeSalaryStats = async (req, res) => {
    try {
        if (!req.employee || !req.employee._id) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const employeeId = req.employee._id;
        
        const [totalEarnings, avgMonthly, recentSalaries] = await Promise.all([
            Salary.aggregate([
                { $match: { employee: employeeId } },
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
            Salary.aggregate([
                { $match: { employee: employeeId } },
                {
                    $group: {
                        _id: null,
                        avg: {
                            $avg: {
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
            Salary.find({ employee: employeeId })
                .sort({ payDate: -1 })
                .limit(5)
                .populate('employee', 'name')
        ]);

        const stats = {
            totalEarnings: totalEarnings[0]?.total || 0,
            averageMonthly: avgMonthly[0]?.avg || 0,
            recentSalaries: recentSalaries || []
        };

        res.json(stats);
    } catch (error) {
        console.error('Error in getEmployeeSalaryStats:', error);
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getEmployeesByDepartment = async (req, res) => {
    try {
        const employees = await Employee.find({ department: req.params.departmentId })
            .select('name employeeId')
            .sort({ name: 1 });
        res.json(employees);
    } catch (error) {
        console.error('Error in getEmployeesByDepartment:', error);
        res.status(500).json({ message: error.message });
    }
};