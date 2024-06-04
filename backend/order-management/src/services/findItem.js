const createHttpError = require("http-errors");

const findWithId= async(Model, id = {}) => {
 try {
    const item = await Model.findById(id);  
    if(!item) throw createHttpError(404, `No ${Model.modelName} found with this id!`);    
    return item;
 } catch (error) {
   throw createHttpError(400,"Invalid item id");
 }  
 return error;

}

module.exports={findWithId}