package com.example.mobile

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.mobile.network.RetrofitClient
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class DashboardActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "DashboardActivity"
    }

    private lateinit var tvWelcome: TextView
    private lateinit var tvUserInfo: TextView
    private lateinit var btnRefresh: Button
    private lateinit var btnLogout: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d(TAG, "onCreate called")

        setContentView(R.layout.activity_dashboard)
        Log.d(TAG, "Layout set successfully")

        // Initialize views
        tvWelcome = findViewById(R.id.tvWelcome)
        tvUserInfo = findViewById(R.id.tvUserInfo)
        btnRefresh = findViewById(R.id.btnRefresh)
        btnLogout = findViewById(R.id.btnLogout)

        Log.d(TAG, "Views initialized")

        // Load user info from SharedPreferences
        val sharedPref = getSharedPreferences("app_prefs", MODE_PRIVATE)
        val username = sharedPref.getString("username", "User")
        val email = sharedPref.getString("email", "Not provided")
        val role = sharedPref.getString("role", "User")

        Log.d(TAG, "Loaded user: $username, $email, $role")

        tvWelcome.text = "Welcome, $username!"
        tvUserInfo.text = """
            User Information:
            Username: $username
            Email: $email
            Role: $role
        """.trimIndent()

        // Set click listeners
        btnRefresh.setOnClickListener {
            Log.d(TAG, "Refresh button clicked")
            fetchUserInfo()
        }

        btnLogout.setOnClickListener {
            Log.d(TAG, "Logout button clicked")
            performLogout()
        }

        Log.d(TAG, "DashboardActivity setup complete")
        Toast.makeText(this, "Dashboard loaded!", Toast.LENGTH_SHORT).show()
    }

    private fun fetchUserInfo() {
        Log.d(TAG, "Fetching user info")
        Toast.makeText(this, "Fetching user info...", Toast.LENGTH_SHORT).show()

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = RetrofitClient.instance.getCurrentUser()
                Log.d(TAG, "Get user info response code: ${response.code()}")

                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        val userInfo = response.body()
                        if (userInfo != null && (userInfo.authenticated == true || userInfo.success == true)) {
                            Log.d(TAG, "User info retrieved: ${userInfo.username}")
                            tvUserInfo.text = """
                                User Information (from API):
                                Username: ${userInfo.username}
                                Email: ${userInfo.email ?: "Not provided"}
                                Role: ${userInfo.role}
                            """.trimIndent()
                            Toast.makeText(this@DashboardActivity, "User info updated!", Toast.LENGTH_SHORT).show()
                        } else {
                            Log.d(TAG, "User info failed: not authenticated")
                            Toast.makeText(this@DashboardActivity, "Failed to get user info", Toast.LENGTH_SHORT).show()
                        }
                    } else {
                        Log.d(TAG, "User info failed with code: ${response.code()}")
                        Toast.makeText(this@DashboardActivity, "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error fetching user info", e)
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@DashboardActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun performLogout() {
        Log.d(TAG, "Performing logout")

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = RetrofitClient.instance.logout()
                Log.d(TAG, "Logout response code: ${response.code()}")

                withContext(Dispatchers.Main) {
                    // Clear local session
                    val sharedPref = getSharedPreferences("app_prefs", MODE_PRIVATE)
                    sharedPref.edit().clear().apply()

                    // Clear Retrofit auth token
                    RetrofitClient.clearAuthToken()

                    Toast.makeText(this@DashboardActivity, "Logged out successfully", Toast.LENGTH_SHORT).show()
                    Log.d(TAG, "Session cleared, navigating to login")

                    // Navigate back to login
                    val intent = Intent(this@DashboardActivity, LoginActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Logout error", e)
                withContext(Dispatchers.Main) {
                    // Even if network fails, clear local session
                    val sharedPref = getSharedPreferences("app_prefs", MODE_PRIVATE)
                    sharedPref.edit().clear().apply()
                    RetrofitClient.clearAuthToken()

                    Toast.makeText(this@DashboardActivity, "Logged out", Toast.LENGTH_SHORT).show()

                    val intent = Intent(this@DashboardActivity, LoginActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
            }
        }
    }
}