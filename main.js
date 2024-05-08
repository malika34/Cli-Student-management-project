#!/usr/bin/env node
// Importing necessary packages
import inquirer from 'inquirer'; // For user input
import chalk from 'chalk'; // For colorful console output
// Course data
const courses = [
    { name: 'AI', price: 3000 },
    { name: 'Web 3.0', price: 2000 },
    { name: 'Metaverse', price: 2000 },
    { name: 'Blockchain', price: 1500 } // Course: Blockchain, Price: $1500
];
// Student class
class Student {
    name;
    studentID;
    coursesEnrolled;
    balance;
    // Constructor to initialize student properties
    constructor(name) {
        this.name = name;
        this.studentID = this.generateStudentID();
        this.coursesEnrolled = [];
        this.balance = 0;
    }
    // Method to generate a random student ID
    generateStudentID() {
        return Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    // Method to enroll the student in a course
    enroll(course, paid) {
        this.coursesEnrolled.push({ name: course, paid: paid });
        console.log(chalk.green(`Enrolled in ${course}`));
    }
    // Method to view the current balance of the student
    viewBalance() {
        console.log(chalk.yellow(`Current balance: $${this.balance}`));
    }
    // Method to pay the tuition fee for a course
    payTuition(amount, coursePrice) {
        if (amount < coursePrice) {
            console.log(chalk.red("Your payment is less than the course tuition. Please enter a greater amount."));
        }
        else {
            this.balance += amount - coursePrice;
            console.log(chalk.green(`Payment successful for ${coursePrice}$ for course. Remaining balance: $${this.balance}`));
        }
    }
    // Method to calculate the total balance for all enrolled courses
    calculateBalance() {
        let totalTuition = 0;
        this.coursesEnrolled.forEach(course => {
            const courseData = courses.find(c => c.name === course.name);
            if (courseData) {
                totalTuition += courseData.price;
            }
        });
        return totalTuition - this.balance;
    }
    // Method to display the status of the student
    showStatus() {
        console.log(chalk.blue(`Name: ${this.name}`));
        console.log(chalk.blue(`Student ID: ${this.studentID}`));
        console.log(chalk.blue("Courses Enrolled:"));
        this.coursesEnrolled.forEach(course => {
            const paymentStatus = course.paid ? chalk.green("Paid") : chalk.red("Not Paid");
            console.log(chalk.blue(`- ${course.name}: ${paymentStatus}`));
        });
        console.log(chalk.blue(`Balance: $${this.calculateBalance()}`));
    }
}
// Function to add a new student
async function addStudent() {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter student name:'
    });
    return new Student(name);
}
// Function to start the program
async function start() {
    console.log(chalk.bold.rgb(41, 173, 255)("====================================================="));
    console.log(chalk.bold.rgb(41, 173, 255)("      Welcome to the Student Management System"));
    console.log(chalk.bold.rgb(41, 173, 255)("====================================================="));
    // Array to store student objects
    const students = [];
    // Main loop for user interaction
    while (true) {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: chalk.bold.rgb(255, 173, 41)("What would you like to do?"),
            choices: [
                { name: "Add a new student", value: 'addStudent' },
                { name: "Enroll in a course", value: 'enrollCourse' },
                { name: "View balance", value: 'viewBalance' },
                { name: "Show status", value: 'showStatus' },
                { name: "Exit", value: 'exit' }
            ]
        });
        switch (action) {
            case 'addStudent':
                const student = await addStudent();
                students.push(student);
                console.log(chalk.bold.green("Student added successfully!"));
                break;
            case 'enrollCourse':
                if (students.length === 0) {
                    console.log(chalk.red("No students added yet. Please add a student first."));
                    break;
                }
                const studentChoices = students.map((student, index) => ({
                    name: `${index + 1}. ${student.name}`,
                    value: index
                }));
                const { studentIndex } = await inquirer.prompt({
                    type: 'list',
                    name: 'studentIndex',
                    message: 'Choose a student to enroll:',
                    choices: studentChoices
                });
                const chosenStudent = students[studentIndex];
                const { course } = await inquirer.prompt({
                    type: 'list',
                    name: 'course',
                    message: 'Choose a course to enroll:',
                    choices: courses.map(c => c.name)
                });
                const coursePrice = courses.find(c => c.name === course)?.price || 0;
                const { payment } = await inquirer.prompt({
                    type: 'number',
                    name: 'payment',
                    message: `Tuition for ${course} is ${chalk.bold.green("$" + coursePrice)}. Enter payment amount:`
                });
                chosenStudent.enroll(course, payment >= coursePrice);
                chosenStudent.payTuition(payment, coursePrice);
                break;
            case 'viewBalance':
                if (students.length === 0) {
                    console.log(chalk.red("No students added yet. Please add a student first."));
                    break;
                }
                const { studentIndex: viewBalanceIndex } = await inquirer.prompt({
                    type: 'list',
                    name: 'studentIndex',
                    message: 'Choose a student to view balance:',
                    choices: students.map((student, index) => ({
                        name: `${index + 1}. ${student.name}`,
                        value: index
                    }))
                });
                students[viewBalanceIndex].viewBalance();
                break;
            case 'showStatus':
                if (students.length === 0) {
                    console.log(chalk.red("No students added yet. Please add a student first."));
                    break;
                }
                const { studentIndex: showStatusIndex } = await inquirer.prompt({
                    type: 'list',
                    name: 'studentIndex',
                    message: 'Choose a student to show status:',
                    choices: students.map((student, index) => ({
                        name: `${index + 1}. ${student.name}`,
                        value: index
                    }))
                });
                students[showStatusIndex].showStatus();
                break;
            case 'exit':
                console.log(chalk.bold.rgb(41, 173, 255)("====================================================="));
                console.log(chalk.bold.rgb(41, 173, 255)("      Thank you for using Student Management System"));
                console.log(chalk.bold.rgb(41, 173, 255)("====================================================="));
                return;
            default:
                console.log(chalk.red("Invalid action. Please choose a valid action."));
                break;
        }
    }
}
// Starting the program
start();
