// data/models/Product.kt
package com.example.mobile3.data.models

data class Product(
    val id: Long,
    val name: String,
    val description: String,
    val price: Double,
    val categoryId: Long,
    val imageUrl: String?,
    val isAvailable: Boolean = true
)

data class ProductDto(
    val id: Long,
    val name: String,
    val description: String,
    val price: Double,
    val categoryId: Long,
    val imageUrl: String?
)