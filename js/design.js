document.getElementById('designForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const designType = document.getElementById('designType').value;
    const clientName = document.getElementById('clientName').value || 'العميل';
    const businessName = document.getElementById('businessName').value || 'النشاط التجاري';
  
    let previewHTML = '';
    switch(designType) {
      case 'logo':
        previewHTML = `
          <div class="text-center">
            <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-blue-600 font-bold text-xl">LOGO</span>
            </div>
            <p class="text-sm text-gray-600">شعار احترافي لـ ${businessName}</p>
          </div>
        `;
        break;
  
      case 'social_post':
        previewHTML = `
          <div class="border border-gray-300 bg-white p-4 rounded max-w-xs mx-auto">
            <div class="bg-gray-200 h-40 rounded mb-3 flex items-center justify-center">
              <span class="text-gray-500 text-sm">صورة المنتج</span>
            </div>
            <h4 class="font-bold">${businessName}</h4>
            <p class="text-sm text-gray-700">✨ جديدنا الآن متاح! ✨<br/>
            اطلب الآن واستمتع بتجربة تسوق فريدة مع ${businessName}</p>
            <div class="mt-2 text-xs text-gray-500">#تسويق_إلكتروني #EhabGM</div>
          </div>
        `;
        break;
  
      case 'cover':
        previewHTML = `
          <div class="border border-gray-300 bg-white p-4 rounded w-full mx-auto">
            <div class="bg-blue-600 h-40 rounded-t flex items-center justify-center text-white text-xl font-bold">
              ${businessName}
            </div>
            <div class="bg-white p-4 rounded-b border-t border-gray-300">
              <p class="text-sm text-gray-700">✨ نقدم لك أفضل الحلول التسويقية والتصميمية</p>
            </div>
          </div>
        `;
        break;
  
      case 'business_card':
        previewHTML = `
          <div class="border border-gray-300 bg-white p-4 rounded w-64 h-40 mx-auto flex flex-col justify-center items-center text-center">
            <h4 class="font-bold text-lg">${businessName}</h4>
            <p class="text-sm text-gray-600 mt-1">مصمم جرافيك: إيهاب محمد</p>
            <p class="text-sm text-gray-600 mt-1">واتساب: +201022679250</p>
          </div>
        `;
        break;
  
      default:
        previewHTML = `<p class="text-gray-500">يرجى اختيار نوع التصميم</p>`;
    }
  
    document.getElementById('designPreview').innerHTML = previewHTML;
  });
  
  // تصدير التصميم كـ PNG (مثال باستخدام html2canvas)
  function exportToPNG() {
    const element = document.getElementById('designPreview');
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = 'تصميم_مخصص.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  }
  
  // إرسال التصميم للعميل (فكرة أولية)
  function sendToClient() {
    const proposalText = `مرحبًا ${document.getElementById('clientName').value},\n\nنود أن نشاركك باقة التصميم المقترحة:\n`;
    const designType = document.getElementById('designType').value;
    const businessName = document.getElementById('businessName').value;
  
    let details = '';
    switch(designType) {
      case 'logo':
        details = `- شعار احترافي لـ ${businessName}\n- مناسب للمطبوعات والمواقع الإلكترونية\n- صيغة PNG عالية الجودة`;
        break;
      case 'social_post':
        details = `- بوست إنستجرام لعرض منتجك\n- مناسب لزيادة التفاعل\n- تم إعداده بشكل احترافي`;
        break;
      case 'cover':
        details = `- غلاف فيسبوك لصفحتك\n- يعكس هوية نشاطك التجاري\n- متوافق مع جميع الأحجام`;
        break;
      case 'business_card':
        details = `- كارت شخصي احترافي لمكتبك\n- مثالي للاستخدام في المعارض أو الاجتماعات`;
        break;
    }
  
    const fullMessage = encodeURIComponent(proposalText + details + `\n\nمع تحيات,\nإيهاب جي إم | EhabGM`);
    const whatsappUrl = `https://wa.me/?text=${fullMessage}`;
    window.open(whatsappUrl, '_blank');
  }