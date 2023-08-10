const express = require('express');
const cors = require("cors");
const mysql = require('mysql');
// const bodyParser = require('body-parser');
const _ = require('lodash');


const app = express();

const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;  
const ip_impresora = 'tcp://192.168.0.140';


//hpm102
const printerHP = require("node-printer");
const { query } = require('express');
// Encuentra la impresora por su nombre
const printerName = "HP_LaserJet_Pro_M102w";
// const deviceHP = printerHP.getPrinter(printerName);


// var corsOptions = {
//   origin: "http://localhost:8081"
// };
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
  database: 'resto'
});

// Conexión a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos MySQL: ' + err.stack);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Endpoint de ejemplo para obtener una lista de usuarios desde la base de datos
app.get('/mesas', (req, res) => {
  const sql = 'SELECT UPPER(numero) as numero, ocupado FROM mesa';
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Error al obtener la lista de mesas: ' + err.stack);
      res.status(500).send('Error al obtener la lista de usuarios');
      return;
    }
    console.log('get /mesas');

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


app.get('/pedidos_detalles', (req, res) => {
  if (_.isEmpty(req.query.numero)) {
    console.log('get /pedidos_detalles, parametro numero incorrecto');
    console.log(req.query);
    res.send("error");
    return;
  }
  console.log('get /pedidos_detalles numero='+req.query.numero);

  var sql = "SELECT consumidor_id,id FROM mesa where numero = '"+req.query.numero+"'";
  var mesa_id;
  var consumidor_id=0;
  //verifica si la mesa esta libre o ocupado
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Error al obtener la mesas: ' + err.stack);
      res.status(500).send('Error al consultar mesa');
      return;
    }

    if(results.length == 0){
      console.log("pedidos_detalles vacio");
      res.status(500).send('Error al consultar mesa, pedidos detalles');
      return;
    }
    consumidor_id = results[0].consumidor_id;
    mesa_id = results[0].id;
    console.log("consumidor "+consumidor_id.toString() +", mesa ="+mesa_id.toString());
    sql = "select codigo,producto,cantidad,precio_unit,precio from pedido where consumidor_id = "+consumidor_id.toString();
    connection.query(sql, (err, resul, fields) => {
      if (err) {
        console.error('Error al obtener la mesas: ' + err.stack);
        res.status(500).send('Error al consultar mesa');
        return;
      }
      const datos_nuevos = resul;
      res.json(datos_nuevos);

    });
  });
  // console.log('post /prueba');
  


});


app.post('/cargar_pedidos', (req, res) => {
  console.log("cargar pedidos");
  
  var sql = "SELECT consumidor_id,id FROM mesa where numero = '"+req.body['mesa']+"'";
  var mesa_id;
  var consumidor_id=-1;
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
    // console.log("consumidor "+consumidor_id.toString() +", mesa ="+mesa_id.toString());
    
    
  
    if(consumidor_id.toString() == "-1"){
      //crear un consumidor nuevo, para ocupar la mesa
      sql = "insert into consumidor (mesa_id) values ("+mesa_id.toString()+")"
      connection.query(sql, (err, results, fields) => {
          if (err) {
            console.error('Error al insertar consumidor: ' + err.stack);
            res.status(500).send('Error al insert consumidor');
            return;
          }
          // console.log("Insert consumidor");
          consumidor_id = results.insertId;
          
          //modificar la mesa en ocuapado
          sql = "update mesa set consumidor_id = "+consumidor_id.toString()
          +", ocupado = 1 where id = "+mesa_id.toString();
          connection.query(sql, (err, results, fields) => {
            if (err) {
              console.error('Error al modificar mesa: ' + err.stack);
              res.status(500).send('Error al modificar mesa');
              return;
            }
            console.log("modificar mesa");
          });
          // console.log("consumidor "+consumidor_id.toString() +", mesa ="+mesa_id.toString());
          cargarPedidos(req.body['pedidos'],consumidor_id); 
          // imprimirPedidos(req.body['pedidos'],req.body['mesa']);
          imprimirPedidos(consumidor_id,req.body['mesa']);
        });
              
    }else{
      cargarPedidos(req.body['pedidos'],consumidor_id);
      imprimirPedidos(consumidor_id,req.body['mesa']);
      // imprimirPedidos(req.body['pedidos'],req.body['mesa']);
    }
    
    // console.log(sql);
    //cargar pedidos
    // console.log(req.body);
    
  });

  if(consumidor_id.toString() == "-1"){
    
  }
  res.send('Datos Cargados');
});

