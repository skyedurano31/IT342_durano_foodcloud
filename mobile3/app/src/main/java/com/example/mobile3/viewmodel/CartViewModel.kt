package com.example.mobile3.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.mobile3.data.api.CartAddRequest
import com.example.mobile3.data.api.RetrofitInstance
import com.example.mobile3.data.models.CartDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import okhttp3.Credentials
import android.util.Log

class CartViewModel(
    private val username: String,
    private val password: String
) : ViewModel() {
    private val api = RetrofitInstance.api
    private val TAG = "CartViewModel"

    private val _cart = MutableStateFlow<CartDto?>(null)
    val cart: StateFlow<CartDto?> = _cart

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage

    fun loadCart(userId: Long) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            try {
                val credentials = Credentials.basic(username, password)
                val response = api.getCart(credentials, userId)

                if (response.isSuccessful) {
                    _cart.value = response.body()
                    Log.d(TAG, "Cart loaded: ${_cart.value?.items?.size} items")
                } else {
                    _errorMessage.value = "Failed to load cart: ${response.code()}"
                }
            } catch (e: Exception) {
                _errorMessage.value = "Network error: ${e.message}"
            }
            _isLoading.value = false
        }
    }

    fun addToCart(userId: Long, productId: Long, quantity: Int) {
        viewModelScope.launch {
            try {
                val credentials = Credentials.basic(username, password)
                val request = CartAddRequest(userId, productId, quantity)
                val response = api.addToCart(credentials, request)

                if (response.isSuccessful) {
                    loadCart(userId)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Add to cart error", e)
            }
        }
    }

    fun removeFromCart(userId: Long, cartItemId: Long) {
        viewModelScope.launch {
            try {
                val credentials = Credentials.basic(username, password)
                val response = api.removeFromCart(credentials, userId, cartItemId)
                if (response.isSuccessful) {
                    loadCart(userId)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Remove from cart error", e)
            }
        }
    }

    fun clearError() {
        _errorMessage.value = null
    }
}