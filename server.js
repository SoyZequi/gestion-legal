const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3032;

app.use(bodyParser.json());
app.use(express.static('public'));

let cases = [];
let clients = [];
let lawyers = [];

app.post('/cases', (req, res) => {
    const newCase = req.body;
    cases.push(newCase);
    res.status(201).send(newCase);
});

app.get('/cases', (req, res) => {
    res.send(cases);
});

app.post('/clients', (req, res) => {
    const newClient = req.body;
    clients.push(newClient);
    res.status(201).send(newClient);
});

app.get('/clients', (req, res) => {
    res.send(clients);
});

app.post('/lawyers', (req, res) => {
    const newLawyer = req.body;
    lawyers.push(newLawyer);
    res.status(201).send(newLawyer);
});

app.get('/lawyers', (req, res) => {
    res.send(lawyers);
});

app.post('/shutdown', (req, res) => {
    res.send('Shutting down...');
    setTimeout(() => {
        process.exit(0);
    }, 1000); // Delay to show the message
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
