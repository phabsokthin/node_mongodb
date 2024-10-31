import { Course } from "../models/Course.js";

export const createStudent = async (req, res) => {
    const { courseId } = req.params; 
    const { studentName, detail } = req.body;

    if (!studentName ||  !detail) {
        return res.status(400).json({ message: "Student name, and detail are required." });
    }

    try {
        const newStudent = { studentName, detail };

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { student: newStudent } },
            { new: true } 
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found." });
        }
        return res.status(200).json({ message: "Student added successfully.", course: updatedCourse });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while adding the student", error: err.message });
    }
};



export const updateStudent = async (req, res) => {
    const { courseId, studentId } = req.params; // Get courseId and studentId from params
    const { studentName, detail } = req.body; 

    // Validate input
    if (!studentName ||  !detail) {
        return res.status(400).json({ message: "Student name, sex, and detail are required." });
    }

    try {
        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        // Find the student by a unique identifier (like studentId)
        const studentIndex = course.student.findIndex(student => student._id.toString() === studentId);

        if (studentIndex === -1) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Update the student details
        course.student[studentIndex] = { ...course.student[studentIndex], studentName, detail };

        // Save the updated course document
        const updatedCourse = await course.save();

        return res.status(200).json({ message: "Student updated successfully.", course: updatedCourse });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while updating the student", error: err.message });
    }
};



export const deleteStudent = async (req, res) => {
    const { courseId, studentId } = req.params; 

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        const studentIndex = course.student.findIndex(student => student._id.toString() === studentId);
        // if (studentIndex === -1) {
        //     return res.status(404).json({ message: "Student not found." });
        // }

        // Remove the student from the array
        course.student.splice(studentIndex, 1);

        // Save the updated course document
        const updatedCourse = await course.save();
        return res.status(200).json({ message: "Student deleted successfully.", course: updatedCourse });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while deleting the student", error: err.message });
    }
};


export const getStudentById = async (req, res) => {
    const { courseId, studentId } = req.params; // Get courseId and studentId from params

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        // Find the student by studentId
        const student = course.student.find(student => student._id.toString() === studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Return the student details
        return res.status(200).json({ message: "Student retrieved successfully.", student });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while retrieving the student", error: err.message });
    }
};