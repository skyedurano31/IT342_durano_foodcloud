package edu.cit.durano.foodcloud.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {

    private Long id;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private LocalDateTime paymentDate;

    @NotBlank(message = "Payment status is required")
    private String status;  // PENDING, COMPLETED, FAILED, REFUNDED

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;  // COD, GCASH, CARD

    private String transactionId;

    private Long orderId;

    // COD specific fields
    private Boolean codCollected;
    private String codCollectedBy;

    private String failureReason;

    // Constructors
    public PaymentDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Boolean getCodCollected() { return codCollected; }
    public void setCodCollected(Boolean codCollected) { this.codCollected = codCollected; }

    public String getCodCollectedBy() { return codCollectedBy; }
    public void setCodCollectedBy(String codCollectedBy) { this.codCollectedBy = codCollectedBy; }

    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }
}