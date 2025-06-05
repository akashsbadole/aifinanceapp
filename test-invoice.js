const API_BASE = 'http://localhost:3002/api';

async function testInvoiceCreation() {
  console.log('🧪 Testing Invoice Creation with Auto-Generated Numbers...\n');

  try {
    // Test 1: Create invoice without invoice number (should auto-generate)
    console.log('1. Creating invoice without invoice number...');
    const response1 = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Auto Client 1',
        clientEmail: 'auto1@test.com',
        clientAddress: '123 Auto Street',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            description: 'Auto Service 1',
            quantity: 1,
            rate: 1000,
            amount: 1000,
          },
        ],
        taxRate: 18,
        discount: 0,
        notes: 'Auto-generated invoice test',
        terms: 'Payment due within 30 days',
      }),
    });

    if (response1.ok) {
      const invoice1 = await response1.json();
      console.log('✅ Invoice 1 created:', invoice1.invoiceNumber);
      console.log('   Total:', `₹${invoice1.total.toLocaleString()}`);
    } else {
      const error1 = await response1.text();
      console.log('❌ Failed to create invoice 1:', error1);
    }

    // Test 2: Create another invoice (should get next sequential number)
    console.log('\n2. Creating second invoice...');
    const response2 = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Auto Client 2',
        clientEmail: 'auto2@test.com',
        clientAddress: '456 Auto Avenue',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            description: 'Auto Service 2',
            quantity: 2,
            rate: 750,
            amount: 1500,
          },
        ],
        taxRate: 18,
        discount: 5,
        notes: 'Second auto-generated invoice',
        terms: 'Payment due within 30 days',
      }),
    });

    if (response2.ok) {
      const invoice2 = await response2.json();
      console.log('✅ Invoice 2 created:', invoice2.invoiceNumber);
      console.log('   Total:', `₹${invoice2.total.toLocaleString()}`);
    } else {
      const error2 = await response2.text();
      console.log('❌ Failed to create invoice 2:', error2);
    }

    // Test 3: Try to create invoice with existing number (should auto-generate new one)
    console.log('\n3. Creating invoice with duplicate number (should auto-generate)...');
    const response3 = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceNumber: 'INV-TEST-001', // This already exists
        clientName: 'Duplicate Test Client',
        clientEmail: 'duplicate@test.com',
        clientAddress: '789 Duplicate Street',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            description: 'Duplicate Test Service',
            quantity: 1,
            rate: 2000,
            amount: 2000,
          },
        ],
        taxRate: 18,
        discount: 0,
        notes: 'Testing duplicate number handling',
        terms: 'Payment due within 30 days',
      }),
    });

    if (response3.ok) {
      const invoice3 = await response3.json();
      console.log('✅ Invoice 3 created with new number:', invoice3.invoiceNumber);
      console.log('   Total:', `₹${invoice3.total.toLocaleString()}`);
    } else {
      const error3 = await response3.text();
      console.log('❌ Failed to create invoice 3:', error3);
    }

    // Test 4: Get all invoices to verify
    console.log('\n4. Fetching all invoices...');
    const listResponse = await fetch(`${API_BASE}/invoices`);
    if (listResponse.ok) {
      const invoices = await listResponse.json();
      console.log(`✅ Total invoices in database: ${invoices.length}`);
      invoices.forEach((inv, index) => {
        console.log(`   ${index + 1}. ${inv.invoiceNumber} - ${inv.clientName} - ₹${inv.total.toLocaleString()}`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n🎉 Invoice creation test completed!');
}

testInvoiceCreation();
