package com.example.mobile.network

import okhttp3.Credentials
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {

    // For Android Emulator
    private const val BASE_URL = "http://10.0.2.2:8080/"

    // For Physical Device (replace with your computer's IP)
    // private const val BASE_URL = "http://192.168.1.100:8080/"

    private var authToken: String? = null

    fun setAuthToken(username: String, password: String) {
        authToken = Credentials.basic(username, password)
    }

    fun clearAuthToken() {
        authToken = null
    }

    private val client = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val original = chain.request()
            val requestBuilder = original.newBuilder()

            // Add Basic Auth header if token exists
            authToken?.let {
                requestBuilder.header("Authorization", it)
            }

            requestBuilder.header("Content-Type", "application/json")
            val request = requestBuilder.build()
            chain.proceed(request)
        }
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    val instance: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}