import express, { Application } from 'express';
import cors from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();
const port = 3000;

// parser
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1', router);

// @ts-ignore
app.use(globalErrorHandler);
// @ts-ignore
app.use(notFound);

export default app;
