const CAMPAIGN_API_URL = 'http://localhost:3000/campaigns';

// تحميل الحملات
async function loadCampaigns() {
  const response = await fetch(CAMPAIGN_API_URL);
  const campaigns = await response.json();
  const campaignList = document.getElementById('campaignList');
  campaignList.innerHTML = '';

  if (campaigns.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'لا توجد حملات بعد.';
    li.className = 'text-gray-500';
    campaignList.appendChild(li);
    return;
  }

  campaigns.forEach(campaign => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center p-3 border rounded shadow-sm';

    const info = document.createElement('div');
    info.innerHTML = `
      <p class="font-medium">${campaign.platform} - ${campaign.objective}</p>
      <p class="text-sm text-gray-600">الجمهور: ${campaign.target || '-'}</p>
      <p class="text-sm text-gray-600">الميزانية: ${campaign.budget || '-'}</p>
      <p class="text-sm text-gray-600">الفترة: ${campaign.startDate} → ${campaign.endDate}</p>
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.className = 'text-red-500 hover:text-red-700 text-sm';

    deleteBtn.onclick = () => deleteCampaign(campaign.id);

    li.appendChild(info);
    li.appendChild(deleteBtn);
    campaignList.appendChild(li);
  });
}

// إضافة حملة جديدة
document.getElementById('campaignForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newCampaign = {
    platform: document.getElementById('campaignPlatform').value,
    objective: document.getElementById('campaignObjective').value,
    targetAudience: document.getElementById('campaignTarget').value,
    budget: document.getElementById('campaignBudget').value,
    startDate: document.getElementById('campaignStartDate').value,
    endDate: document.getElementById('campaignEndDate').value
  };

  await fetch(CAMPAIGN_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCampaign)
  });

  document.getElementById('campaignForm').reset();
  loadCampaigns();
});

// حذف حملة
async function deleteCampaign(id) {
  await fetch(`${CAMPAIGN_API_URL}/${id}`, {
    method: 'DELETE'
  });
  loadCampaigns();
}

// تشغيل التحميل الأولي
loadCampaigns();
document.getElementById('campaignForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const platform = document.getElementById('campaignPlatform').value;
    const budget = document.getElementById('campaignBudget').value || 'غير محدد';
    const audience = document.getElementById('targetAudience').value || 'الجمهور العام';
    const objective = document.getElementById('campaignObjective').value || 'زيادة التفاعل';
  
    let suggestion = '';
  
    // اقتراح الحملة بناءً على المنصة
    switch(platform) {
      case 'فيسبوك':
        suggestion = `📌 منصة: فيسبوك\n🎯 الهدف: ${objective}\n👥 الجمهور: ${audience}\n💰 الميزانية: ${budget} ريال\n\n✅ اقتراح الحملة:\n- إنشاء حملة إعلانية مستهدفة على فيسبوك.\n- استهداف الجمهور المناسب.\n- استخدام مقاطع فيديو قصيرة وجذابة.\n- تتبع الأداء وتحليل النتائج أسبوعياً.`;
        break;
  
      case 'إنستجرام':
        suggestion = `📌 منصة: إنستجرام\n🎯 الهدف: ${objective}\n👥 الجمهور: ${audience}\n💰 الميزانية: ${budget} ريال\n\n✅ اقتراح الحملة:\n- إنشاء بوستات جذابة ومقاطع Reels.\n- استخدام المؤثرين المحليين.\n- تحسين الاستهداف بناءً على السلوك.\n- ربط الحملة بالمتجر الإلكتروني.`;
        break;
  
      case 'تيك توك':
        suggestion = `📌 منصة: تيك توك\n🎯 الهدف: ${objective}\n👥 الجمهور: ${audience}\n💰 الميزانية: ${budget} ريال\n\n✅ اقتراح الحملة:\n- إنشاء تحديات جذابة وممولة.\n- التعاون مع مؤثرين على تيك توك.\n- محتوى سريع الانتشار ومحفز للتفاعل.\n- تحليل الأداء يومياً.`;
        break;
  
      case 'جوجل':
        suggestion = `📌 منصة: Google Ads\n🎯 الهدف: ${objective}\n👥 الجمهور: ${audience}\n💰 الميزانية: ${budget} ريال\n\n✅ اقتراح الحملة:\n- إنشاء حملة بحث جوجل.\n- استهداف الكلمات المفتاحية المناسبة.\n- إنشاء إعلانات نصية ومرئية.\n- تتبع النقرات والتحويلات.`;
        break;
  
      default:
        suggestion = 'يرجى إدخال بيانات الحملة لاقتراح خطة مناسبة.';
    }
  
    document.getElementById('campaignPreview').textContent = suggestion;
  });
  
  // إرسال الاقتراح للعميل عبر واتساب
  function sendCampaignProposal() {
    const campaignText = encodeURIComponent(document.getElementById('campaignPreview').textContent);
    const whatsappUrl = `https://wa.me/?text=${campaignText}`;
    window.open(whatsappUrl, '_blank');
  }