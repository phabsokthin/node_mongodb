import mongoose, { Schema } from "mongoose";

const studentDocument = new Schema({
    studentName:{
        type: String,
        require: true
    },
    sex: {
        type: String,
        require: true
    },
    detail: {
        type: String,
        require: true
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