// بيانات أولية (في البداية سنستخدم بيانات ثابتة، ثم ننتقل لقاعدة بيانات لاحقاً)
const tasks = [
    { title: "تصميم شعار لشركة XYZ", dueDate: "2025-04-20" },
    { title: "تعديل بوست إنستجرام", dueDate: "2025-04-18" },
  ];
  
  const clients = [
    { name: "شركة ABC", lastContact: "2025-04-15" },
    { name: "مؤسسة DEF", lastContact: "2025-04-14" }
  ];
  
  // عرض عدد المهام
  document.getElementById("taskCount").textContent = tasks.length;
  
  // عرض عدد العملاء
  document.getElementById("clientCount").textContent = clients.length;
  
  // عرض المهام المستحقة خلال 3 أيام
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  const dueTasksList = document.getElementById("dueTasks");
  dueTasksList.innerHTML = "";
  
  tasks.forEach(task => {
    const taskDate = new Date(task.dueDate);
    if (taskDate <= threeDaysFromNow && taskDate >= today) {
      const li = document.createElement("li");
      li.textContent = `⚠️ ${task.title} - مستحقة في ${task.dueDate}`;
      dueTasksList.appendChild(li);
    }
  });
  
  if (dueTasksList.children.length === 0) {
    const li = document.createElement("li");
    li.textContent = "⚠️ لا توجد مهام مستحقة حالياً";
    dueTasksList.appendChild(li);
  }
  // عرض عدد الفواتير غير المدفوعة
fetch('http://localhost:3000/invoices')
.then(res => res.json())
.then(invoices => {
  const unpaid = invoices.filter(inv => inv.status === 'غير مدفوع');
  document.getElementById("unpaidInvoices").textContent = unpaid.length;
});