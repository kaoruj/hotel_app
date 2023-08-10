const express = require('express');
const cors = require("cors");
const mysql = require('mysql');
// const bodyParser = require('body-parser');
const _ = require('lodash');


const app = express();

app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Configurar body-parser para analizar los datos en formato JSON
// app.use(bodyParser.json());


// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sukiyaki12345',
  database: 'hotel'
});

// Conexión a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos MySQL: ' + err.stack);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Endpoint de ejemplo para obtener una lista de usuarios desde la base de datos
app.get('/rooms', (req, res) => {
  // console.log('get /rooms');

  const sql = 'SELECT UPPER(numero) as numero, ocupado FROM habitacion';
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Error al obtener la lista de mesas: ' + err.stack);
      res.status(500).send('Error al obtener la lista de usuarios');
      return;
    }
    console.log('get /rooms');

    // results.push({numero: '66', ocupado: 0});
    const datos_nuevos = results;
    res.json(datos_nuevos);
  });
});

app.get('/mesa_categoria', function(req, res) {
  console.log("mesa categoria");
  const mesa_id = req.query.id;
  var sql = 'SELECT UPPER(numero) as numero, ocupado FROM mesa where numero ';
  if(mesa_id == 0){
    sql = sql+" not like 'D%' and numero not like 'P%' ";
  }
  else if(mesa_id == 1){
    sql = sql+"  like 'P%' ";
  }
  else{
   sql = sql+" like 'D%'  ";
  }
    
  // console.log(sql);

  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Error al obtener la lista de mesas: ' + err.stack);
      res.status(500).send('Error al obtener la lista de usuarios');
      return;
    }
    console.log('get /mesa_categoria id='+mesa_id.toString());

    // results.push({numero: '66', ocupado: 0});
    const datos_nuevos = results;
    res.json(datos_nuevos);
  });

});


app.get('/hola', (req, res) => {
  // res.send('Hola');
  console.log('get /hola');
  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'tcp://192.168.0.140'
  });

  printer.alignCenter();
  printer.println("Hello world");
  // await printer.printImage('./assets/olaii-logo-black.png')
  printer.cut();

  try {
    let execute = printer.execute()
    console.log("Print done!");
  } catch (error) {
    console.error("Print failed:", error);
  }
});

app.post('/prueba', (req, res) => {
  res.send('Hola');

  console.log('post /prueba');
  var sql = "SELECT consumidor_id,id FROM mesa where numero = '"+req.body['mesa']+"'";
  var mesa_id;
  var consumidor_id=0;
  var resultado;
  //verifica si la mesa esta libre o ocupado
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Error al obtener la mesas: ' + err.stack);
      res.status(500).send('Error al consultar mesa');
      return;
    }

    consumidor_id = results[0].consumidor_id;
    mesa_id = results[0].id;
    
    
  });
  // console.log('post /prueba');
  console.log("consumidor "+consumidor_id.toString() +", mesa ="+mesa_id.toString());
  


});