function imprimirPedidos(consumidor_id,nro_mesa){
  var sql = "select p.codigo as codigo,sum(p.cantidad) as cantidad from pedido p,producto b "+
  " where p.codigo = b.codigo and consumidor_id = "+consumidor_id.toString() +" and "+
  " impreso = 0 and (tipo_producto_id = 6 or p.codigo in ('1xx','10B','1','B5')) "+
      " group by p.codigo,p.precio ";
  imprimirComando(sql,nro_mesa,"sushi");
  sql = "select p.codigo as codigo,sum(p.cantidad) as cantidad from pedido p,producto b "+
      " where p.codigo = b.codigo and consumidor_id = "+consumidor_id.toString() +" and "+
      " impreso = 0 and (tipo_producto_id = 2 or p.codigo in ('B20','B20Q','B33','B32')) "+
      " group by p.codigo,p.precio ";
  imprimirComando(sql,nro_mesa,"cocina");
  sql  = "update pedido set impreso = 1 where consumidor_id = "+ consumidor_id.toString();
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Error al obtener la mesas: ' + err.stack);
      // res.status(500).send('Error al consultar mesa');
      return;
    }
    console.log(`update pedidos consumidor_id ${consumidor_id}`);
  });
};

function imprimirComando(sql,nro_mesa,lugar){
  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: ip_impresora
  });
  
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Error al obtener la mesas: ' + err.stack);
      // res.status(500).send('Error al consultar mesa');
      return;
    }
    if(results.length > 0 ){
      printer.bold(true);   
      printer.setTextSize(1,2);
      printer.alignCenter();
      printer.println("Mesa "+nro_mesa);
      const now = new Date();
      printer.println(`${lugar} ${now.getHours()}:${now.getMinutes()}`);
      printer.alignLeft();    
      results.map(pedido => {
        const codigo = pedido.codigo;
        const cantidad = pedido.cantidad;
        printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
          { text:codigo, align:"RIGHT", cols:7},
          { text:"-", align:"CENTER", cols:2},
          { text:cantidad, align:"RIGHT",cols:3}
        ]);
      });
      printer.cut();
      try {
        let execute = printer.execute()
        console.log("imprimirPedidos Print done!");
      } catch (error) {
        console.error("Print failed:", error);
      }
    }
  })
  
}


function cargarPedidos(pedidos,consumidor_id){
  //cargar pedidos
  var sql = "insert into pedido (consumidor_id, codigo,producto,cantidad,precio_unit,precio) values ";
  // var pedidos = req.body['pedidos'];
  const pedidosString = pedidos.map(pedido => {
    const codigo = pedido.codigo;
    const cantidad = pedido.cantidad;
    const precio = pedido.precio;
    const nombre = pedido.nombre;

    return "("+consumidor_id.toString()+",'"+codigo+"','"+nombre+"',"+cantidad+","+precio.toString()+","+(precio*parseInt(cantidad)).toString()+" )";
  }).join(', ');
  sql = sql + pedidosString;
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Error al insertar pedidos: ' + err.stack);
      res.status(500).send('Error al insert pedidos');
      return;
    }
    // console.log("Insert pedidos");
    // consumidor_id = results.insertId;
  });
}

