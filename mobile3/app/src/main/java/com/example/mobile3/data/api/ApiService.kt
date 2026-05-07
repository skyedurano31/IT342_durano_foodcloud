// data/api/ApiService.kt
package com.example.mobile3.data.api

import com.example.mobile3.data.models.*
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

interface ApiService {
    // Auth endpoints
    @GET("/api/auth/me")
    suspend fun getCurrentUser(@Header("Authorization") authorization: String): retrofit2.Response<UserResponse>

    @POST("/api/auth/register")
    suspend fun register(@Body request: RegisterRequest): retrofit2.Response<AuthResponse>

    // Product endpoints - NEED AUTH
    @GET("/api/products")
    suspend fun getAllProducts(@Header("Authorization") authorization: String): retrofit2.Response<List<Product>>

    @GET("/api/products/{id}")
    suspend fun getProduct(
        @Header("Authorization") authorization: String,
        @Path("id") id: Long
    ): retrofit2.Response<Product>

    // Cart endpoints - NEED AUTH
    @GET("/api/cart")
    suspend fun getCart(
        @Header("Authorization") authorization: String,
        @Query("userId") userId: Long
    ): retrofit2.Response<CartDto>

    @POST("/api/cart/add")
    suspend fun addToCart(
        @Header("Authorization") authorization: String,
        @Body request: CartAddRequest
    ): retrofit2.Response<CartDto>

    @DELETE("/api/cart/items/{cartItemId}")
    suspend fun removeFromCart(
        @Header("Authorization") authorization: String,
        @Query("userId") userId: Long,
        @Path("cartItemId") cartItemId: Long
    ): retrofit2.Response<CartDto>

    @GET("/api/cart/count")
    suspend fun getCartCount(
        @Header("Authorization") authorization: String,
        @Query("userId") userId: Long
    ): retrofit2.Response<Int>

    // Order endpoints - NEED AUTH
    @POST("/api/orders/checkout")
    suspend fun checkout(
        @Header("Authorization") authorization: String,
        @Body request: CheckoutRequest
    ): retrofit2.Response<OrderDto>

    @GET("/api/orders/user/{userId}")
    suspend fun getUserOrders(
        @Header("Authorization") authorization: String,
        @Path("userId") userId: Long
    ): retrofit2.Response<List<OrderDto>>
}

// Request/Response data classes
data class RegisterRequest(
    val username: String,
    val email: String?,
    val password_hash: String
)

data class AuthResponse(
    val message: String,
    val username: String?,
    val email: String?,
    val role: String?,
    val success: Boolean
)

data class UserResponse(
    val id: Long,
    val username: String,
    val email: String?,
    val role: String
)

data class CartAddRequest(
    val userId: Long,
    val productId: Long,
    val quantity: Int
)

data class CheckoutRequest(
    val userId: Long,
    val building: String,
    val roomNumber: String,
    val deliveryInstructions: String,
    val phoneNumber: String
)

// Retrofit Instance
object RetrofitInstance {
    private const val BASE_URL = "http://10.0.2.2:8080/"

    private val client = OkHttpClient.Builder()
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    val api: ApiService = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(client)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(ApiService::class.java)
}