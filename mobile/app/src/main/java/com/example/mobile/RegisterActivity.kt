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
import com.example.mobile.models.User
import com.example.mobile.network.RetrofitClient
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class RegisterActivity : AppCompatActivity() {

    private lateinit var usernameInput: EditText
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var registerButton: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var errorText: TextView
    private lateinit var loginLink: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        // Initialize views
        usernameInput = findViewById(R.id.etUsername)
        emailInput = findViewById(R.id.etEmail)
        passwordInput = findViewById(R.id.etPassword)
        registerButton = findViewById(R.id.btnRegister)
        progressBar = findViewById(R.id.progressBar)
        errorText = findViewById(R.id.tvError)
        loginLink = findViewById(R.id.tvLoginLink)

        // Set click listeners
        registerButton.setOnClickListener {
            performRegistration()
        }

        loginLink.setOnClickListener {
            finish() // Go back to login
        }
    }

    private fun performRegistration() {
        val username = usernameInput.text.toString().trim()
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString()

        // Validation
        if (username.isEmpty()) {
            usernameInput.error = "Username is required"
            return
        }

        if (email.isEmpty()) {
            emailInput.error = "Email is required"
            return
        }

        if (password.isEmpty()) {
            passwordInput.error = "Password is required"
            return
        }

        if (password.length < 6) {
            passwordInput.error = "Password must be at least 6 characters"
            return
        }

        // Show loading
        showLoading(true)
        errorText.visibility = android.view.View.GONE

        // Create user object
        val user = User(
            username = username,
            password_hash = password,
            email = email
        )

        // Make API call
        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = RetrofitClient.instance.register(user)

                withContext(Dispatchers.Main) {
                    showLoading(false)

                    if (response.isSuccessful) {
                        val authResponse = response.body()

                        if (authResponse != null && authResponse.success == true) {
                            Toast.makeText(
                                this@RegisterActivity,
                                "Registration successful! Please login.",
                                Toast.LENGTH_LONG
                            ).show()

                            // Go back to login
                            finish()

                        } else {
                            errorText.text = authResponse?.message ?: "Registration failed"
                            errorText.visibility = android.view.View.VISIBLE
                        }
                    } else {
                        errorText.text = "Registration failed. Username may already exist."
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

    private fun showLoading(show: Boolean) {
        if (show) {
            progressBar.visibility = android.view.View.VISIBLE
            registerButton.isEnabled = false
            registerButton.text = ""
        } else {
            progressBar.visibility = android.view.View.GONE
            registerButton.isEnabled = true
            registerButton.text = "Register"
        }
    }
}