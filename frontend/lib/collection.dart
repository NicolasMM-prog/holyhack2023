import 'package:flutter/material.dart';
import 'package:my_app/library.dart';
import 'package:my_app/shopping.dart';

import 'search.dart';

class AddCollectionScreen extends StatefulWidget {
  const AddCollectionScreen({super.key, required this.item, required this.index});
  final int index;
  final ItemCollection? item;

  @override
  State<AddCollectionScreen> createState() => _AddCollectionScreenState(item?.items ?? <ShoppingItem>[], item?.title ?? "");
}

class _AddCollectionScreenState extends State<AddCollectionScreen> {
  _AddCollectionScreenState(this._items, this._title);
  List<ShoppingItem> _items;
  var _title;

  void _deleteCollection(context) {
    Navigator.pop(context, widget.index);
  }

  void _saveCollection(context) {
    Navigator.pop(context, ItemCollection(index: widget.index, title: _title, items: _items));
  }

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
    if (!mounted) return;
    if (result is ShoppingItem) {
      _addItem(result);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit collection'),
        actions: [
          IconButton(onPressed: () { _saveCollection(context); }, icon: const Icon(Icons.done), tooltip: "Save collection", padding: const EdgeInsets.only(right: 5)),
          IconButton(onPressed: () async { _deleteCollection(context); }, icon: const Icon(Icons.delete_outline), tooltip: "Delete collection", padding: const EdgeInsets.only(right: 5),),
          IconButton(onPressed: () async { _toAddScreen(context); }, icon: const Icon(Icons.add_circle_outline), tooltip: "Add item", padding: const EdgeInsets.only(right: 5),),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(15),
        children: [
          TextField(
            autofocus: true,
            decoration: const InputDecoration(hintText: "Collection name..."),
            onChanged: (input) { _title = input; },
          ),
          Column(children: () {
            if (_items.isNotEmpty) {
              return _items.asMap().entries.map((entry) => OverviewItem(item: entry.value, onDelete: () { _removeItem(entry.key); }),).toList();
            } else {
              return const [Center(child: Text("No items currently", style: TextStyle(fontStyle: FontStyle.italic, color: Colors.black54),))];
            }
          }()),
        ],
      ),
    );
  }

}
