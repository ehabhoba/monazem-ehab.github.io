const CLIENT_API_URL = 'http://localhost:3000/clients';

// تحميل العملاء
async function loadClients() {
  const response = await fetch(CLIENT_API_URL);
  const clients = await response.json();
  const clientList = document.getElementById('clientList');
  clientList.innerHTML = '';

  if (clients.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'لا توجد عملاء بعد.';
    li.className = 'text-gray-500';
    clientList.appendChild(li);
    return;
  }

  clients.forEach(client => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center p-3 border rounded shadow-sm';

    const info = document.createElement('div');
    info.innerHTML = `
      <p class="font-medium">${client.name}</p>
      <p class="text-sm text-gray-600">الهاتف: ${client.phone || '-'}</p>
      <p class="text-sm text-gray-600">البريد: ${client.email || '-'}</p>
      <p class="text-sm text-gray-600">ملاحظات: ${client.notes || '-'}</p>
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.className = 'text-red-500 hover:text-red-700 text-sm';

    deleteBtn.onclick = () => deleteClient(client.id);

    li.appendChild(info);
    li.appendChild(deleteBtn);
    clientList.appendChild(li);
  });
}

// إضافة عميل جديد
document.getElementById('clientForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newClient = {
    name: document.getElementById('clientName').value,
    phone: document.getElementById('clientPhone').value,
    email: document.getElementById('clientEmail').value,
    notes: document.getElementById('clientNotes').value
  };

  await fetch(CLIENT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newClient)
  });

  document.getElementById('clientForm').reset();
  loadClients();
});

// حذف عميل
async function deleteClient(id) {
  await fetch(`${CLIENT_API_URL}/${id}`, {
    method: 'DELETE'
  });
  loadClients();
}

// تشغيل التحميل الأولي
loadClients();