const { Schema, model } = require("mongoose");

const designationSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})

const Designation = model('Designation', designationSchema);
module.exports = Designation;