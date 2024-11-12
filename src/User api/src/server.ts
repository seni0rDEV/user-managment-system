// console.log('app working')
import config from './config/config';
import express from 'express'
import UserRoute from './users/UserRoute';
import db  from './config/db';
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());

db();
// to test port on the browser 
// app.get('/', (req, res) =>{
//   res.json({ message: 'application is working fine'});
// });

app.use('/api/users', UserRoute)

app.listen(config.port, () => {
  console.log(`Server is running on port: ${config.port}`);
});


