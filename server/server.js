const express = require('express');
const cors = require('cors');
const PORT = 3001;
const app  = express();
const authRouter = require('./Routes/auth')
const tripRouter = require('./Routes/trip')


var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(authRouter);
app.use(tripRouter);


app.listen(PORT,()=>{
  console.log(`Server running on PORT: ${PORT}`)
})

