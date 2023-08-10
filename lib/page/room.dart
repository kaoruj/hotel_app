import 'package:flutter/material.dart';
import 'package:hotel_app/global/variable.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Room extends StatefulWidget {
  const Room({super.key});

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
      var url = Uri.http(url_global, '/rooms', {});
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
    final ColorScheme colorScheme = Theme.of(context).colorScheme;
    final Color oddItemColor = colorScheme.primary.withOpacity(0.05);
    final Color evenItemColor = colorScheme.primary.withOpacity(0.15);

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
          crossAxisCount: 5,
          childAspectRatio: 2.0,
          mainAxisSpacing: 10.0,
          crossAxisSpacing: 10.0,
        ),
        itemBuilder: (BuildContext context, int index) {
          // if (index == 0) {
          //   return Center(
          //     child: Text(
          //       'Scroll to see the Appbar in effect.',
          //       style: Theme.of(context).textTheme.labelLarge,
          //       textAlign: TextAlign.center,
          //     ),
          //   );
          // }
          return Container(
            alignment: Alignment.center,
            // tileColor: _items[index].isOdd ? oddItemColor : evenItemColor,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20.0),
              color:
                  _rooms[index]['ocupado'] == 0 ? oddItemColor : evenItemColor,
            ),
            child: Text(_rooms[index]['numero']),
          );
        },
      ),
    );
  }
}
