import mongoose from 'mongoose';
import config from './config';

const db = async () =>{
  await mongoose.connect(config.mongoUrl as string).then(()=>{
    console.log('Database connected successfully');
  }).catch((error)=>{
    console.error('Error occurred while trying to connect to dabase: ', error)
  })
}

export default db;