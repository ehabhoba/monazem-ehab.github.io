const INVOICE_API_URL = 'http://localhost:3000/invoices';

// تحميل الفواتير
async function loadInvoices() {
  const response = await fetch(INVOICE_API_URL);
  const invoices = await response.json();
  const invoiceList = document.getElementById('invoiceList');
  invoiceList.innerHTML = '';

  if (invoices.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'لا توجد فواتير بعد.';
    li.className = 'text-gray-500';
    invoiceList.appendChild(li);
    return;
  }

  invoices.forEach(invoice => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center p-3 border rounded shadow-sm';

    const info = document.createElement('div');
    info.innerHTML = `
      <p class="font-medium">${invoice.clientName}</p>
      <p class="text-sm text-gray-600">المجموع: ${invoice.total} ريال</p>
      <p class="text-sm text-gray-600">التاريخ: ${invoice.date}</p>
      <p class="text-sm font-semibold ${invoice.status === 'مدفوع' ? 'text-green-600' : 'text-red-600'}">
        الحالة: ${invoice.status}
      </p>
    `;

    const actions = document.createElement('div');
    actions.className = 'flex space-x-2 space-x-reverse';

    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'تصدير PDF';
    exportBtn.className = 'text-blue-500 hover:text-blue-700 text-sm';
    exportBtn.onclick = () => exportInvoiceToPDF(invoice);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.className = 'text-red-500 hover:text-red-700 text-sm';
    deleteBtn.onclick = () => deleteInvoice(invoice.id);

    actions.appendChild(exportBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(info);
    li.appendChild(actions);
    invoiceList.appendChild(li);
  });

  // تنبيه بالفواتير غير المدفوعة
  const unpaid = invoices.filter(inv => inv.status === 'غير مدفوع');
  if (unpaid.length > 0) {
    let message = `⚠️ لديك ${unpaid.length} فاتورة غير مدفوعة:\n\n`;
    unpaid.forEach(inv => {
      message += `- ${inv.clientName} - ${inv.total} ريال\n`;
    });
    alert(message);
  }
}

// إضافة فاتورة جديدة
document.getElementById('invoiceForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newInvoice = {
    clientName: document.getElementById('clientName').value,
    total: document.getElementById('invoiceTotal').value,
    date: document.getElementById('invoiceDate').value,
    status: document.getElementById('invoiceStatus').value
  };

  await fetch(INVOICE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newInvoice)
  });

  document.getElementById('invoiceForm').reset();
  loadInvoices();
});

// حذف فاتورة
async function deleteInvoice(id) {
  await fetch(`${INVOICE_API_URL}/${id}`, {
    method: 'DELETE'
  });
  loadInvoices();
}

// تصدير الفاتورة إلى PDF
function exportInvoiceToPDF(invoice) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("فاتورة", 14, 20);

  doc.setFontSize(12);
  doc.text(`اسم العميل: ${invoice.clientName}`, 14, 30);
  doc.text(`المجموع: ${invoice.total} ريال`, 14, 40);
  doc.text(`التاريخ: ${invoice.date}`, 14, 50);
  doc.text(`الحالة: ${invoice.status}`, 14, 60);

  doc.save(`فاتورة_${invoice.id}.pdf`);
}

// تشغيل التحميل الأولي
loadInvoices();