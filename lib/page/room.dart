// ignore_for_file: must_be_immutable

import 'package:flutter/material.dart';
import 'package:hotel_app/global/variable.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:hotel_app/page/check_in.dart';

class Room extends StatefulWidget {
  int honkan;

  Room({Key? key, required this.honkan}) : super(key: key);

  @override
  State<Room> createState() => _RoomState();
}

class _RoomState extends State<Room> {
  bool shadowColor = false;
  double? scrolledUnderElevation;
  // final List<int> _items = List<int>.generate(51, (int index) => index);
  List<dynamic> _rooms = [];

  void initState() {
    obtenrDatos();
    super.initState();
  }

  Future<List<dynamic>> getRooms() async {
    var response;

    try {
      // final url = Uri.parse( + "");
      var url =
          Uri.http(url_global, '/rooms', {'honkan': widget.honkan.toString()});
      // response = await http.get(Uri.http(url.authority, url.path));
      response = await http.get(url);
      if (response.statusCode == 200) {
        // print(response.body);
        return jsonDecode(response.body);
      } else {
        // Si ha habido algún error, lanzamos una excepción con un mensaje de error
        print("error loadData Room");
        throw Exception('Error al obtener los room: ${response.reasonPhrase}');
      }
    } catch (e) {
      print("Error al realizar la solicitud: $e");
      return [];
    }
  }

  Future<void> obtenrDatos() async {
    List<dynamic> data = await getRooms();
    _rooms = data
        .map((item) => {'numero': item['numero'], 'ocupado': item['ocupado']})
        .toList();
    // print(_rooms.toString());
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    // final ColorScheme colorScheme = Theme.of(context).colorScheme;
    final Color ocupadoColor = Color.fromARGB(255, 239, 154, 154);
    final Color libreColor = Color.fromARGB(255, 165, 214, 167);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Habitacion'),
        scrolledUnderElevation: scrolledUnderElevation,
        shadowColor: shadowColor ? Theme.of(context).colorScheme.shadow : null,
      ),
      body: GridView.builder(
        itemCount: _rooms.length,
        padding: const EdgeInsets.all(8.0),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 6,
          childAspectRatio: 2.0,
          mainAxisSpacing: 10.0,
          crossAxisSpacing: 10.0,
        ),
        itemBuilder: (BuildContext context, int index) {
          return Container(
            alignment: Alignment.center,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: _rooms[index]['ocupado'] == 0
                    ? libreColor
                    : ocupadoColor, // Background color
              ),
              onPressed: () {
                //completar
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) =>
                        CheckIn(habitacion: _rooms[index]['numero']),
                  ),
                );
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Text(producto.nombre),
                  Text(_rooms[index]['numero'],
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
