// data/models/Order.kt
package com.example.mobile3.data.models

data class OrderDto(
    val id: Long,
    val userId: Long,
    val orderDate: String,
    val totalAmount: Double,
    val status: String,
    val building: String,
    val roomNumber: String,
    val deliveryInstructions: String,
    val phoneNumber: String
)

data class CheckoutRequest(
    val userId: Long,
    val building: String,
    val roomNumber: String,
    val deliveryInstructions: String,
    val phoneNumber: String
)