const express=require('express');
const bodyParser = require('body-parser')
const cors=require('cors')
const dotenv = require('dotenv');
const syncDB = require('./utils/syncModel')
const models = require('./models')
const routes = require('./routes')


dotenv.config();
const app =express();
app.use(bodyParser.json({extended:false}));
app.use(cors());
const PORT=process.env.PORT;


app.use('/api', routes);


syncDB();
app.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }
    console.log('server listen on port ',PORT)
})
