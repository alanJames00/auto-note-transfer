const express = require('express');
const Busboy = require('busboy');
const app = express();






app.get("/",(req, res)=>{

    console.log("Get is working");
    res.sendFile(__dirname+"/frontend/index.html");
})


// Define a route to handle file uploads
app.post('/upload', (req, res) => {


    const busboy = Busboy({ headers: req.headers });



    // const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        
        // Handle file stream
        file.on('data', data => {
            console.log(`File [${fieldname}] got
            ${data.length} bytes`);
        });
        
        file.on('end', () => {
            console.log(`File [${fieldname}] Finished`);
        });
    });
    
    busboy.on('finish', () => {
        console.log('File upload complete');
        // res.status(200).send('File uploaded successfully');
        res.sendFile(__dirname+"/frontend/final.html");
    });
    
    // Pipe the request stream to Busboy
    req.pipe(busboy);
});

app.listen(3000, () => console.log('Server is started at port number 3000'));

