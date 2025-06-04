// Simple test script to verify API endpoints
const API_BASE = "http://localhost:3002/api";

async function testAPI() {
  console.log("🧪 Testing Finance App API...\n");

  try {
    // Test 1: Create a business profile
    console.log("1. Creating business profile...");
    const profileResponse = await fetch(`${API_BASE}/business-profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: "Test Company Ltd",
        companyAddress: "123 Test Street, Test City",
        gstin: "22AAAAA0000A1Z5",
        phone: "+91 9876543210",
        email: "test@company.com",
        isDefault: true,
      }),
    });

    if (profileResponse.ok) {
      const profile = await profileResponse.json();
      console.log("✅ Business profile created:", profile.companyName);
    } else {
      console.log("❌ Failed to create business profile");
    }

    // Test 2: Create a category for products
    console.log("\n2. Creating product category...");
    const categoryResponse = await fetch(`${API_BASE}/inventory/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Electronics",
        description: "Electronic devices and accessories",
      }),
    });

    let categoryId = null;
    if (categoryResponse.ok) {
      const category = await categoryResponse.json();
      categoryId = category.id;
      console.log("✅ Category created:", category.name);
    } else {
      console.log("❌ Failed to create category");
    }

    // Test 3: Create a product
    console.log("\n3. Creating product...");
    if (categoryId) {
      const productResponse = await fetch(`${API_BASE}/inventory/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Product",
          sku: "TEST-001",
          description: "A test product for API testing",
          categoryId: categoryId,
          purchasePrice: 100,
          sellingPrice: 150,
          stockQuantity: 50,
          minimumStock: 10,
          location: "Warehouse A",
        }),
      });

      if (productResponse.ok) {
        const product = await productResponse.json();
        console.log("✅ Product created:", product.name);
      } else {
        const error = await productResponse.text();
        console.log("❌ Failed to create product:", error);
      }
    }

    // Test 4: Create an invoice
    console.log("\n4. Creating invoice...");
    const invoiceResponse = await fetch(`${API_BASE}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceNumber: "INV-TEST-001",
        clientName: "Test Client",
        clientEmail: "client@test.com",
        clientAddress: "456 Client Street",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            description: "Web Development Services",
            quantity: 1,
            rate: 50000,
            amount: 50000,
          },
          {
            description: "SEO Optimization",
            quantity: 1,
            rate: 15000,
            amount: 15000,
          },
        ],
        taxRate: 18,
        discount: 5,
        notes: "Thank you for your business!",
        terms: "Payment due within 30 days",
      }),
    });

    if (invoiceResponse.ok) {
      const invoice = await invoiceResponse.json();
      console.log("✅ Invoice created:", invoice.invoiceNumber);
      console.log("   Total amount:", `₹${invoice.total.toLocaleString()}`);
    } else {
      console.log("❌ Failed to create invoice");
    }

    // Test 3: Get all invoices
    console.log("\n3. Fetching all invoices...");
    const allInvoicesResponse = await fetch(`${API_BASE}/invoices`);

    if (allInvoicesResponse.ok) {
      const data = await allInvoicesResponse.json();
      console.log(
        "✅ Invoices fetched:",
        data.invoices.length,
        "invoices found"
      );

      if (data.invoices.length > 0) {
        const firstInvoice = data.invoices[0];
        console.log(
          "   First invoice:",
          firstInvoice.invoiceNumber,
          "-",
          firstInvoice.clientName
        );
      }
    } else {
      console.log("❌ Failed to fetch invoices");
    }

    // Test 4: Get invoice statistics
    console.log("\n4. Fetching invoice statistics...");
    const statsResponse = await fetch(`${API_BASE}/invoices/stats`);

    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log("✅ Invoice stats:");
      console.log("   Total invoices:", stats.totalInvoices);
      console.log("   Total amount:", `₹${stats.totalAmount.toLocaleString()}`);
      console.log("   Paid amount:", `₹${stats.paidAmount.toLocaleString()}`);
      console.log(
        "   Pending amount:",
        `₹${stats.pendingAmount.toLocaleString()}`
      );
    } else {
      console.log("❌ Failed to fetch invoice stats");
    }

    // Test 5: Create a QR code
    console.log("\n5. Creating QR code...");
    const qrResponse = await fetch(`${API_BASE}/qr-codes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Company Contact",
        type: "contact",
        data: {
          name: "Test Company Ltd",
          phone: "+91 9876543210",
          email: "test@company.com",
          website: "https://testcompany.com",
        },
        qrCodeUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      }),
    });

    if (qrResponse.ok) {
      const qrCode = await qrResponse.json();
      console.log("✅ QR code created:", qrCode.name);
    } else {
      console.log("❌ Failed to create QR code");
    }

    // Test 6: Get all business profiles
    console.log("\n6. Fetching business profiles...");
    const profilesResponse = await fetch(`${API_BASE}/business-profiles`);

    if (profilesResponse.ok) {
      const profiles = await profilesResponse.json();
      console.log(
        "✅ Business profiles fetched:",
        profiles.length,
        "profiles found"
      );

      if (profiles.length > 0) {
        const defaultProfile = profiles.find((p) => p.isDefault);
        if (defaultProfile) {
          console.log("   Default profile:", defaultProfile.companyName);
        }
      }
    } else {
      console.log("❌ Failed to fetch business profiles");
    }

    console.log("\n🎉 API testing completed!");
  } catch (error) {
    console.error("❌ API test failed:", error.message);
  }
}

// Run the test
testAPI();
