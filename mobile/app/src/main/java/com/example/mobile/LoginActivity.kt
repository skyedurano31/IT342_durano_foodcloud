package com.example.mobile

import android.content.Intent
import android.os.Bundle
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

    private lateinit var usernameInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var loginButton: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var errorText: TextView
    private lateinit var registerLink: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Initialize views
        usernameInput = findViewById(R.id.etUsername)
        passwordInput = findViewById(R.id.etPassword)
        loginButton = findViewById(R.id.btnLogin)
        progressBar = findViewById(R.id.progressBar)
        errorText = findViewById(R.id.tvError)
        registerLink = findViewById(R.id.tvRegisterLink)

        // Set click listeners
        loginButton.setOnClickListener {
            performLogin()
        }

        registerLink.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun performLogin() {
        val username = usernameInput.text.toString().trim()
        val password = passwordInput.text.toString()

        // Validation
        if (username.isEmpty()) {
            usernameInput.error = "Username is required"
            return
        }

        if (password.isEmpty()) {
            passwordInput.error = "Password is required"
            return
        }

        // Show loading
        showLoading(true)
        errorText.visibility = android.view.View.GONE

        // Set Basic Auth credentials
        RetrofitClient.setAuthToken(username, password)

        // Make API call
        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = RetrofitClient.instance.login(
                    LoginRequestDTO(username, password)
                )

                withContext(Dispatchers.Main) {
                    showLoading(false)

                    if (response.isSuccessful) {
                        val authResponse = response.body()

                        if (authResponse != null && authResponse.success == true) {
                            // Login successful
                            Toast.makeText(
                                this@LoginActivity,
                                "Welcome ${authResponse.username}!",
                                Toast.LENGTH_LONG
                            ).show()

                            // Save user info (using SharedPreferences)
                            saveUserSession(authResponse)

                            // Navigate to Main Activity
                            startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                            finish()

                        } else {
                            errorText.text = authResponse?.message ?: "Login failed"
                            errorText.visibility = android.view.View.VISIBLE
                        }
                    } else {
                        errorText.text = "Login failed. Check your credentials."
                        errorText.visibility = android.view.View.VISIBLE
                    }
                }

            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    showLoading(false)
                    errorText.text = "Network error: ${e.message}"
                    errorText.visibility = android.view.View.VISIBLE
                }
            }
        }
    }

    private fun saveUserSession(authResponse: com.example.mobile.models.AuthResponseDTO) {
        val sharedPref = getSharedPreferences("app_prefs", MODE_PRIVATE)
        sharedPref.edit().apply {
            putString("username", authResponse.username)
            putString("email", authResponse.email)
            putString("role", authResponse.role)
            putBoolean("isLoggedIn", true)
            apply()
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