app.get('/imprimir_cuenta', (req, res) => {
  // res.send('Hola'); req.body['mesa']
  console.log('get /imprimir_Cuenta');
  // console.log(req);
  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: ip_impresora
  });
  var consumidor_id = -1;
  
  var sql = "SELECT consumidor_id FROM mesa where numero = '"+req.query.mesa+"'";
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Error al obtener la mesas: ' + err.stack);
      res.status(500).send('Error al  imprimir cuenta');
      return;
    }
    consumidor_id = results[0].consumidor_id;
    if(consumidor_id == -1){
      console.error('Error al obtener consumidor_id: ' + err.stack);
      res.status(500).send('Error al imprimir cuenta');
      return;
    }
    printer.setTextSize(1,2);
    printer.alignCenter();
    printer.println("Mesa "+req.query.mesa);
    // printer.newLine();
    // printer.setTextSize(0.5,0.5);
    printer.setTextNormal();  
    printer.println("PREFACTURA");
    printer.println("SIN VALOR FISCAL");  
    printer.alignLeft(); 
    sql = "select sum(cantidad) as cantidad, producto, sum(precio) as precio,codigo from pedido "+
        " where consumidor_id = "+ consumidor_id.toString()+ " group by producto, precio_unit,codigo";
    connection.query(sql, (err, results, fields) => {
      // console.log(results);
    
      if (err) {
        console.error('Error al imprimir pedidos: ' + err.stack);
        res.status(500).send('Error al insert pedidos');
        return;
      }
      printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
        { text:"Cod.", align:"RIGHT", cols:7},
        { text:"Can", align:"CENTER", cols:4},
        { text:"  Producto", align:"LEFT", cols:23},
        { text:"Precio", align:"RIGHT",cols:13}
      ]);
      printer.drawLine();
      
      results.map(pedido => {
        const codigo = pedido.codigo;
        const producto = pedido.producto;
        const cantidad = pedido.cantidad;
        const precio = pedido.precio;
        printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
          { text:codigo, align:"RIGHT", cols:7},
          { text:cantidad, align:"CENTER", cols:4},
          { text:producto, align:"LEFT", cols:23},
          { text:precio, align:"RIGHT",cols:13}
        ]);
      });
      printer.drawLine();
      // printer.println("--------------------------");
      printer.bold(true);
      sql = "select sum(precio) as monto_total from pedido "+
      " where consumidor_id = "+ consumidor_id.toString()+ " group by consumidor_id";
      // console.log(sql);  
      connection.query(sql, (err, results, fields) => {
        if (err) {
          console.error('Error al imprimir pedidos: ' + err.stack);
          res.status(500).send('Error al insert pedidos');
          return;
        }
        printer.alignCenter();
        printer.setTextDoubleWidth(); 
        printer.println(`Total GS = ${results[0].monto_total}`);   
        printer.bold(false);   
        printer.setTextNormal();  
        printer.println(`Favor facilitar`);   
        printer.alignLeft();
        printer.setTextDoubleHeight(); 
        printer.println(`\t Nombre:________________________________`);
        printer.println(`\t    RUC:________________________________`);
        printer.println(`\tPROPINA:________________________________`);   
        
        
        printer.cut();
        try {
          let execute = printer.execute()
          console.log("imprimirPedidos Print done!");
        } catch (error) {
          console.error("Print failed:", error);
        }
            
      });    

      

    });

  });

  res.send('imprimido Cuenta');
});

app.get('/ruc', (req, res) => {
  // res.send('Hola'); req.body['mesa']
  console.log('get /ruc');
  var sql = "select ruc,nombre,direccion,telefono from ruc where ruc = '" + req.query.ruc +"'";
  var entro = 0;
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Error al ruc: ' + err.stack);
      res.status(500).send('Error al get ruc');
      return;
    }
    var datos_nuevo = []
    if(results.length > 0){
      datos_nuevo = results[0];
      entro = 1;
      console.log(results);
    }else{
      console.log("no encontro");
    }
    res.json({'datos':datos_nuevo,'encontro':entro});
  });
});

