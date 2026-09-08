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

app.post('/api/uploadavatar', upload.single('avatar'), async (req, res) => {
   const username = req.body.username
   const file = req.file
   const storage = sb.storage
   const bucket = await storage.from('avatars')
   const ext = file.originalname.split('.').pop()
   const filepath = `${username}.${ext}`

   const { data: files, error: listError } = await sb
    .storage
    .from('avatars')
    .list('images');
   if (listError) {
       return res.status(500).json({ success: false, message: 'Ошибка при получении файлов' });
   }

   const exists = files.some(f => f.name === `${username}.${ext}`);

   if (exists) {
        const { error } = await sb.storage
            .from('avatars')
            .update(filepath, file.buffer, {
            contentType: file.mimetype,
            upsert: true
            });

        if (error) {
            return res.status(500).json({ success: false, message: 'Ошибка при загрузке файла' });
        }
    }

   if (!exists) {
       const { error } = await sb.storage
           .from('avatars')
           .upload(filepath, file.buffer, {
               contentType: file.mimetype,
               upsert: true
           });
       if (error) {
           return res.status(500).json({ success: false, message: 'Ошибка при загрузке файла' });
       }
   }

   res.json({
        success: true,
        message: 'Файл получен!',
        fileInfo: {
            name: file.originalname,
            size: file.size,
            type: file.mimetype
        }
    });
})

io.on('connection', (socket) => {
    socket.emit('check', {

    })

    socket.on('upload_avatar', (data) => {
        
    })
})