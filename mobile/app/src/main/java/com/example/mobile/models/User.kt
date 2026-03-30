package com.example.mobile.models

import com.google.gson.annotations.SerializedName

data class User(
    @SerializedName("username")
    val username: String,

    @SerializedName("password_hash")
    val password_hash: String,

    @SerializedName("email")
    val email: String? = null,

    @SerializedName("role")
    val role: String? = null
)