import express from 'express';
import schoolRoutes from './route/school.route.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(express.json());
app.use('/api', schoolRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.get('/',(req,res)=>{
    res.send("Server is running")
    
})