const express = require('express');
const multer = require('multer'); // A middleware for handling file uploads
const app = express();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


app.get("/",(req, res)=>{

    console.log("Get is working");
    res.sendFile(__dirname+"/frontend/index.html");
})


app.post('/upload', upload.single('fileToUpload'), (req, res) => {
    // The uploaded file can be accessed through req.file
    console.log("Post woking");
    res.send("File uploaded succesfully");
});


app.listen(6000, () => {
    console.log('Server is running on port 6000');
});


