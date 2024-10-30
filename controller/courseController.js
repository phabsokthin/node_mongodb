import { Course } from "../models/Course.js";

export const create = async (req, res) => {
    const { courseName, detail } = req.body;
 
    try {
        const course = new Course({ courseName, detail });
        const savedCourse = await course.save();
        return res.status(201).json({ message: "Course created successfully", course: savedCourse });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while creating the course", error: err.message });
    }
};


export const fetchCourse = async(req, res) => {
    try{
        const courses = await Course.find();
        res.json(courses)
    }
    catch(err){
        console.log(err)
    }
}