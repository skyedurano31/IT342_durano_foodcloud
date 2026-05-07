// data/models/User.kt
package com.example.mobile3.data.models

data class User(
    val id: Long,
    val username: String,
    val email: String?,
    val role: String
)