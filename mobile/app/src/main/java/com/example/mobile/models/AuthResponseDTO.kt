package com.example.mobile.models

import com.google.gson.annotations.SerializedName

data class AuthResponseDTO(
    @SerializedName("message")
    val message: String? = null,

    @SerializedName("username")
    val username: String? = null,

    @SerializedName("email")
    val email: String? = null,

    @SerializedName("role")
    val role: String? = null,

    @SerializedName("success")
    val success: Boolean = false
)