const express = require('express');
const app = express()
const cors = require('cors');
const { Pool } = require('pg');
const { Server } = require('socket.io');
const http = require('http')
const { createClient } = require('@supabase/supabase-js');
const server = http.createServer(app)
const multer = require('multer')

server.listen(3000)

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }
});

const pg = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
})

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

console.log(process.env.SUPABASE_URL);
console.log('heh')

async function test() {
    const storage = sb.storage
    const bucket = storage.from('images')
}

test();

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

app.get('/', (req, res) => {
    res.redirect('https://designkitten.pages.dev/')
})

app.post('/api/check', async (req, res) => {
    res.json({piska: "penis"})
    // await pg.query('INSERT INTO users (username, passwordhash) VALUES ($1, $2)', ['akrunik', '4234234'])
})

app.post('/api/register', async (req, res) => {
    const {name, password} = req.body

    const existingUser = await pg.query('SELECT * FROM users WHERE username = $1', [name])
    
    if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' })
    }

    await pg.query('INSERT INTO users (username, passwordhash) VALUES ($1, $2)', [name, password])

    res.json({
        message: "User registered successfully"
    })
})

app.post('/api/uploadavatar', upload.single('avatar'), async (req, res) => {
   const username = req.body.username
   const file = req.file
   const filepath = `images/${username}/avatar`

    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ]

    if (allowedTypes.includes(file.mimetype)) {
        const {data, error} = await sb.storage.from('avatars').upload(filepath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '0',
            upsert: true
        })

        if (error) {
            res.status(400).json({ error: error.message })
        }



        res.status(200).json({data: data})
    } else {
        res.status(400).json({ error: 'Invalid file type' })
    }
})

io.on('connection', (socket) => {
    socket.emit('check', {

    })

    socket.on('upload_avatar', (data) => {
        
    })
})