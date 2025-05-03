import express from 'express';
import EmployeeController from './SRC/Controllers/EmployeeController.js';

import cors from 'cors'
import morgan from 'morgan';

const app = express();

app.use(express.json())

app.use(morgan('dev'));

app.use(cors())

app.post('/registerTest', EmployeeController.registerFullEmployeeController)
app.post('/calculatorIRRF', EmployeeController.IRRFCalculatorController)
app.get('/getEmployees', EmployeeController.bringEmployes)
app.post('/search', EmployeeController.searchEmployeeController)
app.get('/getDependents/:id', EmployeeController.getDependentsController);
app.post('/delEmployee', EmployeeController.delEmployeeController)
app.post('/alterData', EmployeeController.alterController)
app.post('/auth', EmployeeController.AuthController)
app.post('/register', EmployeeController.registerUserController)

export default app;