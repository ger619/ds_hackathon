const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads')
    },
    filename:(req, file, cb) => {
        cb(null, file.originalname);
    },
});

const fileFilter =(req,file, cb) =>{
    //check if file of type pdf or jpeg 
    if(file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg'){
        cb(null,true);
    }else{
        cb(new Error('Invalid file type, only PDF and JPEG are allowed'),false);
    }
};

 const upload = multer({storage:storage,
    fileFilter:fileFilter});

 module.exports = {upload};