import express from 'express';
const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send('hello');
});

app.listen(port, () => {
    console.log('Listening to port ' + port);
});