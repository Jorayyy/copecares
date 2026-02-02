<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Service;
use App\Models\User;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class POSController extends Controller
{
    public function index()
    {
        $products = Product::active()->inStock()->with('category')->get();
        $services = Service::active()->with('petCategories')->get();
        $petOwners = User::petOwners()->active()->get();

        return view('admin.pos.index', compact('products', 'services', 'petOwners'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'customer_name' => 'nullable|string|max:255',
            'customer_contact' => 'nullable|string|max:50',
            'items' => 'required|array|min:1',
            'items.*.type' => 'required|in:product,service',
            'items.*.id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.discount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,gcash,other',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            // Calculate totals
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $itemTotal = ($item['price'] * $item['quantity']) - ($item['discount'] ?? 0);
                $subtotal += $itemTotal;
            }

            $taxAmount = $validated['tax_amount'] ?? 0;
            $discountAmount = $validated['discount_amount'] ?? 0;
            $totalAmount = $subtotal + $taxAmount - $discountAmount;
            $changeAmount = max(0, $validated['amount_paid'] - $totalAmount);

            // Create sale
            $sale = Sale::create([
                'user_id' => $validated['user_id'],
                'cashier_id' => auth()->id(),
                'appointment_id' => $validated['appointment_id'],
                'customer_name' => $validated['customer_name'],
                'customer_contact' => $validated['customer_contact'],
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'amount_paid' => $validated['amount_paid'],
                'change_amount' => $changeAmount,
                'payment_method' => $validated['payment_method'],
                'status' => 'completed',
                'notes' => $validated['notes'],
            ]);

            // Create sale items and update stock
            foreach ($validated['items'] as $item) {
                $itemName = '';
                $productId = null;
                $serviceId = null;

                if ($item['type'] === 'product') {
                    $product = Product::find($item['id']);
                    $itemName = $product->name;
                    $productId = $product->id;
                    
                    // Decrease stock
                    $product->decrementStock($item['quantity']);
                } else {
                    $service = Service::find($item['id']);
                    $itemName = $service->name;
                    $serviceId = $service->id;
                }

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'item_type' => $item['type'],
                    'product_id' => $productId,
                    'service_id' => $serviceId,
                    'item_name' => $itemName,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'discount' => $item['discount'] ?? 0,
                    'total_price' => ($item['price'] * $item['quantity']) - ($item['discount'] ?? 0),
                ]);
            }

            // Update appointment status if linked
            if ($validated['appointment_id']) {
                Appointment::where('id', $validated['appointment_id'])
                    ->update(['status' => 'completed']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Sale completed successfully!',
                'sale' => $sale->load('items'),
                'invoice_number' => $sale->invoice_number,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error processing sale: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function receipt(Sale $sale)
    {
        $sale->load(['items', 'customer', 'cashier', 'appointment']);
        return view('admin.pos.receipt', compact('sale'));
    }

    public function sales(Request $request)
    {
        $query = Sale::with(['customer', 'cashier', 'items']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%");
            });
        }

        $sales = $query->latest()->paginate(15);

        $todayTotal = Sale::today()->completed()->sum('total_amount');
        $monthTotal = Sale::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->completed()
            ->sum('total_amount');

        return view('admin.pos.sales', compact('sales', 'todayTotal', 'monthTotal'));
    }

    public function showSale(Sale $sale)
    {
        $sale->load(['items', 'customer', 'cashier', 'appointment']);
        return view('admin.pos.show', compact('sale'));
    }
}
