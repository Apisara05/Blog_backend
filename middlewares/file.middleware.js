const multer = require("multer");
const path = require("path");
const firebaseConfig = require("../config/firebase.config");

const {
    getStorage,
    ref, 
    uploadBytes,
    getDownloadURL} = require("firebase/storage");

// Initialize Firebase Storage
const {initializeApp} = require("firebase/app");
const app = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(app);

//set storage engine
const upload = multer({
    storage: multer.memoryStorage(),
    limit:{fileSize: 1000000}, //1mb
    fileFilter:(req, file, cb) =>{
        checkFileType(file, cb)
    },
}).single("cover");

function checkFileType(file, cb){
    const fileTypes =/jpeg|jpg|png|gif|webp/;
    const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase()
);
    const mimetype = fileTypes.test(file.mimetype);
    if(mimetype && extName){
        return cb(null, true);
    }else{
        cb("error image onlly!!");
    }
}

//upload to firebase storage
async function uploadToFirebase(req,res, next) {
    if(!req.cover){
        next();
        return;
    }
    //save location
    const storageRef = ref(firebaseStorage,`uploads/${req.cover.originalname}`);

    const metadata = {
        contentType: req.cover.mimetype,
    };
    try{
        const snapshot = await uploadBytesResumable(storageRef, req.cover.buffer,metadata

        );
        //get url from firebase
        req.cover.firebaseUrl = await getDownloadURL(snapshot.ref)
        next();
    } catch (error){
    res.status(500).json({message:error.message || "Something went wrong while uploading to forebase",
    });
    }
}

module.exports = { upload,uploadToFirebase };
