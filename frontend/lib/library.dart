import 'package:flutter/material.dart';
import 'package:my_app/list_item.dart';
import 'shopping.dart';
import 'collection.dart';

class ItemCollection {
  ItemCollection({this.index = -1, required this.title, required this.items});

  int index;
  String title;
  List<ShoppingItem> items;
}

class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});

  @override
  State<StatefulWidget> createState() => _LibraryScreen();
}

class _LibraryScreen extends State<LibraryScreen> {
  var _items = <ItemCollection>[];

  void _addItem(ItemCollection item) {
    setState(() {
      if (item.index < 0 || item.index >= _items.length) {
        _items.add(item);
      } else {
        _items[item.index] = item;
      }
    });
  }

  void _removeItem(int index) {
    setState(() {
      _items.removeAt(index);
    });
  }

  Future<void> _toAddCollectionScreen(context, index) async {
    final result = await Navigator.push(context, MaterialPageRoute(builder: (context) => AddCollectionScreen(item: (index != -1 ? _items[index] : null), index: index)));
    if (!mounted) return;
    if (result is ItemCollection) {
      _addItem(result);
    } else if (result is int && result != -1) {
      _removeItem(result);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(onPressed: () async { _toAddCollectionScreen(context, -1); }, icon: const Icon(Icons.edit), tooltip: "New collection", padding: const EdgeInsets.only(right: 5),),
        ],
        title: const Text("Edit collection"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(15),
        children: _items.asMap().entries.map((e) => ListItem(
          child: Row(children: [
            Expanded(child: Text(e.value.title, style: const TextStyle(fontSize: 20))),
            Tooltip(
              message: "Edit",
              child: Container(
                decoration: const BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(10))
                  ),
                padding: const EdgeInsetsDirectional.all(6),
                child: GestureDetector(
                  onTap: () async { _toAddCollectionScreen(context, e.key); },
                  child: IconButton(onPressed: () async { _toAddCollectionScreen(context, e.key);}, icon: const Icon(Icons.navigate_next, color: Colors.black54, size: 30,))
                  ),
                ),
              ),
          ],))).toList(),
      )
    );
  }

}
