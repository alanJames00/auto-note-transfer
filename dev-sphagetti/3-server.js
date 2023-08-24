
//Finally working server with json response after upload

const express = require('express');
const multer = require('multer');

const app = express();

var setUniqueFileName;

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store uploaded files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    const uniqueFileName = Date.now() + '-' + file.originalname;
    setUniqueFileName = uniqueFileName;
    cb(null, uniqueFileName); // Use a unique filename
  }
});

const upload = multer({ storage: storage });


app.get("/",(req, res)=>{

    console.log("Get is working");
    res.sendFile(__dirname+"/frontend/index-s3.html");
})


// Route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {

    //query parameter redirect approach
    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const fileName = setUniqueFileName;
      const nextPageUrl = `/nextpage?fileName=${fileName}`;

      res.redirect(nextPageUrl);

    //   res.sendFile(__dirname+"/frontend/final.html");  
    //   res.json({ message: 'File uploaded successfully' , fileId: setUniqueFileName});
});


app.get("/nextpage", (req, res)=>{
    
    res.sendFile(__dirname+"/frontend/nextpage.html");
})


//Handle the conversion and download



// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
