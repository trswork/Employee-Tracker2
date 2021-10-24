const express = require('express');
const inquirer = require("inquirer");
const mysql = require('mysql2/promise');
const db = require('/db/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "New#Start2022",
  database: "employee_trackerDB"
});

db.connect(err => {
  if (err) throw err;
  app.listen(PORT, () => {});
});

function runPrompt() {
  inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'View All Departments',
      'View All Roles',
      'Add Employee',
      'Add Department',
      'Add Role',
      'Remove Employee',
      'Update Employee Role',
      "Exit"
    ]
  }).then( answer => {
    switch (answer.action) {
      case "View All Employees":
          allEmployees();
          break;
      case "View All Departments":
          allDepartments();
          break;
      case "View All Roles":
          viewRoles();
          break;
      case "Add Employee":
          addEmployee();
          break;
      case "Add Department":
          addDepartment();
          break;
      case "Add Role":
          addRole();
          break;
      case "Remove Employee":
          deleteEmployee();
          break;
      case "Update Employee Role":
          updateEmployeeRole();
          break;
      case "Exit":
          connection.end();
          break;
  }
});
}

function allEmployees() {
  console.log("\nViewing all employees...\n");
  connection.query(
      "SELECT employee.id, first_name AS FIRSTNAME, last_name AS LASTNAME, title AS POSITION, name AS DEPARTMENT, salary as SALARY FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;", (err, res) => {
          if (err) throw err;
          console.table('ALL EMPLOYEES', res);
          runPrompt();
      });
}

function allDepartments() {
  connection.query("SELECT id, name AS DEPARTMENT FROM department", (err, res) => {
    if (err) throw err;
    console.table('\nALL DEPARTMENTS\n', res);
    runPrompt();
  });
}

function viewRoles() {
  connection.query("SELECT role.id, title AS ROLE, SALARY, name AS DEPARTMENT FROM role LEFT JOIN department ON department_id = department.id ORDER BY department.name", (err, res) => {
    if (err) throw err;
    console.table('ALL ROLES', res);
    runPrompt();
  });
}

