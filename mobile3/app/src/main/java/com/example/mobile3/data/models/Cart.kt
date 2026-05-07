// data/models/Cart.kt
package com.example.mobile3.data.models

data class CartItem(
    val id: Long,
    val productId: Long,
    val productName: String,
    val productPrice: Double,
    val quantity: Int,
    val subtotal: Double
)

data class CartDto(
    val items: List<CartItem>,
    val totalAmount: Double,
    val itemCount: Int
)