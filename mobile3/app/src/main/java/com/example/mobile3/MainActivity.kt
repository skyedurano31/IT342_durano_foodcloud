package com.example.mobile3

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.mobile3.ui.screens.auth.LoginScreen
import com.example.mobile3.ui.screens.auth.RegisterScreen
import com.example.mobile3.ui.screens.cart.CartScreen
import com.example.mobile3.ui.screens.checkout.CheckoutScreen
import com.example.mobile3.ui.screens.home.HomeScreen
import com.example.mobile3.ui.screens.orders.OrdersScreen
import com.example.mobile3.ui.theme.Mobile3Theme
import com.example.mobile3.utils.SessionManager
import com.example.mobile3.viewmodel.*
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Mobile3Theme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    FoodCloudApp()
                }
            }
        }
    }
}

@Composable
fun FoodCloudApp() {
    val context = androidx.compose.ui.platform.LocalContext.current
    val sessionManager = SessionManager(context)

    var isLoggedIn by remember { mutableStateOf(false) }
    var userId by remember { mutableStateOf<Long?>(null) }
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(true) }

    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        isLoggedIn = sessionManager.isLoggedIn().firstOrNull() ?: false
        userId = sessionManager.getUserId().firstOrNull()
        username = sessionManager.getUserName().firstOrNull() ?: ""
        password = sessionManager.getPassword().firstOrNull() ?: ""
        isLoading = false
    }

    val navController = rememberNavController()

    if (isLoading) {
        CircularProgressIndicator(modifier = Modifier.fillMaxSize())
    } else {
        NavHost(
            navController = navController,
            startDestination = if (isLoggedIn) "home" else "login"
        ) {
            composable("login") {
                val authViewModel: AuthViewModel = viewModel(
                    factory = AuthViewModelFactory(context)
                )
                LoginScreen(
                    onLoginSuccess = { loggedInUserId, userUsername, userPassword ->
                        scope.launch {
                            sessionManager.saveUserSession(loggedInUserId, userUsername, userPassword, null, "USER")
                        }
                        userId = loggedInUserId
                        username = userUsername
                        password = userPassword
                        isLoggedIn = true
                        navController.navigate("home") {
                            popUpTo("login") { inclusive = true }
                        }
                    },
                    onNavigateToRegister = {
                        navController.navigate("register")
                    },
                    authViewModel = authViewModel
                )
            }

            composable("register") {
                val authViewModel: AuthViewModel = viewModel(
                    factory = AuthViewModelFactory(context)
                )
                RegisterScreen(
                    onRegisterSuccess = {
                        navController.popBackStack()
                    },
                    onNavigateToLogin = {
                        navController.popBackStack()
                    },
                    authViewModel = authViewModel
                )
            }

            composable("home") {
                // Create ViewModels directly with parameters (not using viewModel())
                val productViewModel = remember(username, password) {
                    ProductViewModel(context).also { it.loadProducts(username, password) }
                }

                val cartViewModel = remember(username, password) {
                    CartViewModel(username, password)
                }

                HomeScreen(
                    username = username,
                    password = password,
                    userId = userId ?: 0,
                    onProductClick = { },
                    onCartClick = { navController.navigate("cart") },
                    onOrdersClick = { navController.navigate("orders") },
                    productViewModel = productViewModel,
                    cartViewModel = cartViewModel
                )
            }

            composable("cart") {
                val cartViewModel = remember(username, password) {
                    CartViewModel(username, password)
                }

                LaunchedEffect(userId) {
                    userId?.let { cartViewModel.loadCart(it) }
                }

                CartScreen(
                    userId = userId ?: 0,
                    cartViewModel = cartViewModel,
                    onCheckoutClick = { navController.navigate("checkout") },
                    onContinueShopping = { navController.popBackStack() }
                )
            }

            composable("checkout") {
                val cartViewModel = remember(username, password) {
                    CartViewModel(username, password)
                }
                val orderViewModel = remember(username, password) {
                    OrderViewModel(username, password)
                }
                val cartState by cartViewModel.cart.collectAsState()

                LaunchedEffect(Unit) {
                    userId?.let { cartViewModel.loadCart(it) }
                }

                CheckoutScreen(
                    userId = userId ?: 0,
                    totalAmount = cartState?.totalAmount ?: 0.0,
                    orderViewModel = orderViewModel,
                    onOrderPlaced = {
                        orderViewModel.clearCheckoutResult()
                        userId?.let { cartViewModel.loadCart(it) }
                        navController.navigate("orders") {
                            popUpTo("cart") { inclusive = true }
                        }
                    },
                    onBackToCart = { navController.popBackStack() }
                )
            }

            composable("orders") {
                val orderViewModel = remember(username, password) {
                    OrderViewModel(username, password)
                }
                val ordersState by orderViewModel.orders.collectAsState()
                val isLoadingState by orderViewModel.isLoading.collectAsState()

                LaunchedEffect(userId) {
                    userId?.let { orderViewModel.loadUserOrders(it) }
                }

                OrdersScreen(
                    orders = ordersState,
                    isLoading = isLoadingState
                )
            }
        }
    }
}

class AuthViewModelFactory(private val context: android.content.Context) :
    androidx.lifecycle.ViewModelProvider.Factory {
    override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AuthViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return AuthViewModel(context) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}