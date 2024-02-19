import 'express-async-errors'; //za automatsko hvatanje gresaka u asynhronim upitima. prije se sa next(err) prosledjivala greska middlewareu za greske
import * as dotenv from 'dotenv'; //omugucuje citanje iz .env
dotenv.config();
import express from 'express';
const app = express();
import morgan from 'morgan'; //ljepsi i detaljniji logovi
import mongoose from 'mongoose'; //biblioteka za modeliranje objekata (Object Data Modeling - ODM) za MongoDB i Node.js.
import cookieParser from 'cookie-parser'; //parsira cookie i dodaje properties cookie na req
import cloudinary from 'cloudinary'; // storage za slike
import helmet from 'helmet'; //  je middleware za sigurnost u Express.js aplikacijama. Ova biblioteka automatski postavlja različite sigurnosne HTTP zaglavlja kako bi zaštitila aplikaciju od poznatih web bezbednosnih ranjivosti.
import mongoSanitize from 'express-mongo-sanitize'; // e middleware za sigurnost u Express.js aplikacijama koji se koristi za sprečavanje MongoDB ubrizgavanja (MongoDB Injection).

// routers
import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, './client/dist')));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/auth', authRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
