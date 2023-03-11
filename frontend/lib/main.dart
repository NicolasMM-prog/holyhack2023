import 'package:flutter/material.dart';
import 'search.dart';
import 'shopping.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Shopping List',
      theme: ThemeData(
        primarySwatch: Colors.teal,
      ),
      home: const MyHomePage(title: 'Shopping List'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final _items = <ShoppingItem>[];

  void _addItem(ShoppingItem item) {
    setState(() {
      _items.add(item);
    });
  }

  void _removeItem(int index) {
    setState(() {
      _items.removeAt(index);
    });
  }

  Future<void> _toAddScreen(context) async {
    final result = await Navigator.push(context, MaterialPageRoute(builder: (context) => const SearchScreen()));
      // products: [
      //   [ProductDetails(brand: "Brand1", productName: "Product1", price: 0.1), ProductDetails(brand: "Brand2", productName: "Product2", price: 0.2)],
      //   // [],
      // ],
    // )));
    if (!mounted) return;
    if (result is ShoppingItem) {
      if (result.kiloPrices.isNotEmpty) {
        _addItem(result);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(onPressed: () async { _toAddScreen(context); }, icon: const Icon(Icons.add_circle_outline), tooltip: "Add item", padding: const EdgeInsets.only(right: 10),),
        ],
        title: Text(widget.title),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: () {
          if (_items.isNotEmpty) {
            return _items.asMap().entries.map((entry) => OverviewItem(item: entry.value, onDelete: () { _removeItem(entry.key); }),).toList();
          } else {
            return const [Center(child: Text("No items currently", style: TextStyle(fontStyle: FontStyle.italic, color: Colors.black54),))];
          }
        }(),
      ),
    );
  }
}