app.get('/ruc', (req, res) => {
  // res.send('Hola'); req.body['mesa']
  console.log('get /ruc');
  var sql = "select ruc,nombre,direccion,telefono,id from ruc where ruc = '" + req.query.ruc +"'";
  var entro = 0;
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.error('Error al ruc: ' + err.stack);
      res.status(500).send('Error al get ruc');
      return;
    }
    var datos_nuevo = []
    if(results.length > 0){
      datos_nuevo = results[0];
      entro = 1;
      console.log(results);
    }else{
      console.log("no encontro");
    }
    res.json({'datos':datos_nuevo,'encontro':entro});
  });
});

app.get('/imprimir_factura', (req, res) => {
  // res.send('Hola'); req.body['mesa']
  console.log('get /imprimir_factura');
  var ruc_id = -1;
  var sql = "select id from ruc where ruc = '" + req.query.ruc +"' and nombre = '"+req.query.nombre+"'";
  connection.query(sql, (err, results, fields) => {
    if (err) {
      return;
    }
    var datos_nuevo = []
    if(results.length > 0){
      ruc_id = results[0].id
    }else{
      sql = "insert into ruc (nombre,ruc,direccion,telefono) values ('"+
        req.query.nombre+ "','"+
        req.query.ruc+ "','"+
        req.query.direccion+ "','"+
        req.query.telefono+ "')";
      connection.query(sql, (err, results, fields) => {
          if (err) {
            return;
          }
          // var ruc_id = results.insertId;
      });
    }

    //actualizar el id de cliente en consumidor observacion
    sql = "select consumidor_id from mesa where numero = '"+req.query.mesa+"'";
    connection.query(sql, (err, results, fields) => {
      if (err) {
        return;
      }
      var consumidor_id = results[0].consumidor_id;
      sql = "update consumidor set nombre = '"+req.query.nombre+"'"+
          ", ruc = '"+req.query.ruc +"'"+
          ", direccion = '"+req.query.direccion+"'"+
          ", telefono = '"+req.query.telefono+"' where id = "+consumidor_id.toString();
      connection.query(sql, (err, results, fields) => {
        if (err) {
          return;
        }
      });
      var texto_imprimir = [];
      var inicio = 12;
      const now = new Date();
      texto_imprimir.splice(inicio,0,`${now.getDay().toString()} ${now.getMonth().toString()} ${now.getFullYear().toString()}   x`);
      texto_imprimir.splice(inicio+1,0,`${req.query.nombre} ${req.query.ruc} `);
      texto_imprimir.splice(inicio+2,0,`${req.query.direccion} ${req.query.telefono} `);
      sql = "select sum(cantidad) as cantidad, producto,precio_unit, sum(precio) as precio,codigo from pedido "+
        " where consumidor_id = "+ consumidor_id.toString()+ " group by producto, precio_unit,codigo";
      connection.query(sql, (err, results, fields) => {
        if (err) {
          return;
        }
        var i =0;
        var monto = 0;
        results.forEach(function (result) {
          // console.log(result);
          texto_imprimir.splice(16+i,0,`${result.cantidad}   ${result.producto}   ${result.precio_unit}  ${result.precio} `);
          i = i+1;
          monto = monto + result.precio;
        });
        texto_imprimir.splice(35,0,`  ${monto} `);
          
        console.log(texto_imprimir);
        // deviceHP.printDirect({
        //   data: texto_imprimir,
        //   type: "RAW",
        //   success: function(jobID) {
        //     console.log("Trabajo de impresión enviado con éxito. ID:", jobID);
        //   },
        //   error: function(err) {
        //     console.log(err);
        //   }
        // });
    
      });


    });

    
    // res.json({'datos':datos_nuevo,'encontro':entro});
  });
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});