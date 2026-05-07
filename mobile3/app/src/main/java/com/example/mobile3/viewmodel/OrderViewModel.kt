package com.example.mobile3.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.mobile3.data.api.RetrofitInstance
import com.example.mobile3.data.api.CheckoutRequest
import com.example.mobile3.data.models.OrderDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import okhttp3.Credentials
import android.util.Log

class OrderViewModel(
    private val username: String,
    private val password: String
) : ViewModel() {
    private val api = RetrofitInstance.api
    private val TAG = "OrderViewModel"

    private val _orders = MutableStateFlow<List<OrderDto>>(emptyList())
    val orders: StateFlow<List<OrderDto>> = _orders

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage

    private val _checkoutResult = MutableStateFlow<OrderDto?>(null)
    val checkoutResult: StateFlow<OrderDto?> = _checkoutResult

    fun loadUserOrders(userId: Long) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val credentials = Credentials.basic(username, password)
                val response = api.getUserOrders(credentials, userId)

                if (response.isSuccessful) {
                    _orders.value = response.body() ?: emptyList()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Orders error", e)
            }
            _isLoading.value = false
        }
    }

    fun checkout(userId: Long, building: String, roomNumber: String,
                 deliveryInstructions: String, phoneNumber: String) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val credentials = Credentials.basic(username, password)
                val request = CheckoutRequest(
                    userId = userId,
                    building = building,
                    roomNumber = roomNumber,
                    deliveryInstructions = deliveryInstructions,
                    phoneNumber = phoneNumber
                )
                val response = api.checkout(credentials, request)

                if (response.isSuccessful) {
                    _checkoutResult.value = response.body()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Checkout error", e)
            }
            _isLoading.value = false
        }
    }

    fun clearCheckoutResult() {
        _checkoutResult.value = null
    }
}