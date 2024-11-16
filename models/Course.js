import mongoose, { Schema } from "mongoose";


const roomNestedDocument = new Schema({
    roomName: {
        type: String,
        require: true
    },
    detail: {
        type: String,
        require: true
    }
})

const studentDocument = new Schema({
    studentName:{
        type: String,
        require: true
    },
    detail: {
        type: String,
        require: true
    },
    rooms: {
        type: [roomNestedDocument],
        require: false,
    }
})

const courseDocument = new Schema({
    courseName: {
        type: String,
        require: true,
    },
    detail: {
        type: String,
        require: true
    },
    student:{
        type: [studentDocument],
        require: false
    }
}, {
    timestamps: true
})



export const Course = mongoose.models.Course || mongoose.model('Course', courseDocument);