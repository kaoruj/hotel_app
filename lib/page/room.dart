import 'package:flutter/material.dart';

/// Flutter code sample for [AppBar].

final List<int> _items = List<int>.generate(51, (int index) => index);


class Room extends StatefulWidget {
  const Room({super.key});

  @override
  State<Room> createState() => _RoomState();
}

class _RoomState extends State<Room> {
  bool shadowColor = false;
  double? scrolledUnderElevation;

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
        itemCount: _items.length,
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
              color: _items[index].isOdd ? oddItemColor : evenItemColor,
            ),
            child: Text('Item $index'),
          );
        },
      ),
      // bottomNavigationBar: BottomAppBar(
      //   child: Padding(
      //     padding: const EdgeInsets.all(8),
      //     child: OverflowBar(
      //       overflowAlignment: OverflowBarAlignment.center,
      //       alignment: MainAxisAlignment.center,
      //       overflowSpacing: 5.0,
      //       children: <Widget>[
      //         ElevatedButton.icon(
      //           onPressed: () {
      //             setState(() {
      //               shadowColor = !shadowColor;
      //             });
      //           },
      //           icon: Icon(
      //             shadowColor ? Icons.visibility_off : Icons.visibility,
      //           ),
      //           label: const Text('shadow color'),
      //         ),
      //         const SizedBox(width: 5),
      //         ElevatedButton(
      //           onPressed: () {
      //             if (scrolledUnderElevation == null) {
      //               setState(() {
      //                 // Default elevation is 3.0, increment by 1.0.
      //                 scrolledUnderElevation = 4.0;
      //               });
      //             } else {
      //               setState(() {
      //                 scrolledUnderElevation = scrolledUnderElevation! + 1.0;
      //               });
      //             }
      //           },
      //           child: Text(
      //             'scrolledUnderElevation: ${scrolledUnderElevation ?? 'default'}',
      //           ),
      //         ),
      //       ],
      //     ),
      //   ),
      // ),
    );
  }
}
