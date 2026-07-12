import Department from '../model/Department.js';

// Get all departments
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create department
export const createDepartment = async (req, res) => {
    const department = new Department({
        name: req.body.name,
        description: req.body.description
    });

    try {
        const newDepartment = await department.save();
        res.status(201).json(newDepartment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get single department
export const getDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update department
export const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        department.name = req.body.name || department.name;
        department.description = req.body.description || department.description;

        const updatedDepartment = await department.save();
        res.json(updatedDepartment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete department
export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        await department.deleteOne();
        res.json({ message: 'Department deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};