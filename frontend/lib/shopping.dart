import 'package:flutter/material.dart';

class ShoppingItem {
  ShoppingItem({required this.kiloPrices, required this.brands, required this.stores, required this.productNames, required this.searchTerm});

  List<num> kiloPrices;
  List<String> brands;
  List<String> stores;
  List<String> productNames;
  String searchTerm;
  }

class OverviewItem extends StatelessWidget {
  const OverviewItem({super.key, required this.item, required this.onDelete});
  final ShoppingItem item;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 75,
      child: Card(
        elevation: 6,
        child: Padding(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: 25),
          child: Row(
            children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(item.searchTerm, style: const TextStyle(fontSize: 20)),
                  Text(item.stores.fold("", (previousValue, element) => "$previousValue - $element").substring(3), style: const TextStyle(fontSize: 13),),
                ],
              ),),
              Tooltip(
                message: "Delete",
                child: Container(
                  decoration: const BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.all(Radius.circular(10))
                  ),
                  padding: const EdgeInsetsDirectional.all(6),
                  child: GestureDetector(
                    onTap: onDelete,
                    child: const Icon(Icons.delete_outline, color: Colors.white70, size: 30,),
                  ),
                ),
              ),
            ],
          ),
        ),
      )
    );
  }
}
