import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import { sign, verify } from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { usersRouter, locationsRouter, itemsRouter, loansRouter } from './routes';

dotenv.config();

const jwtKey = 'starts_on_74245878b17d844d9df807c01bb2099858bc6d61';
const app = express();

app.use(express.static(path.join(__dirname, 'vivaerobus/build')));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(expressjwt({ secret: jwtKey, algorithms: ['HS256'] }).unless({
//   path: [
//     '/api/users',
//     '/api/users/*',
//     '/api/user/registration',
//     '/api/admin/registration',
//     '/api/login',
//     '/api/admin/login',
//     '/api/password_reset',
//     /^\/api\/user\/mail\/.*/
//   ],
// }));
app.use(logger('dev'));
app.use(cors());
app.use('/api/users', usersRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/items', itemsRouter);
app.use('/api/loans', loansRouter);

const PORT = process.env.PORT !== undefined ? process.env.PORT : 3000;
// HTTP config
// const privateKey = fs.readFileSync( 'private.key' );
// const certificate = fs.readFileSync( 'certificate.crt' );
// const options = {
//     key: privateKey,
//     cert: certificate
// }
// http.createServer(app).listen(80)
// https.createServer(options, app).listen(443)
app.listen(PORT);

console.log(`App is listening on PORT: ${PORT as string}`);
