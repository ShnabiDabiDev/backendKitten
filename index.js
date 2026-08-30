const express = require('express');
const app = express()
const cors = require('cors');

app.listen(3000, (err) => {
    console.log('has create server')
})

app.get('/', (req, res) => {
    res.sendFile("hiii")
})