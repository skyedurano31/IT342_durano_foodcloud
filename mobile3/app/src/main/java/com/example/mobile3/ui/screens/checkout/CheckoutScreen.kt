// ui/screens/checkout/CheckoutScreen.kt
package com.example.mobile3.ui.screens.checkout

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.mobile3.viewmodel.OrderViewModel
import java.text.NumberFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CheckoutScreen(
    userId: Long,
    totalAmount: Double,
    orderViewModel: OrderViewModel,
    onOrderPlaced: () -> Unit,
    onBackToCart: () -> Unit
) {
    var building by remember { mutableStateOf("") }
    var roomNumber by remember { mutableStateOf("") }
    var phoneNumber by remember { mutableStateOf("") }
    var deliveryInstructions by remember { mutableStateOf("") }

    val isLoading by orderViewModel.isLoading.collectAsState()
    val checkoutResult by orderViewModel.checkoutResult.collectAsState()

    LaunchedEffect(checkoutResult) {
        if (checkoutResult != null) {
            onOrderPlaced()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Checkout",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        OutlinedTextField(
            value = building,
            onValueChange = { building = it },
            label = { Text("Building Name") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = roomNumber,
            onValueChange = { roomNumber = it },
            label = { Text("Room Number") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = phoneNumber,
            onValueChange = { phoneNumber = it },
            label = { Text("Phone Number") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = deliveryInstructions,
            onValueChange = { deliveryInstructions = it },
            label = { Text("Delivery Instructions (Optional)") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 2
        )

        Spacer(modifier = Modifier.height(24.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer
            )
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Total Amount:")
                Text(
                    formatPrice(totalAmount),
                    style = MaterialTheme.typography.titleLarge
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = onBackToCart,
                modifier = Modifier.weight(1f),
                enabled = !isLoading
            ) {
                Text("Back")
            }

            Button(
                onClick = {
                    orderViewModel.checkout(
                        userId, building, roomNumber,
                        deliveryInstructions, phoneNumber
                    )
                },
                modifier = Modifier.weight(1f),
                enabled = !isLoading && building.isNotBlank() &&
                        roomNumber.isNotBlank() && phoneNumber.isNotBlank()
            ) {
                if (isLoading) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp))
                } else {
                    Text("Place Order")
                }
            }
        }
    }
}

private fun formatPrice(price: Double): String {
    val format = NumberFormat.getCurrencyInstance(Locale("en", "PH"))
    return format.format(price)
}