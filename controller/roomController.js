import { Course } from "../models/Course.js";

export const createRoom = async (req, res) => {
    const { courseId, studentId } = req.params; 
    const { roomName, detail } = req.body; 

    if (!roomName || !detail) {
        return res.status(400).json({ message: "Room name and detail are required." });
    }

    try {
        const updatedCourse = await Course.findOneAndUpdate(
            { _id: courseId, "student._id": studentId }, 
            { $push: { "student.$.rooms": { roomName, detail } } }, 
            { new: true } // Return the updated document
        );


        if (!updatedCourse) {
            return res.status(404).json({ message: "Course or Student not found." });
        }

        return res.status(200).json({ message: "Room added successfully.", course: updatedCourse });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while adding the room", error: err.message });
    }
};

export const deleteRoom = async (req, res) => {
    const { courseId, studentId, roomId } = req.params;

    try {
        const updatedCourse = await Course.findOneAndUpdate(
            { _id: courseId, "student._id": studentId },
            { $pull: { "student.$.rooms": { _id: roomId } } },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course or student not found." });
        }

        res.status(200).json({ message: "Room deleted successfully.", course: updatedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the room.", error: error.message });
    }
};


// In your controller file
export const getRoomById = async (req, res) => {
    const { courseId, studentId, roomId } = req.params;

    try {
        const course = await Course.findOne(
            { _id: courseId, "student._id": studentId, "student.rooms._id": roomId },
            { "student.$": 1 }
        );

        if (!course || !course.student || course.student.length === 0) {
            return res.status(404).json({ message: "Room not found." });
        }

        const student = course.student[0];
        const room = student.rooms.find(room => room._id.toString() === roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found." });
        }

        res.status(200).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving the room.", error: error.message });
    }
};

export const updateRoom = async (req, res) => {
    const { courseId, studentId, roomId } = req.params;
    const { roomName, detail } = req.body;

    if (!roomName || !detail) {
        return res.status(400).json({ message: "Room name and detail are required." });
    }

    try {
        const course = await Course.findOneAndUpdate(
            { _id: courseId, "student._id": studentId, "student.rooms._id": roomId },
            {
                $set: {
                    "student.$[student].rooms.$[room].roomName": roomName,
                    "student.$[student].rooms.$[room].detail": detail,
                },
            },
            {
                arrayFilters: [
                    { "student._id": studentId },
                    { "room._id": roomId },
                ],
                new: true,
            }
        );

        if (!course) {
            return res.status(404).json({ message: "Room not found." });
        }

        res.status(200).json({ message: "Room updated successfully.", room: course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the room.", error: error.message });
    }
};
