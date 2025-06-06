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
      <p class="text-sm text-gray-600">النشاط: ${client.business || '-'}</p>
      <p class="text-sm text-gray-600">الهاتف: ${client.phone || '-'}</p>
      <p class="text-sm text-gray-600">التصنيف: ${client.type || '-'}</p>
    `;

    const actions = document.createElement('div');
    actions.className = 'flex space-x-2 space-x-reverse';

    const suggestBtn = document.createElement('button');
    suggestBtn.textContent = 'اقتراح خدمة';
    suggestBtn.className = 'text-blue-500 hover:text-blue-700 text-sm';
    suggestBtn.onclick = () => suggestService(client);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.className = 'text-red-500 hover:text-red-700 text-sm ml-2';
    deleteBtn.onclick = () => deleteClient(client.id);

    actions.appendChild(suggestBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(info);
    li.appendChild(actions);
    clientList.appendChild(li);
  });
}

// إضافة عميل جديد
document.getElementById('clientForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newClient = {
    name: document.getElementById('clientName').value,
    business: document.getElementById('clientBusiness').value,
    phone: document.getElementById('clientPhone').value,
    email: document.getElementById('clientEmail').value,
    type: document.getElementById('clientType').value
  };

  await fetch(CLIENT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newClient)
  });

  document.getElementById('clientForm').reset();
  document.getElementById('proposalSection').classList.add('hidden');
  loadClients();
});

// حذف عميل
async function deleteClient(id) {
  await fetch(`${CLIENT_API_URL}/${id}`, {
    method: 'DELETE'
  });
  loadClients();
}

// اقتراح خدمة بناءً على نوع العميل
function suggestService(client) {
  let proposalText = '';
  const section = document.getElementById('proposalSection');
  const textArea = document.getElementById('proposalText');

  switch (client.type) {
    case 'تصميم':
      proposalText = `مرحبًا ${client.name}،\n\nنود أن نقدم لك باقة تصميم شاملة:\n- شعار احترافي\n- بوستات سوشيال ميديا\n- كروت شخصية\n- غلاف فيسبوك/يوتيوب`;
      break;
    case 'تسويق':
      proposalText = `مرحبًا ${client.name}،\n\nباقة تسويقية مقترحة:\n- إدارة حملات إعلانية على فيسبوك وإنستجرام\n- تحسين محركات البحث (SEO)\n- تسويق عبر البريد الإلكتروني`;
      break;
    case 'متجر':
      proposalText = `مرحبًا ${client.name}،\n\nنوصي بباقة المتجر الإلكتروني:\n- إنشاء متجر احترافي\n- ربط بوابات الدفع والشحن\n- تسويق المنتجات`;
      break;
    default:
      proposalText = `مرحبًا ${client.name}،\n\nلقد قمت بإدخال بياناتك. يمكنك التواصل مباشرة لطلب الخدمة المناسبة.`;
  }

  textArea.textContent = proposalText;
  section.classList.remove('hidden');
}

// تصدير الاقتراح إلى PDF
function generatePDFProposal() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const proposalText = document.getElementById('proposalText').textContent;
  doc.setFontSize(14);
  doc.text(proposalText, 14, 20);
  doc.save("اقتراح_خدمة.pdf");
}

// إرسال الرسالة عبر واتساب
function sendWhatsAppMessage() {
  const proposalText = encodeURIComponent(document.getElementById('proposalText').textContent);
  const whatsappUrl = `https://wa.me/${document.getElementById('clientPhone').value}?text=${proposalText}`;
  window.open(whatsappUrl, '_blank');
}

// تشغيل التحميل الأولي
loadClients();