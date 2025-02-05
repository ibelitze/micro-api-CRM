const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const path = require ('path');
const bodyParser = require('body-parser');


const app = express();
const publicPath = path.join(__dirname, '..', 'public');

app.use(cors({
  origin:['*'],
   methods:['GET','POST'],
   credentials: true // enable set cookie
}))



// Middleware
app.use(morgan('dev'));

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(express.static(path.join(publicPath)));


app.use('/crm', require('./routes/index'));

// CRMs
app.use('/salesforce', require('./routes/crm/index'));


app.set('puerto', process.env.PORT || 8000);

app.listen(app.get('puerto'), () => {
  console.log('Server Running')
  console.log('Corriendo en puerto: ' + app.get('puerto'));
});