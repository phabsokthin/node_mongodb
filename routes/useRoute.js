import express from 'express'
import {createUser, deleteUser, getUser, getUserById, updateUser} from '../controller/userController.js'
import { create, fetchCourse } from '../controller/courseController.js';
import { createStudent, deleteStudent, getStudentById, updateStudent } from '../controller/studentController.js';
import { createRoom, deleteRoom, getRoomById, updateRoom } from '../controller/roomController.js';
const router = express.Router();

router.get('/getUser', getUser);
router.post("/post", createUser);
router.patch("/update/:id", updateUser);
router.delete("/delete", deleteUser)
router.get('/getUsersId', getUserById);

//course

router.post("/course", create);
router.get("/fetchCourse", fetchCourse);
router.post("/courses/:courseId/students", createStudent)
router.put('/courses/:courseId/students/:studentId', updateStudent);
router.delete('/courses/:courseId/students/:studentId', deleteStudent);
router.get('/courses/:courseId/students/:studentId', getStudentById);


//Room 
router.post('/courses/:courseId/students/:studentId/rooms', createRoom);
router.delete('/courses/:courseId/students/:studentId/rooms/:roomId', deleteRoom)
router.get('/courses/:courseId/students/:studentId/rooms/:roomId', getRoomById)
router.put('/courses/:courseId/students/:studentId/rooms/:roomId', updateRoom)



export default router;