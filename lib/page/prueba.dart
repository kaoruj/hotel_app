import 'package:flutter/material.dart';

class Prueba extends StatefulWidget {
  @override
  _PruebaPageState createState() => new _PruebaPageState();
}

class _PruebaPageState extends State<Prueba> {
  List<Cliente> clientes = [];
  String documento = '';
  String nombre = '';

  @override
  void initState() {
    super.initState();
    clientes.add(new Cliente(documento: '1234567890', nombre: 'Juan Pérez'));
    clientes.add(new Cliente(documento: '9876543210', nombre: 'María García'));
  }

  void buscarCliente() {
    setState(() {
      clientes.clear();
      for (Cliente cliente in clientes) {
        if (cliente.documento == documento || cliente.nombre == nombre) {
          clientes.add(cliente);
        }
      }
    });
  }

  void checkIn() {
    setState(() {
      clientes.remove(cliente);
    });
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text('Check-in'),
      ),
      body: new Padding(
        padding: const EdgeInsets.all(16.0),
        child: new Column(
          children: <Widget>[
            new TextFormField(
              decoration: new InputDecoration(
                labelText: 'Documento',
              ),
              onChanged: (value) {
                documento = value;
              },
            ),
            new TextFormField(
              decoration: new InputDecoration(
                labelText: 'Nombre',
              ),
              onChanged: (value) {
                nombre = value;
              },
            ),
            new RaisedButton(
              child: new Text('Buscar'),
              onPressed: buscarCliente,
            ),
            new ListView.builder(
              itemCount: clientes.length,
              itemBuilder: (context, index) {
                Cliente cliente = clientes[index];
                return new ListTile(
                  title: new Text(cliente.nombre),
                  subtitle: new Text(cliente.documento),
                  trailing: new RaisedButton(
                    child: new Text('Check-in'),
                    onPressed: checkIn,
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class Cliente {
  String documento;
  String nombre;

  Cliente({this.documento, this.nombre});
}
