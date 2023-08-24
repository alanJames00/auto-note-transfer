// Import the functions you need from the SDKs you need


// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');


var setUniqueFileName;

//very imp
const serviceAccount = require('./imp-firebase-keys-json/serviceAccountKey.json');
//very imp

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

    credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyB1i081lhQ6zWOoaF4X9Tv5xUYBqFPIoNg",
  authDomain: "auto-note-file-storage.firebaseapp.com",
  projectId: "auto-note-file-storage",
  storageBucket: "auto-note-file-storage.appspot.com",
  messagingSenderId: "145258046101",
  appId: "1:145258046101:web:62d8dc77c249449d75719c",
  measurementId: "G-WG5DR3GBM0"
};

// Initialize Firebase
admin.initializeApp(firebaseConfig);



const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('assets'));



const bucket = admin.storage().bucket();


app.get("/", (req, res)=>{

    res.sendFile(__dirname+"/public/2-index.html");
})




app.post('/upload', upload.single('fileUpload'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const uniqueFileName = Date.now() + req.file.originalname;
  // Upload the file to Firebase Cloud Storage
  const uploadedFile = await bucket.upload(req.file.path, {
    destination: uniqueFileName,
    metadata: {
      contentType: req.file.mimetype
    }
  });

  setUniqueFileName = uniqueFileName;

  console.log('File uploaded to Firebase:', uploadedFile);

  // Delete the temporary uploaded file
  // fs.unlinkSync(req.file.path); PLz change this for after hackathon presentation.
  // res.send(`File uploaded to Firebase Cloud Storage.file id: ${setUniqueFileName}`);

  // res.redirect("https://redesigned-halibut-979v9wjpqvx26v4-5000.preview.app.github.dev/startPage?fileid="+uniqueFileName);
  //Public address

  res.redirect("http://127.0.0.1:5000/startPage?fileid="+uniqueFileName);

});






app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
