import 'package:flutter/material.dart';

class ListItem extends StatelessWidget {
  const ListItem({super.key, this.padding = 25.0, required this.child });

  final double padding;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 70,
      child: Card(
        elevation: 6,
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: padding),
          child: child,
          // child: Row(
          //   mainAxisSize: MainAxisSize.min,
          //   children: [ left, right, ],
          // ),
        ),
      )
    );
  }

}
