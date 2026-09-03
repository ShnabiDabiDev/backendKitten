const express = require('express');
const app = express()
const cors = require('cors');
const { Pool } = require('pg');
const { Server } = require('socket.io');
const http = require('http')
const { createClient } = require('@supabase/supabase-js');
const server = http.createServer(app)

server.listen(3000)

const pg = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
})

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const test = async () => {
  const { data, error } = await supabase.storage.from('avatars').list();
  console.log(data, error);
};

test();
  
console.log(data, error + "Update allz");

const io = new Server(server, {
    cors: {
        origin: "https://designkitten.pages.dev",
        methods: ["GET", "POST"]
    }
})

app.use(express.json())

app.use(cors({
    origin: "https://designkitten.pages.dev",
    methods: ["GET", "POST"],
    credentials: true
}))

app.listen(3000, (err) => {
    console.log('has create server')
})

app.get('/', (req, res) => {
    res.redirect('https://designkitten.pages.dev/')
})

app.post('/api/check', async (req, res) => {
    res.json({piska: "penis"})
    // await pg.query('INSERT INTO users (username, passwordhash) VALUES ($1, $2)', ['akrunik', '4234234'])
})

io.on('connection', (socket) => {
    socket.emit('check', {

    })
})