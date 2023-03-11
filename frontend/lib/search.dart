import 'package:flutter/material.dart';
import 'package:my_app/shopping.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add item'),
      ),
      body: Container(
        padding: const EdgeInsets.all(15),
        child: Column(children: [
          TextField(
            autofocus: true,
            decoration: const InputDecoration(hintText: "Search..."),
            onSubmitted: (input) {
              Navigator.pop(context, ShoppingItem(title: input, kiloPrice: 2.0));
            },
          ),
        ],)
      ),
    );
  }

}
