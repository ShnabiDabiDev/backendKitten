const express = require('express');
const app = express()
const cors = require('cors');

app.use(express.json())

app.use(cors({
    origin: "https://designkitten.pages.dev/",
    methods: ["GET", "POST"],
    credentials: true
}))

app.listen(3000, (err) => {
    console.log('has create server')
})

app.get('/', (req, res) => {
    res.redirect('https://designkitten.pages.dev/')
})

app.post('/api/check', (req, res) => {
    res.json('penis')
})