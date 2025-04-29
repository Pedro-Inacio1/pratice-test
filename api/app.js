import express from 'express';
import EmployeeController from './SRC/Controllers/EmployeeController.js';

import cors from 'cors'
import morgan from 'morgan';

const app = express();

app.use(express.json())

app.use(morgan('dev'));

app.use(cors())

app.post('/register', EmployeeController.registerEmployeeController)

export default app;