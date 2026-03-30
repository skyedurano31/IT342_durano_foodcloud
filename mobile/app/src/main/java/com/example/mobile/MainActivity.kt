package com.example.mobile

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.mobile.network.RetrofitClient
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class MainActivity : AppCompatActivity() {

    private lateinit var welcomeText: TextView
    private lateinit var userInfoText: TextView
    private lateinit var logoutButton: Button
    private lateinit var getUserInfoButton: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var sharedPref: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize views
        welcomeText = findViewById(R.id.tvWelcome)
        userInfoText = findViewById(R.id.tvUserInfo)
        logoutButton = findViewById(R.id.btnLogout)
        getUserInfoButton = findViewById(R.id.btnGetUserInfo)
        progressBar = findViewById(R.id.progressBar)

        sharedPref = getSharedPreferences("app_prefs", MODE_PRIVATE)

        // Check if user is logged in
        val isLoggedIn = sharedPref.getBoolean("isLoggedIn", false)
        val username = sharedPref.getString("username", "")

        if (!isLoggedIn) {
            navigateToLogin()
            return
        }

        welcomeText.text = "Welcome, $username!"

        // Set click listeners
        logoutButton.setOnClickListener {
            performLogout()
        }

        getUserInfoButton.setOnClickListener {
            getUserInfo()
        }
    }

    private fun getUserInfo() {
        showLoading(true)

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = RetrofitClient.instance.getCurrentUser()

                withContext(Dispatchers.Main) {
                    showLoading(false)

                    if (response.isSuccessful) {
                        val userInfo = response.body()
                        if (userInfo != null && userInfo.success == true) {
                            userInfoText.text = """
                                Username: ${userInfo.username}
                                Email: ${userInfo.email ?: "Not provided"}
                                Role: ${userInfo.role}
                            """.trimIndent()
                        } else {
                            userInfoText.text = "Failed to get user info"
                        }
                    } else {
                        userInfoText.text = "Error: ${response.code()}"
                    }
                }

            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    showLoading(false)
                    userInfoText.text = "Network error: ${e.message}"
                }
            }
        }
    }

    private fun performLogout() {
        showLoading(true)

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = RetrofitClient.instance.logout()

                withContext(Dispatchers.Main) {
                    showLoading(false)

                    // Clear local session
                    sharedPref.edit().clear().apply()

                    // Clear Retrofit auth token
                    RetrofitClient.clearAuthToken()

                    Toast.makeText(
                        this@MainActivity,
                        "Logged out successfully",
                        Toast.LENGTH_SHORT
                    ).show()

                    navigateToLogin()
                }

            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    showLoading(false)
                    Toast.makeText(
                        this@MainActivity,
                        "Logout error: ${e.message}",
                        Toast.LENGTH_SHORT
                    ).show()

                    // Still clear local session
                    sharedPref.edit().clear().apply()
                    RetrofitClient.clearAuthToken()
                    navigateToLogin()
                }
            }
        }
    }

    private fun navigateToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }

    private fun showLoading(show: Boolean) {
        progressBar.visibility = if (show) android.view.View.VISIBLE else android.view.View.GONE
        logoutButton.isEnabled = !show
        getUserInfoButton.isEnabled = !show
    }
}