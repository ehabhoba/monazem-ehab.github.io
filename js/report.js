// تحميل عدد المهام
fetch('http://localhost:3000/tasks')
  .then(res => res.json())
  .then(tasks => {
    document.getElementById("taskCount").textContent = tasks.length;
    drawTaskStatusChart(tasks);
  });

// تحميل عدد العملاء
fetch('http://localhost:3000/clients')
  .then(res => res.json())
  .then(clients => {
    document.getElementById("clientCount").textContent = clients.length;
  });

// تحميل عدد الفواتير غير المدفوعة
fetch('http://localhost:3000/invoices')
  .then(res => res.json())
  .then(invoices => {
    const unpaid = invoices.filter(inv => inv.status === 'غير مدفوع');
    document.getElementById("unpaidInvoices").textContent = unpaid.length;
  });

// تحميل بيانات المبيعات
function getMonthlySales() {
  // هذه البيانات يمكن استبدالها بالبيانات من الخادم لاحقاً
  return [1200, 1500, 1700, 1400, 1900, 2100];
}

// رسم مخطط حالة المهام
function drawTaskStatusChart(tasks) {
  const statusCounts = {
    "قيد التنفيذ": 0,
    "مكتملة": 0,
    "مؤجلة": 0
  };

  tasks.forEach(task => {
    if (statusCounts[task.status] !== undefined) {
      statusCounts[task.status]++;
    }
  });

  new Chart(document.getElementById('taskStatusChart'), {
    type: 'pie',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'حالة المهام',
        data: Object.values(statusCounts),
        backgroundColor: ['#f97316', '#10b981', '#ef4444']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: false }
      }
    }
  });
}

// رسم مخطط المبيعات الشهرية
function drawMonthlySalesChart(salesData) {
  const ctx = document.getElementById('monthlySalesChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر'],
      datasets: [{
        label: 'المبيعات الشهرية (ريال)',
        data: salesData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.parsed.y + ' ريال';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + ' ريال';
            }
          }
        }
      }
    }
  });
}

// عرض توقعات المبيعات
function predictNextMonthSales(salesData) {
  const avg = salesData.reduce((a, b) => a + b, 0) / salesData.length;
  const prediction = Math.round(avg * 1.1); // زيادة 10% تقديرية
  document.getElementById("predictedSales").textContent = prediction.toLocaleString();
}

// تشغيل الرسوم البيانية
const monthlySalesData = getMonthlySales(); // بيانات افتراضية
drawMonthlySalesChart(monthlySalesData);
predictNextMonthSales(monthlySalesData);