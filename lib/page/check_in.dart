// ignore_for_file: must_be_immutable

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
// import 'package:syncfusion_flutter_datepicker/datepicker.dart';

class CheckIn extends StatefulWidget {
  String habitacion;

  CheckIn({Key? key, required this.habitacion}) : super(key: key);

  @override
  _CheckInPageState createState() => _CheckInPageState();
}

class _CheckInPageState extends State<CheckIn> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController dateInput = TextEditingController();
  String _firstName = '';
  String _lastName = '';
  int _numberOfGuests = 1;
  DateTime _checkInDate = DateTime.now();

  void initState() {
    // TODO: implement initState
    super.initState();
    // Step 2 <- SEE HERE
    dateInput.text = DateFormat('dd-MM-yyyy').format(DateTime.now());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Check-In'),
      ),
      body: Form(
        key: _formKey,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            children: [
              TextFormField(
                decoration: InputDecoration(labelText: 'Nombre'),
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Please enter your first name.';
                  }
                  return null;
                },
                onSaved: (value) {
                  _firstName = value!;
                },
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Apellido'),
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Please enter your last name.';
                  }
                  return null;
                },
                onSaved: (value) {
                  _lastName = value!;
                },
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Cant de Persona'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Please enter the number of guests.';
                  }
                  if (int.parse(value) < 1) {
                    return 'The number of guests must be greater than 0.';
                  }
                  return null;
                },
                onSaved: (value) {
                  _numberOfGuests = int.parse(value!);
                },
              ),
              // TextFormField(
              //   decoration: InputDecoration(labelText: 'Check-in Date'),
              //   keyboardType: TextInputType.datetime,
              //   validator: (value) {
              //     if (value!.isEmpty) {
              //       return 'Please enter the check-in date.';
              //     }
              //     // if (DateTime.parse(value) < DateTime.now()) {
              //     //   return 'The check-in date must be in the future.';
              //     // }
              //     return null;
              //   },
              //   onSaved: (value) {
              //     _checkInDate = DateTime.parse(value!);
              //   },
              // ),
              // DatePicker(
              //   initialDate: DateTime.now(),
              //   firstDate: DateTime.now(),
              //   lastDate: DateTime(2023, 12, 31),
              //   onDateChanged: (date) {
              //     // Do something with the selected date
              //   },
              // ),
              // SfDateRangePicker(
              //   // onSelectionChanged: _onSelectionChanged,
              //   selectionMode: DateRangePickerSelectionMode.range,
              //   initialSelectedRange: PickerDateRange(
              //       DateTime.now().subtract(const Duration(days: 4)),
              //       DateTime.now().add(const Duration(days: 3))),
              // ),
              TextField(
                controller: dateInput,
                //editing controller of this TextField
                decoration: InputDecoration(
                    icon: Icon(Icons.calendar_today), //icon of text field
                    labelText: "Fecha Ingreso" //label text of field
                    ),
                readOnly: true,
                //set it true, so that user will not able to edit text
                onTap: () async {
                  DateTime? pickedDate = await showDatePicker(
                      context: context,
                      locale: const Locale("es", "ES"),
                      initialDate: DateTime.now(),
                      firstDate: DateTime(2000),
                      //DateTime.now() - not to allow to choose before today.
                      lastDate: DateTime(2100));

                  if (pickedDate != null) {
                    print(
                        pickedDate); //pickedDate output format => 2021-03-10 00:00:00.000
                    String formattedDate =
                        DateFormat('dd-MM-yyyy').format(pickedDate);
                    print(
                        formattedDate); //formatted date output using intl package =>  2021-03-16
                    setState(() {
                      dateInput.text =
                          formattedDate; //set output date to TextField value.
                    });
                  } else {}
                },
              ),
              ElevatedButton(
                child: Text('Check In'),
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    // TODO: Submit the form to the server.
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
