// ui/screens/home/HomeScreen.kt
package com.example.mobile3.ui.screens.home

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalContext
import com.example.mobile3.data.models.Product
import com.example.mobile3.ui.components.FoodCard
import com.example.mobile3.viewmodel.ProductViewModel
import com.example.mobile3.viewmodel.CartViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    username: String,
    password: String,
    userId: Long,
    onProductClick: (Long) -> Unit,
    onCartClick: () -> Unit,
    onOrdersClick: () -> Unit,
    productViewModel: ProductViewModel,
    cartViewModel: CartViewModel
) {
    val products by productViewModel.products.collectAsState()
    val isLoading by productViewModel.isLoading.collectAsState()
    val errorMessage by productViewModel.errorMessage.collectAsState()

    // Show snackbar when item is added
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(Unit) {
        productViewModel.loadProducts(username, password)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("FoodCloud") },
                actions = {
                    IconButton(onClick = onCartClick) {
                        Badge(
                            containerColor = MaterialTheme.colorScheme.primary
                        ) {
                            // You can show cart count here
                        }
                        Icon(Icons.Default.ShoppingCart, contentDescription = "Cart")
                    }
                    IconButton(onClick = onOrdersClick) {
                        Icon(Icons.Default.List, contentDescription = "Orders")
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        when {
            isLoading -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues)
                ) {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }
            }
            errorMessage != null -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Error: $errorMessage", color = MaterialTheme.colorScheme.error)
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(onClick = {
                            productViewModel.loadProducts(username, password)
                        }) {
                            Text("Retry")
                        }
                    }
                }
            }
            products.isEmpty() -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No products available")
                }
            }
            else -> {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(products) { product ->
                        FoodCard(
                            product = product,
                            onProductClick = { onProductClick(product.id) },
                            onAddToCart = {
                                // Add product to cart
                                scope.launch {
                                    cartViewModel.addToCart(userId, product.id, 1)
                                    snackbarHostState.showSnackbar(
                                        message = "${product.name} added to cart",
                                        duration = SnackbarDuration.Short
                                    )
                                }
                            }
                        )
                    }
                }
            }
        }
    }
}