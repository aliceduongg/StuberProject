// creating backend API
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

// to access .env file
dotenv.config(); 

// Middleware 
app.use(cors());
app.use`express.json()`; //  to parse json data 

// Connect to mongoose database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParse: true,
    useUnifiedTopology: true,
})
.then (() => console.log('Connected to MongoDB'))
.catch (() => console.error ('Could not connect to MongoDB', err));



app.get("/api/home", (req, res) => {
    res.json({ message: 'Hello from server!' });
}
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})