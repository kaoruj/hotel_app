class Clientes {
  //modal class for Pedido object
  String documento, nombre, apellido;
  DateTime fechaNacimiento;

  Clientes(
      {required this.documento,
      required this.nombre,
      required this.apellido,
      required this.fechaNacimiento});

  static List toListar(List<Clientes> lista) {
    return lista
        .map((x) => {
              "documento": x.documento,
              "nombre": x.nombre,
              "apellido": x.apellido,
              "fecha_nacimiento": x.fechaNacimiento
            })
        .toList();
  }

  factory Clientes.fromJson(Map<String, dynamic> json) {
    return Clientes(
        documento: json['documento'],
        nombre: json['nombre'],
        apellido: json['apellido'],
        fechaNacimiento: DateTime.parse(json['fechaNacimiento'].toString()));
  }
}
