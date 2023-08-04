const express = require('express');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
app.use(express.json());

const DATA_FILE_PATH = './employees.json';

// Create an index for faster employee lookup using Map
let employeeIndex = new Map();

function buildEmployeeIndex() {
    employeeIndex.clear();
    employeeList.forEach(employee => {
        employeeIndex.set(employee.employeeId, employee);
    });
}

let employeeList = loadEmployeesFromFile();
buildEmployeeIndex();

app.get('/greeting', (req, res) => res.send('Hello world!'));

app.post('/employee', (req, res) => {
    const newEmployee = {
        employeeId: uuid.v4(),
        name: req.body.name,
        city: req.body.city
    };
    employeeList.push(newEmployee);
    employeeIndex.set(newEmployee.employeeId, newEmployee);
    saveEmployeesToFile();
    res.status(201).json({ employeeId: newEmployee.employeeId });
});

app.get('/employee/:id', (req, res) => {
    const employee = employeeIndex.get(req.params.id);
    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ message: `Employee with ${req.params.id} was not found` });
    }
});

app.put('/employee/:id', (req, res) => {
    const employee = employeeIndex.get(req.params.id);
    if (employee) {
        employee.name = req.body.name;
        employee.city = req.body.city;
        saveEmployeesToFile();
        res.status(201).json(employee);
    } else {
        res.status(404).json({ message: `Employee with ${req.params.id} was not found` });
    }
});

app.delete('/employee/:id', (req, res) => {
    const employee = employeeIndex.get(req.params.id);
    if (employee) {
        const employeeIndexToDelete = employeeList.findIndex(emp => emp.employeeId === req.params.id);
        employeeList.splice(employeeIndexToDelete, 1);
        employeeIndex.delete(req.params.id);
        saveEmployeesToFile();
        res.json(employee);
    } else {
        res.status(404).json({ message: `Employee with ${req.params.id} was not found` });
    }
});

app.post('/employees/search', (req, res) => {
    const { fields, condition = 'AND' } = req.body;

    if (!fields || fields.length === 0) {
        return res.status(400).json({ messages: ["At least one search criteria should be passed."] });
    }

    let messages = [];

    fields.forEach((field, index) => {
        if (!field.fieldName) {
            messages.push('fieldName must be set.');
        } else if (!field.eq && !field.neq) {
            messages.push(`${field.fieldName}: At least one of eq, neq must be set.`);
        }
    });

    if (messages.length > 0) {
        return res.status(400).json({ messages });
    }

    let results = employeeList.filter(employee => {
        return fields.every(field => {
            if (field.eq) return employee[field.fieldName] === field.eq;
            if (field.neq) return employee[field.fieldName] !== field.neq;
        });
    });

    if (condition === 'OR' && fields.length > 1) {
        results = employeeList.filter(employee => {
            return fields.some(field => {
                if (field.eq) return employee[field.fieldName] === field.eq;
                if (field.neq) return employee[field.fieldName] !== field.neq;
            });
        });
    }

    res.json(results);
});

app.get('/employees/all', (req, res) => res.json(employeeList));

app.listen(8080, () => console.log(`Server running on port 8080`));

function loadEmployeesFromFile() {
    try {
        const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log("File not found, creating...");
            fs.writeFileSync(DATA_FILE_PATH, '[]', 'utf8');
            return [];
        } else {
            console.error('Error reading file:', err);
            return [];
        }
    }
}

function saveEmployeesToFile() {
    fs.writeFile(DATA_FILE_PATH, JSON.stringify(employeeList), err => {
        if (err) console.log("Error writing to file:", err);
    });
}