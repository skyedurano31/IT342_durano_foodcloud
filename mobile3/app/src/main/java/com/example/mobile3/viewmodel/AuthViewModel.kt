package com.example.mobile3.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.mobile3.data.api.RetrofitInstance
import com.example.mobile3.data.api.RegisterRequest
import com.example.mobile3.utils.SessionManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import okhttp3.Credentials

class AuthViewModel(private val context: Context) : ViewModel() {
    private val api = RetrofitInstance.api
    private val sessionManager = SessionManager(context)

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState

    fun login(username: String, password: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            try {
                val credentials = Credentials.basic(username, password)
                val response = api.getCurrentUser(credentials)

                if (response.isSuccessful) {
                    val user = response.body()
                    user?.let {
                        sessionManager.saveUserSession(
                            it.id, it.username, password, it.email, it.role
                        )
                        _uiState.value = AuthUiState(
                            isSuccess = true,
                            isLoading = false,
                            userId = it.id,
                            username = it.username
                        )
                    }
                } else {
                    _uiState.value = AuthUiState(
                        errorMessage = when (response.code()) {
                            401 -> "Invalid username or password"
                            403 -> "Account access denied"
                            else -> "Login failed: ${response.message()}"
                        },
                        isLoading = false
                    )
                }
            } catch (e: Exception) {
                _uiState.value = AuthUiState(
                    errorMessage = "Network error: ${e.message}",
                    isLoading = false
                )
            }
        }
    }

    fun register(username: String, email: String?, password: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            try {
                val request = RegisterRequest(
                    username = username,
                    email = email,
                    password_hash = password
                )
                val response = api.register(request)

                if (response.isSuccessful) {
                    _uiState.value = AuthUiState(isLoading = false)
                    onSuccess()
                } else {
                    _uiState.value = AuthUiState(
                        errorMessage = response.message() ?: "Registration failed",
                        isLoading = false
                    )
                }
            } catch (e: Exception) {
                _uiState.value = AuthUiState(
                    errorMessage = "Network error: ${e.message}",
                    isLoading = false
                )
            }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(errorMessage = null)
    }

    suspend fun logout() {
        sessionManager.clearSession()
    }
}

data class AuthUiState(
    val isLoading: Boolean = false,
    val isSuccess: Boolean = false,
    val errorMessage: String? = null,
    val userId: Long? = null,
    val username: String? = null
)