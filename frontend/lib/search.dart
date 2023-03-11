import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:my_app/shopping.dart';
import 'package:http/http.dart' as http;

class ProductDetails {
  ProductDetails({required this.brand, required this.productName, required this.image, required this.price});
  String brand;
  String productName;
  String image;
  num price;

  factory ProductDetails.fromJson(dynamic json) {
    return ProductDetails(
      brand: json['brand'] ?? "",
      productName: json['title'] ?? "",
      image: json['image'] ?? "",
      price: json['priceKilo'] ?? 0.0,
    );
  }
}

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  // final List<List<ProductDetails>> products;

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  var _searchTerm = "";
  var _stores = <String>[];
  List<List<ProductDetails>> _products = List.generate(0, (index) => []);
  var _indices = <int>[];
  var _done = <bool>[];
  var _requested = false;

  Widget createOption(String brand, String store, String productName, num price, int index) {
    return Card(
      color: () {
        if (_done[index]) {
          return Colors.lightGreen;
        } else {
          null;
        }
      }(),
      margin: const EdgeInsets.symmetric(vertical: 12),
      elevation: 6,
      child: Padding(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 25, vertical: 18),
        child: Row(
          children: [
            Expanded(child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
                Text(store, style: const TextStyle(fontSize: 13)),
                Text(productName, style: const TextStyle(fontSize: 20)),
                Text("$price €/kg  -  $brand ", style: const TextStyle(fontSize: 13)),
              ],),
            ),
            Row(children: [
              Tooltip(
                message: "Remove",
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      if (index >= _done.length) {
                        _done = List.filled(_products.length, false);
                      }
                      if (_done[index]) {
                        return;
                      }
                      if (index >= _indices.length) {
                        _indices = List.filled(_products.length, 0);
                      }
                      _indices[index] += 1;
                      if (_indices[index] >= _products[index].length) {
                        _indices[index] = 0;
                      }
                      });
                    },
                  child:
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.all(Radius.circular(10))
                      ),
                      padding: const EdgeInsetsDirectional.symmetric(horizontal: 18, vertical: 8),
                      child: const Icon(Icons.clear, color: Colors.white, size: 30,),
                  ),
                ),
              ),
              Tooltip(message: "Accept",
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      if (index >= _done.length) {
                        _done = List.filled(_products.length, false);
                      }
                      _done[index] = !_done[index];
                    });
                  },
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: const BoxDecoration(
                      color: Colors.green,
                      borderRadius: BorderRadius.all(Radius.circular(10))
                    ),
                    padding: const EdgeInsetsDirectional.symmetric(horizontal: 18, vertical: 8),
                    child: const Icon(Icons.check_box, color: Colors.white, size: 30,),
                  ),
                ),
              ),
            ],)
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add item'),
      ),
      body: Container(
        padding: const EdgeInsets.all(15),
        child: ListView(children: [
          TextField(
            autofocus: true,
            decoration: const InputDecoration(hintText: "Search..."),
            onSubmitted: (input) async {
              setState(() {
                _requested = false;
                _indices = [];
                _done = [];
              });
              _searchTerm = input;
              final response = await http.get(Uri.parse('http://localhost:3000/search?q=$_searchTerm'));
              var jsonBody = jsonDecode(response.body);
              setState(() {
                _stores = jsonBody.keys.toList();
                _products = List<List<ProductDetails>>.from(jsonBody.values.map((v) => List<ProductDetails>.from(v.map((e) => ProductDetails.fromJson(e)))));
                _requested = true;
              });
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Column(
              children: () {
                if (_products.isNotEmpty && _products[0].isNotEmpty) {
                  return _products.asMap().entries.map((e) {
                    if (e.key >= _indices.length) {
                      _indices = List.filled(_products.length, 0);
                    }
                    if (e.key >= _done.length) {
                      _done = List.filled(_products.length, false);
                    }
                    var product = e.value[_indices[e.key]];
                    return createOption(product.brand, _stores[e.key], product.productName, product.price, e.key);
                  }).toList();
                } else {
                  if (!_requested) {
                    return List<Widget>.empty();
                  } else {
                    return [const Text("No results found!")];
                  }
                }
              }()),
            ),
          TextButton(onPressed: () {
            var kiloPrices = List.empty(growable: true);
            var brands = List.empty(growable: true);
            var productNames = List.empty(growable: true);
            var stores = List.empty(growable: true);
            for (var i = 0; i < _products.length; ++i) {
              if (_done[i]) {
                kiloPrices.add(_products[i][_indices[i]].price);
                brands.add(_products[i][_indices[i]].brand);
                productNames.add(_products[i][_indices[i]].productName);
                stores.add(_stores[i]);
              }
            }
            Navigator.pop(context, ShoppingItem(kiloPrices: List<num>.from(kiloPrices), brands: List<String>.from(brands), stores: List<String>.from(stores), productNames: List<String>.from(productNames), searchTerm: _searchTerm));
          }, child: const Text("Add to list")),
        ])
      ),
    );
  }
}

showAlertDialog(BuildContext context) {

  // set up the button
}
