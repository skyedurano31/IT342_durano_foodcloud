package com.example.mobile.network

import com.example.mobile.models.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    @POST("/api/auth/register")
    suspend fun register(
        @Body user: User
    ): Response<AuthResponseDTO>

    @POST("/api/auth/login")
    suspend fun login(
        @Body loginRequest: LoginRequestDTO
    ): Response<AuthResponseDTO>

    @GET("/api/auth/me")
    suspend fun getCurrentUser(): Response<AuthResponseDTO>

    @POST("/api/auth/logout")
    suspend fun logout(): Response<AuthResponseDTO>
}