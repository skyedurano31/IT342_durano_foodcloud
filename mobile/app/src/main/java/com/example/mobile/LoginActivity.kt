package com.example.mobile

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.mobile.models.LoginRequestDTO
import com.example.mobile.network.RetrofitClient
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class LoginActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "LoginActivity"
    }

    private lateinit var usernameInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var loginButton: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var errorText: TextView
    private lateinit var registerLink: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d(TAG, "========== LoginActivity onCreate ==========")
        setContentView(R.layout.activity_login)

        // Check if already logged in
        val sharedPref = getSharedPreferences("app_prefs", MODE_PRIVATE)
        val isLoggedIn = sharedPref.getBoolean("isLoggedIn", false)
        Log.d(TAG, "isLoggedIn: $isLoggedIn")

        if (isLoggedIn) {
            Log.d(TAG, "Already logged in, going to Dashboard")
            navigateToDashboard()
            return
        }

        // Initialize views
        usernameInput = findViewById(R.id.etUsername)
        passwordInput = findViewById(R.id.etPassword)
        loginButton = findViewById(R.id.btnLogin)
        progressBar = findViewById(R.id.progressBar)
        errorText = findViewById(R.id.tvError)
        registerLink = findViewById(R.id.tvRegisterLink)

        Log.d(TAG, "Views initialized successfully")

        loginButton.setOnClickListener {
            Log.d(TAG, "Login button clicked")
            performLogin()
        }

        registerLink.setOnClickListener {
            Log.d(TAG, "Register link clicked")
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun performLogin() {
        val username = usernameInput.text.toString().trim()
        val password = passwordInput.text.toString()

        Log.d(TAG, "=== PERFORMING LOGIN ===")
        Log.d(TAG, "Username: $username")
        Log.d(TAG, "Password length: ${password.length}")

        if (username.isEmpty()) {
            Log.d(TAG, "Username is empty")
            usernameInput.error = "Username is required"
            return
        }

        if (password.isEmpty()) {
            Log.d(TAG, "Password is empty")
            passwordInput.error = "Password is required"
            return
        }

        showLoading(true)
        errorText.visibility = android.view.View.GONE

        // Set Basic Auth credentials
        RetrofitClient.setAuthToken(username, password)
        Log.d(TAG, "Auth token set for user: $username")

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                Log.d(TAG, "Making API call to login endpoint")
                val response = RetrofitClient.instance.login(
                    LoginRequestDTO(username, password)
                )

                Log.d(TAG, "API Response Code: ${response.code()}")
                Log.d(TAG, "API Response Successful: ${response.isSuccessful}")

                withContext(Dispatchers.Main) {
                    showLoading(false)

                    if (response.isSuccessful) {
                        val authResponse = response.body()
                        Log.d(TAG, "Response body: $authResponse")

                        if (authResponse != null) {
                            Log.d(TAG, "Response - authenticated: ${authResponse.authenticated}")
                            Log.d(TAG, "Response - success: ${authResponse.success}")
                            Log.d(TAG, "Response - username: ${authResponse.username}")
                            Log.d(TAG, "Response - message: ${authResponse.message}")

                            // Check authentication status
                            val isAuthenticated = authResponse.authenticated == true ||
                                    authResponse.success == true

                            Log.d(TAG, "isAuthenticated result: $isAuthenticated")

                            if (isAuthenticated) {
                                Log.d(TAG, "✅ LOGIN SUCCESSFUL! Saving session...")

                                // Save user session
                                saveUserSession(authResponse, username)

                                // Show success message
                                Toast.makeText(
                                    this@LoginActivity,
                                    "Welcome ${authResponse.username ?: username}!",
                                    Toast.LENGTH_LONG
                                ).show()

                                // Navigate to Dashboard
                                Log.d(TAG, "Attempting to navigate to DashboardActivity")
                                navigateToDashboard()

                            } else {
                                Log.d(TAG, "❌ Login failed: Not authenticated")
                                errorText.text = authResponse.message ?: "Login failed"
                                errorText.visibility = android.view.View.VISIBLE
                                RetrofitClient.clearAuthToken()
                            }
                        } else {
                            Log.d(TAG, "❌ Response body is null")
                            errorText.text = "Login failed: Empty response"
                            errorText.visibility = android.view.View.VISIBLE
                            RetrofitClient.clearAuthToken()
                        }
                    } else {
                        Log.d(TAG, "❌ Login failed with code: ${response.code()}")
                        val errorBody = response.errorBody()?.string()
                        Log.d(TAG, "Error body: $errorBody")
                        errorText.text = "Login failed. Check your credentials."
                        errorText.visibility = android.view.View.VISIBLE
                        RetrofitClient.clearAuthToken()
                    }
                }

            } catch (e: Exception) {
                Log.e(TAG, "❌ Login exception", e)
                withContext(Dispatchers.Main) {
                    showLoading(false)
                    errorText.text = "Network error: ${e.message}"
                    errorText.visibility = android.view.View.VISIBLE
                    RetrofitClient.clearAuthToken()
                }
            }
        }
    }

    private fun saveUserSession(authResponse: com.example.mobile.models.AuthResponseDTO, username: String) {
        Log.d(TAG, "Saving user session to SharedPreferences")
        val sharedPref = getSharedPreferences("app_prefs", MODE_PRIVATE)
        sharedPref.edit().apply {
            putString("username", authResponse.username ?: username)
            putString("email", authResponse.email ?: "")
            putString("role", authResponse.role ?: "USER")
            putBoolean("isLoggedIn", true)
            apply()
        }
        Log.d(TAG, "User session saved successfully")
    }

    private fun navigateToDashboard() {
        try {
            Log.d(TAG, "📱 Starting DashboardActivity...")
            val intent = Intent(this, DashboardActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            Log.d(TAG, "✅ DashboardActivity started successfully")
            finish()
            Log.d(TAG, "LoginActivity finished")
        } catch (e: Exception) {
            Log.e(TAG, "❌ ERROR navigating to Dashboard", e)
            Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun showLoading(show: Boolean) {
        if (show) {
            progressBar.visibility = android.view.View.VISIBLE
            loginButton.isEnabled = false
            loginButton.text = ""
        } else {
            progressBar.visibility = android.view.View.GONE
            loginButton.isEnabled = true
            loginButton.text = "Login"
        }
    }
}