@extends('layouts.admin')

@section('title', 'Point of Sale')

@push('styles')
<style>
    .product-card {
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
    }
    .product-card:hover {
        border-color: var(--primary-color);
        transform: translateY(-2px);
    }
    .product-card.selected {
        border-color: var(--primary-color);
        background-color: #f0fff4;
    }
    .cart-item {
        border-bottom: 1px solid #eee;
        padding: 10px 0;
    }
    .cart-item:last-child {
        border-bottom: none;
    }
    .quantity-btn {
        width: 30px;
        height: 30px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
@endpush

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="page-title">Point of Sale</h1>
    <a href="{{ route('admin.pos.sales') }}" class="btn btn-outline-secondary">
        <i class="fas fa-history me-2"></i>Sales History
    </a>
</div>

<div class="row">
    <!-- Products/Services Selection -->
    <div class="col-lg-8">
        <!-- Tabs -->
        <ul class="nav nav-tabs mb-3" id="posTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="products-tab" data-bs-toggle="tab" data-bs-target="#products" type="button">
                    <i class="fas fa-box me-2"></i>Products
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="services-tab" data-bs-toggle="tab" data-bs-target="#services" type="button">
                    <i class="fas fa-concierge-bell me-2"></i>Services
                </button>
            </li>
        </ul>

        <div class="tab-content" id="posTabContent">
            <!-- Products Tab -->
            <div class="tab-pane fade show active" id="products" role="tabpanel">
                <div class="mb-3">
                    <input type="text" class="form-control" id="productSearch" placeholder="Search products...">
                </div>
                <div class="row g-3" id="productGrid">
                    @foreach($products as $product)
                        <div class="col-md-4 col-lg-3 product-item" data-name="{{ strtolower($product->name) }}">
                            <div class="card product-card h-100" 
                                 onclick="addToCart('product', {{ $product->id }}, '{{ $product->name }}', {{ $product->selling_price }}, {{ $product->stock_quantity }})">
                                <div class="card-body p-3 text-center">
                                    <i class="fas fa-box fa-2x text-muted mb-2"></i>
                                    <h6 class="card-title mb-1">{{ $product->name }}</h6>
                                    <p class="text-success fw-bold mb-1">₱{{ number_format($product->selling_price, 2) }}</p>
                                    <small class="text-muted">Stock: {{ $product->stock_quantity }}</small>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- Services Tab -->
            <div class="tab-pane fade" id="services" role="tabpanel">
                <div class="mb-3">
                    <input type="text" class="form-control" id="serviceSearch" placeholder="Search services...">
                </div>
                <div class="row g-3" id="serviceGrid">
                    @foreach($services as $service)
                        <div class="col-md-4 col-lg-3 service-item" data-name="{{ strtolower($service->name) }}">
                            <div class="card product-card h-100" 
                                 onclick="addToCart('service', {{ $service->id }}, '{{ $service->name }}', {{ $service->price }}, 999)">
                                <div class="card-body p-3 text-center">
                                    <i class="fas fa-stethoscope fa-2x text-success mb-2"></i>
                                    <h6 class="card-title mb-1">{{ $service->name }}</h6>
                                    <p class="text-success fw-bold mb-0">₱{{ number_format($service->price, 2) }}</p>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    <!-- Cart -->
    <div class="col-lg-4">
        <div class="card sticky-top" style="top: 20px;">
            <div class="card-header">
                <i class="fas fa-shopping-cart me-2"></i>Current Sale
            </div>
            <div class="card-body">
                <!-- Customer -->
                <div class="mb-3">
                    <label class="form-label">Customer</label>
                    <select id="customerId" class="form-select form-select-sm">
                        <option value="">Walk-in Customer</option>
                        @foreach($petOwners as $owner)
                            <option value="{{ $owner->id }}">{{ $owner->name }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="mb-3" id="walkInCustomerFields">
                    <input type="text" id="customerName" class="form-control form-control-sm mb-2" placeholder="Customer Name">
                    <input type="text" id="customerContact" class="form-control form-control-sm" placeholder="Contact Number">
                </div>

                <!-- Cart Items -->
                <div id="cartItems" class="mb-3" style="max-height: 250px; overflow-y: auto;">
                    <p class="text-muted text-center py-4">No items in cart</p>
                </div>

                <hr>

                <!-- Totals -->
                <div class="mb-2 d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <span id="subtotal">₱0.00</span>
                </div>
                <div class="mb-2 d-flex justify-content-between">
                    <span>Discount:</span>
                    <input type="number" id="discount" class="form-control form-control-sm w-50 text-end" value="0" min="0" onchange="calculateTotal()">
                </div>
                <div class="mb-3 d-flex justify-content-between fw-bold fs-5">
                    <span>Total:</span>
                    <span id="total" class="text-success">₱0.00</span>
                </div>

                <hr>

                <!-- Payment -->
                <div class="mb-3">
                    <label class="form-label">Payment Method</label>
                    <select id="paymentMethod" class="form-select form-select-sm">
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="gcash">GCash</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Amount Paid</label>
                    <input type="number" id="amountPaid" class="form-control" placeholder="0.00" min="0" step="0.01" onchange="calculateChange()">
                </div>
                <div class="mb-3 d-flex justify-content-between fw-bold">
                    <span>Change:</span>
                    <span id="change">₱0.00</span>
                </div>

                <button type="button" class="btn btn-success w-100" onclick="processSale()" id="processBtn" disabled>
                    <i class="fas fa-check me-2"></i>Complete Sale
                </button>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
let cart = [];

function addToCart(type, id, name, price, maxQty) {
    const existing = cart.find(item => item.type === type && item.id === id);
    
    if (existing) {
        if (existing.quantity < maxQty) {
            existing.quantity++;
        } else {
            alert('Maximum quantity reached');
            return;
        }
    } else {
        cart.push({
            type: type,
            id: id,
            name: name,
            price: parseFloat(price),
            quantity: 1,
            maxQty: maxQty,
            discount: 0
        });
    }
    
    renderCart();
}

function updateQuantity(index, change) {
    const item = cart[index];
    const newQty = item.quantity + change;
    
    if (newQty <= 0) {
        cart.splice(index, 1);
    } else if (newQty <= item.maxQty) {
        item.quantity = newQty;
    }
    
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">No items in cart</p>';
        document.getElementById('processBtn').disabled = true;
        calculateTotal();
        return;
    }
    
    let html = '';
    cart.forEach((item, index) => {
        html += `
            <div class="cart-item">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <strong>${item.name}</strong>
                        <br><small class="text-muted">₱${item.price.toFixed(2)} each</small>
                    </div>
                    <button class="btn btn-sm btn-link text-danger" onclick="removeItem(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="btn btn-outline-secondary quantity-btn">${item.quantity}</span>
                        <button class="btn btn-outline-secondary quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <strong>₱${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    document.getElementById('processBtn').disabled = false;
    calculateTotal();
}

function calculateTotal() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = parseFloat(document.getElementById('discount').value) || 0;
    let total = subtotal - discount;
    
    document.getElementById('subtotal').textContent = '₱' + subtotal.toFixed(2);
    document.getElementById('total').textContent = '₱' + total.toFixed(2);
    
    calculateChange();
}

function calculateChange() {
    let total = parseFloat(document.getElementById('total').textContent.replace('₱', '').replace(',', '')) || 0;
    let paid = parseFloat(document.getElementById('amountPaid').value) || 0;
    let change = Math.max(0, paid - total);
    
    document.getElementById('change').textContent = '₱' + change.toFixed(2);
}

function processSale() {
    if (cart.length === 0) {
        alert('Please add items to cart');
        return;
    }
    
    const total = parseFloat(document.getElementById('total').textContent.replace('₱', '').replace(',', ''));
    const paid = parseFloat(document.getElementById('amountPaid').value) || 0;
    
    if (paid < total) {
        alert('Insufficient payment amount');
        return;
    }
    
    const data = {
        user_id: document.getElementById('customerId').value || null,
        customer_name: document.getElementById('customerName').value,
        customer_contact: document.getElementById('customerContact').value,
        items: cart.map(item => ({
            type: item.type,
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount
        })),
        discount_amount: parseFloat(document.getElementById('discount').value) || 0,
        amount_paid: paid,
        payment_method: document.getElementById('paymentMethod').value,
        _token: '{{ csrf_token() }}'
    };
    
    fetch('{{ route("admin.pos.store") }}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Sale completed! Invoice: ' + result.invoice_number);
            cart = [];
            renderCart();
            document.getElementById('amountPaid').value = '';
            document.getElementById('discount').value = '0';
            // Optionally redirect to receipt
            // window.open('/admin/pos/receipt/' + result.sale.id, '_blank');
        } else {
            alert('Error: ' + result.message);
        }
    })
    .catch(error => {
        alert('Error processing sale');
        console.error(error);
    });
}

// Search functionality
document.getElementById('productSearch').addEventListener('input', function() {
    const search = this.value.toLowerCase();
    document.querySelectorAll('.product-item').forEach(item => {
        item.style.display = item.dataset.name.includes(search) ? '' : 'none';
    });
});

document.getElementById('serviceSearch').addEventListener('input', function() {
    const search = this.value.toLowerCase();
    document.querySelectorAll('.service-item').forEach(item => {
        item.style.display = item.dataset.name.includes(search) ? '' : 'none';
    });
});

// Customer selection
document.getElementById('customerId').addEventListener('change', function() {
    document.getElementById('walkInCustomerFields').style.display = this.value ? 'none' : 'block';
});
</script>
@endpush
@endsection
