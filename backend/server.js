// creating backend API
const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');

app.use(cors());

app.get("/api/home", (req, res) => {
    res.json({ message: 'Hello from server!' });
}
);
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})