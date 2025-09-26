import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required : true,
        unique : true,
    },
    password:{
        type: String,
        required : true,
    },
    email:{
        type: String,
        required : true,
        unique: true
    },
    // Non-editable fields (set once)
    dateOfBirth: {
        type: Date
    },
    dateOfJoining: {
        type: Date
    },
    // Editable fields
    manager: {
        type: String,
        default: ''
    },
    domain: {
        type: String,
        default: ''
    },
    team: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    avatarDataUrl: {
        type: String,
        default: ''
    }
}, {
    timestamps : true,
});

const User = mongoose.model("User",userSchema);

export default User;