import Employee from '../model/Employee.js';
import bcrypt from 'bcryptjs';

// Get all employees
export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate('department', 'name')
            .sort({ createdAt: -1 });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create employee
export const createEmployee = async (req, res) => {
    try {
        // Log the incoming request
        console.log('Received employee creation request:', {
            body: req.body,
            headers: req.headers
        });

        
        // Validate required fields
        const requiredFields = ['name', 'email', 'password', 'dateOfBirth', 'department', 'position'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            console.log('Missing required fields:', missingFields);
            return res.status(400).json({ 
                message: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }



        // Create employee document
        const employee = new Employee({
            ...req.body,
            dateOfBirth: new Date(req.body.dateOfBirth),
            joinDate: new Date()
        });

        // Log employee data before saving
        console.log('Creating employee:', {
            email: employee.email,
            name: employee.name,
            department: employee.department,
            dateOfBirth: employee.dateOfBirth
        });

        // The password will be hashed by the model's pre-save hook
        employee.password = req.body.password;

        // Save employee with hashed password
        const newEmployee = await employee.save();
        
        // Return employee data without password
        const populatedEmployee = await Employee.findById(newEmployee._id)
            .populate('department', 'name')
            .select('-password'); // Exclude password from response

        console.log('Employee created successfully:', {
            id: newEmployee._id,
            email: newEmployee.email,
            name: newEmployee.name,
            department: newEmployee.department
        });

        res.status(201).json(populatedEmployee);
    } catch (error) {
        console.error('Error creating employee:', error);
        
        // Check if it's a validation error
        if (error.code === 11000) {
            console.log('Duplicate key error:', error.keyValue);
            return res.status(400).json({ 
                message: 'Employee ID or Email already exists' 
            });
        }

        // Check if it's a validation error
        if (error.name === 'ValidationError') {
            console.log('Validation errors:', error.errors);
            return res.status(400).json({ 
                message: Object.values(error.errors).map(e => e.message).join(', ') 
            });
        }

        // For other errors
        res.status(500).json({ 
            message: 'Failed to create employee' 
        });
    }
};

// Get employee by ID
export const getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('department', 'name');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get employees by department
export const getEmployeesByDepartment = async (req, res) => {
    try {
        const employees = await Employee.find({ department: req.params.departmentId })
            .select('name employeeId')
            .sort({ name: 1 });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search employees by ID
export const searchEmployees = async (req, res) => {
    try {
        const { employeeId } = req.query;
        const employees = await Employee.find({ 
            employeeId: { $regex: employeeId, $options: 'i' } 
        }).populate('department', 'name');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update employee
export const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { 
                ...req.body,
                dateOfBirth: new Date(req.body.dateOfBirth)
            },
            { new: true }
        ).populate('department', 'name');
        
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};