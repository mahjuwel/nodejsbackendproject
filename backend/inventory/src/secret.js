require('dotenv').config();
const serverPort= process.env.SERVER_PORT||3085;
const MongoDBURL= process.env.MONGO_URI || "mongodb+srv://mongodbtkgl:TechKnowGram$5@pustitkgl.u9vkfuq.mongodb.net/inventoryManagement?retryWrites=true&w=majority";
defaultImagePath=process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/default.png';
const jwtActivationKey=process.env.JWT_ACTIVATION_KEY || '675HKJDFSDF34%%FGJ';
const jwtAccessKey=process.env.JWT_ACCESS_KEY || 'ACCESS$5649$@%';
const jwtResetPasswordKey=process.env.JWT_RESET_PASSWORD_KEY || 'RESET_PASS_$5649$@%';
const smtpUsername=process.env.SMTP_USERNAME || '';
const smtpPassword=process.env.SMTP_PASSWORDS || '';
const clientURL=process.env.CLIENT_URL || '';


module.exports={serverPort,MongoDBURL,defaultImagePath,jwtActivationKey,smtpUsername,smtpPassword,clientURL,jwtAccessKey,jwtResetPasswordKey}
