import 'package:flutter/material.dart';

class ShoppingItem {
  ShoppingItem({required this.title, required this.kiloPrice, this.itemPrice = 0.0, this.imageUrl = "", this.brand = "",});

  double itemPrice;
  double kiloPrice;
  String imageUrl;
  String brand;
  String title;
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
              Expanded(child: Text(item.title, style: const TextStyle(fontSize: 20))),
              Text(item.kiloPrice.toString(), style: const TextStyle(fontSize: 17)),
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
