const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello from server');
});

app.listen(port, (req, res) => {
    console.log(`Server is running at http://localhost:${port}`);
})