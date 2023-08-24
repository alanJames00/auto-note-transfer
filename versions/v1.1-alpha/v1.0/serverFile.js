
//Finally working server with json response after upload

//importing child process
const { spawn } = require('child_process');

const express = require('express');
const multer = require('multer');




const app = express();
//
//

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

    console.log("Get / Working");
    res.sendFile(__dirname+"/public/index.html");
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
    
    res.sendFile(__dirname+"/public/nextpage.html");
})



//Testing the spawn process

app.get("/spawn", (req, res)=>{
  
  
 
  })




//Handle the conversion and download
app.get('/convert', (req, res) => {
  // Access query parameters using req.query
  const fileId = req.query.fileid;
  
  // You can also access URL parameters using req.params if you have defined them in your route
  // Example: app.get('/user/:id', (req, res) => { ... });

  // Log the values or send a response
  console.log('Conversion requested for:', fileId);

  //Now spawn the deepspeech for the conversion
  //make sure to use v11 of node
  const childProcess = spawn('node', ['deepSpeech.js', fileId]);
  childProcess.stdout.on('data', (data) => {
    console.log(`Script output: ${data}`);
  });

  childProcess.stderr.on('data', (data) => {
    console.error(`Script error: ${data}`);
  });

  childProcess.on('close', (code) => {
    console.log(`Script exited with code ${code}`);
  });

  // res.send('User ID: ' + fileId);
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
