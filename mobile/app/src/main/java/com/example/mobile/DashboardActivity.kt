package com.example.mobile

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.mobile.models.*
import com.example.mobile.network.RetrofitClient
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.*

class DashboardActivity : AppCompatActivity() {

    // UI Elements
    private lateinit var statusIndicator: View
    private lateinit var tvStatus: TextView
    private lateinit var tvServerInfo: TextView
    private lateinit var tvUserInfo: TextView
    private lateinit var tvResponseLog: TextView
    private lateinit var progressBar: ProgressBar

    // Buttons
    private lateinit var btnTestConnection: Button
    private lateinit var btnGetUserInfo: Button
    private lateinit var btnTestLogin: Button
    private lateinit var btnTestRegister: Button
    private lateinit var btnTestLogout: Button
    private lateinit var btnClearLog: Button

    // Test credentials
    private val testUsername = "testuser_${System.currentTimeMillis()}"
    private val testPassword = "test123"
    private val testEmail = "test${System.currentTimeMillis()}@example.com"

    private var isLoggedIn = false
    private var currentUser: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        initViews()
        setupClickListeners()
        addLog("Dashboard initialized", "INFO")
        addLog("Test credentials: $testUsername / $testPassword", "INFO")
    }

    private fun initViews() {
        statusIndicator = findViewById(R.id.statusIndicator)
        tvStatus = findViewById(R.id.tvStatus)
        tvServerInfo = findViewById(R.id.tvServerInfo)
        tvUserInfo = findViewById(R.id.tvUserInfo)
        tvResponseLog = findViewById(R.id.tvResponseLog)
        progressBar = findViewById(R.id.progressBar)

        btnTestConnection = findViewById(R.id.btnTestConnection)
        btnGetUserInfo = findViewById(R.id.btnGetUserInfo)
        btnTestLogin = findViewById(R.id.btnTestLogin)
        btnTestRegister = findViewById(R.id.btnTestRegister)
        btnTestLogout = findViewById(R.id.btnTestLogout)
        btnClearLog = findViewById(R.id.btnClearLog)
    }

    private fun setupClickListeners() {
        btnTestConnection.setOnClickListener { testConnection() }
        btnGetUserInfo.setOnClickListener { getUserInfo() }
        btnTestLogin.setOnClickListener { testLogin() }
        btnTestRegister.setOnClickListener { testRegister() }
        btnTestLogout.setOnClickListener { testLogout() }
        btnClearLog.setOnClickListener { clearLog() }
    }

    // Test 1: Connection Test
    private fun testConnection() {
        addLog("Testing connection to Spring Boot...", "INFO")
        showLoading(true)

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                // Try to ping the server (add this endpoint to your Spring Boot if needed)
                val response = RetrofitClient.instance.login(
                    LoginRequestDTO("test", "test")
                )

                withContext(Dispatchers.Main) {
                    showLoading(false)
                    if (response.isSuccessful || response.code() == 401) {
                        // Server responded (even with 401 means connection works)
                        updateConnectionStatus(true)
                        addLog("✓ Connection successful! Server is reachable.", "SUCCESS")
                        tvServerInfo.text = "Server: ${RetrofitClient.getBaseUrl()} - Online"
                    } else {
                        updateConnectionStatus(false)
                        addLog("✗ Connection failed. Server returned: ${response.code()}", "ERROR")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    showLoading(false)
                    updateConnectionStatus(false)
                    addLog("✗ Connection error: ${e.message}", "ERROR")
                    tvServerInfo.text = "Server: Not reachable - ${e.message}"
                }
            }
        }
    }

    // Test 2: Register API
    private fun testRegister() {
        addLog("Testing Registration API...", "INFO")
        addLog("Username: $testUsername", "INFO")
        addLog("Email: $testEmail", "INFO")
        showLoading(true)

        val user = User(
            username = testUsername,
            password_hash = testPassword,
            email = testEmail
        )

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = RetrofitClient.instance.register(user)

                withContext(Dispatchers.Main) {
                    showLoading(false)

                    if (response.isSuccessful) {
                        val result = response.body()
                        if (result != null && result.success == true) {
                            addLog("✓ REGISTER SUCCESSFUL!", "SUCCESS")
                            addLog("  Message: ${result.message}", "SUCCESS")
                            addLog("  Username: ${result.username}", "SUCCESS")
                            addLog("  Role: ${result.role}", "SUCCESS")
                            tvUserInfo.text = "✓ Registered successfully!\nUsername: $testUsername\nEmail: $testEmail"
                            Toast.makeText(this@DashboardActivity, "Registration successful!", Toast.LENGTH_SHORT).show()
                        } else {
                            addLog("✗ Registration failed: ${result?.message}", "ERROR")
                        }
                    } else {
                        val errorMsg = response.errorBody()?.string() ?: "Unknown error"
                        addLog("✗ Registration failed with code: ${response.code()}", "ERROR")
                        addLog("  Error: $errorMsg", "ERROR")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    showLoading(false)
                    addLog("✗ Registration exception: ${e.message}", "ERROR")
                }
            }
        }
    }

    // Test 3: Login API
    private fun testLogin() {
        addLog("Testing Login API...", "INFO")
        addLog("Credentials: $testUsername / $testPassword", "INFO")
        showLoading(true)

        // Set Basic Auth credentials
        RetrofitClient.setAuthToken(testUsername, testPassword)

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = RetrofitClient.instance.login(
                    LoginRequestDTO(testUsername, testPassword)
                )

                withContext(Dispatchers.Main) {
                    showLoading(false)

                    if (response.isSuccessful) {
                        val result = response.body()
                        if (result != null && result.success == true) {
                            isLoggedIn = true
                            currentUser = result.username
                            addLog("✓ LOGIN SUCCESSFUL!", "SUCCESS")
                            addLog("  Welcome: ${result.username}", "SUCCESS")
                            addLog("  Email: ${result.email}", "SUCCESS")
                            addLog("  Role: ${result.role}", "SUCCESS")
                            tvUserInfo.text = "✓ Logged in as: ${result.username}\nRole: ${result.role}\nEmail: ${result.email}"
                            Toast.makeText(this@DashboardActivity, "Login successful!", Toast.LENGTH_SHORT).show()

                            // Enable authenticated endpoints
                            btnGetUserInfo.isEnabled = true
                            btnTestLogout.isEnabled = true
                        } else {
                            addLog("✗ Login failed: ${result?.message}", "ERROR")
                        }
                    } else {
                        addLog("✗ Login failed with code: ${response.code()}", "ERROR")
                        addLog("  Check credentials or user registration", "ERROR")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    showLoading(false)
                    addLog("✗ Login exception: ${e.message}", "ERROR")
                }
            }
        }
    }

    // Test 4: Get Current User Info
    private fun getUserInfo() {
        addLog("Getting current user info...", "INFO")
        showLoading(true)

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = RetrofitClient.instance.getCurrentUser()

                withContext(Dispatchers.Main) {
                    showLoading(false)

                    if (response.isSuccessful) {
                        val userInfo = response.body()
                        if (userInfo != null && userInfo.success == true) {
                            addLog("✓ USER INFO RETRIEVED", "SUCCESS")
                            addLog("  Username: ${userInfo.username}", "SUCCESS")
                            addLog("  Email: ${userInfo.email}", "SUCCESS")
                            addLog("  Role: ${userInfo.role}", "SUCCESS")
                            tvUserInfo.text = """
                                ✓ Authenticated User:
                                Username: ${userInfo.username}
                                Email: ${userInfo.email ?: "Not provided"}
                                Role: ${userInfo.role}
                            """.trimIndent()
                        } else {
                            addLog("✗ Failed to get user info: ${userInfo?.message}", "ERROR")
                        }
                    } else {
                        addLog("✗ Get user info failed with code: ${response.code()}", "ERROR")
                        addLog("  You may need to login first", "WARNING")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    showLoading(false)
                    addLog("✗ Exception: ${e.message}", "ERROR")
                }
            }
        }
    }

    // Test 5: Logout
    private fun testLogout() {
        addLog("Testing Logout API...", "INFO")
        showLoading(true)

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = RetrofitClient.instance.logout()

                withContext(Dispatchers.Main) {
                    showLoading(false)

                    if (response.isSuccessful) {
                        val result = response.body()
                        addLog("✓ LOGOUT SUCCESSFUL!", "SUCCESS")
                        addLog("  ${result?.message}", "SUCCESS")
                        isLoggedIn = false
                        currentUser = null
                        RetrofitClient.clearAuthToken()
                        tvUserInfo.text = "Logged out successfully"
                        Toast.makeText(this@DashboardActivity, "Logged out!", Toast.LENGTH_SHORT).show()
                    } else {
                        addLog("✗ Logout failed with code: ${response.code()}", "ERROR")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    showLoading(false)
                    addLog("✗ Logout exception: ${e.message}", "ERROR")
                }
            }
        }
    }

    private fun updateConnectionStatus(connected: Boolean) {
        if (connected) {
            statusIndicator.setBackgroundResource(R.drawable.status_indicator_green)
            tvStatus.text = "Connected to Spring Boot"
            tvStatus.setTextColor(getColor(android.R.color.holo_green_dark))
        } else {
            statusIndicator.setBackgroundResource(R.drawable.status_indicator_red)
            tvStatus.text = "Not connected"
            tvStatus.setTextColor(getColor(android.R.color.holo_red_dark))
        }
    }

    private fun addLog(message: String, type: String) {
        val timestamp = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
        val emoji = when (type) {
            "SUCCESS" -> "✅"
            "ERROR" -> "❌"
            "WARNING" -> "⚠️"
            else -> "📝"
        }

        val logEntry = "$timestamp $emoji $message\n"

        runOnUiThread {
            val currentLog = tvResponseLog.text.toString()
            tvResponseLog.text = logEntry + currentLog
        }
    }

    private fun clearLog() {
        tvResponseLog.text = "Log cleared at ${SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())}\n"
        addLog("Log cleared", "INFO")
    }

    private fun showLoading(show: Boolean) {
        progressBar.visibility = if (show) android.view.View.VISIBLE else android.view.View.GONE

        // Disable buttons while loading
        val buttons = listOf(
            btnTestConnection, btnTestRegister, btnTestLogin,
            btnGetUserInfo, btnTestLogout
        )
        buttons.forEach { it.isEnabled = !show }
    }
}