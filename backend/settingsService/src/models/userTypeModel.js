const { Schema, model } = require("mongoose");

const userTypeSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})

const UserType = model('UserType', userTypeSchema);
module.exports = UserType;