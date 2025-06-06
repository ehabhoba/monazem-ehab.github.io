const PRODUCT_API_URL = 'http://localhost:3000/products';

// تحميل المنتجات
async function loadProducts() {
  const response = await fetch(PRODUCT_API_URL);
  const products = await response.json();
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  if (products.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'لا توجد منتجات بعد.';
    li.className = 'text-gray-500';
    productList.appendChild(li);
    return;
  }

  products.forEach(product => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center p-3 border rounded shadow-sm';

    const info = document.createElement('div');
    info.innerHTML = `
      <p class="font-medium">${product.name}</p>
      <p class="text-sm text-gray-600">السعر: ${product.price || '-'} ريال</p>
      <p class="text-sm text-gray-600">الكمية: ${product.stock || '-'}</p>
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.className = 'text-red-500 hover:text-red-700 text-sm';

    deleteBtn.onclick = () => deleteProduct(product.id);

    li.appendChild(info);
    li.appendChild(deleteBtn);
    productList.appendChild(li);

    // تنبيه عند نفاد الكمية
    if (product.stock <= 5 && product.stock > 0) {
      alert(`⚠️ الكمية قليلة جداً! (${product.name})`);
    } else if (product.stock === 0) {
      alert(`🔴 نفذت الكمية! (${product.name})`);
    }
  });
}

// إضافة منتج جديد
document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newProduct = {
    name: document.getElementById('productName').value,
    price: document.getElementById('productPrice').value,
    stock: document.getElementById('productStock').value,
    category: document.getElementById('productCategory').value
  };

  await fetch(PRODUCT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct)
  });

  document.getElementById('productForm').reset();
  loadProducts();
});

// حذف منتج
async function deleteProduct(id) {
  await fetch(`${PRODUCT_API_URL}/${id}`, {
    method: 'DELETE'
  });
  loadProducts();
}

// تشغيل التحميل الأولي
loadProducts();