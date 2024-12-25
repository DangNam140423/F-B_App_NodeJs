import express from 'express';
import configViewEngine from './config/viewEngine';
import initWebRoute from './route/web';
import connectDB from './config/connectDB';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
const { Kafka, Partitioners, logLevel } = require('kafkajs');
// import cors from 'cors';

require('dotenv').config();


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            process.env.URL_REACT, // URL của ứng dụng React thứ nhất
            process.env.URL_REACT_USER // URL của ứng dụng React thứ hai
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// app.use(cors({ origin: true }));
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    const allowedOrigins = [
        process.env.URL_REACT, // URL của ứng dụng React thứ nhất
        process.env.URL_REACT_USER, // URL của ứng dụng React thứ hai
        process.env.URL_REACT_NATIVE
    ];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // Kiểm tra xem nguồn gốc của yêu cầu có trong danh sách được phép hay không
    // res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    // Pass to next layer of middleware
    next();
});
const port = process.env.PORT || 3000;


// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

// setup view engine
configViewEngine(app);

// config cookiePaser to middleware
app.use(cookieParser())

// const kafka = new Kafka({
//     clientId: 'my-app',
//     brokers: ['localhost:9092'],
//     logLevel: logLevel.ERROR
// })

// const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
initWebRoute(app, io);
connectDB();

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        //
    });
});


app.use((req, res) => {
    return res.send("404 not found");
})
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

