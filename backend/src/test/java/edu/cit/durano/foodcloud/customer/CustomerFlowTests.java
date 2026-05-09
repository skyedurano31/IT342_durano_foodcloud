package edu.cit.durano.foodcloud.customer;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CustomerFlowTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    void testGetAllProducts() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void testGetProductById() throws Exception {
        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void testGetAllOrders() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void testGetOrderById() throws Exception {
        mockMvc.perform(get("/api/orders/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void testGetAllCategories() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void testApplicationContext() throws Exception {
        assert true;
    }
}