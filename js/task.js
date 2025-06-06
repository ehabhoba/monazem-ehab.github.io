const API_URL = 'http://localhost:3000/tasks';

// تحميل المهام
async function loadTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'لا توجد مهام بعد.';
    li.className = 'text-gray-500';
    taskList.appendChild(li);
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center p-3 border rounded shadow-sm';

    const info = document.createElement('div');
    info.innerHTML = `
      <p class="font-medium">${task.title}</p>
      <p class="text-sm text-gray-600">الحالة: ${task.status} | مستحقة: ${task.dueDate || '-'}</p>
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'حذف';
    deleteBtn.className = 'text-red-500 hover:text-red-700 text-sm';

    deleteBtn.onclick = () => deleteTask(task.id);

    li.appendChild(info);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  checkDueTasks(tasks); // التحقق من المواعيد المستحقة
}

// إضافة مهمة جديدة
document.getElementById('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newTask = {
    title: document.getElementById('taskTitle').value,
    status: document.getElementById('taskStatus').value,
    dueDate: document.getElementById('taskDueDate').value
  };

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask)
  });

  document.getElementById('taskForm').reset();
  loadTasks();
});

// حذف مهمة
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  loadTasks();
}

// التنبيه بالمهام المستحقة
function checkDueTasks(tasks) {
  const today = new Date().toISOString().split('T')[0];

  tasks.forEach(task => {
    if (task.dueDate && task.dueDate <= today && task.status !== 'مكتملة') {
      alert(`⚠️ مهمة "${task.title}" مستحقة!`);
    }
  });
}

// تشغيل التحميل الأولي
loadTasks();