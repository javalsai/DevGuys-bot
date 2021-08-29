// Página web
const express = require('express');

const app = express();

app.all('/', (req, res) => {
    res.send('Avaliable soon!');
});

app.all('*', (req, res) => {
    res.redirect('/');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running in ' + PORT)
})