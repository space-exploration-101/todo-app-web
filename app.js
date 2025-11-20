// Todo App 主逻辑

class TodoApp {
    constructor() {
        this.todos = [];
        this.init();
    }

    init() {
        this.loadTodos();
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        const addBtn = document.getElementById('add-btn');
        const todoInput = document.getElementById('todo-input');
        const todoDate = document.getElementById('todo-date');

        addBtn.addEventListener('click', () => this.addTodo());
        
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    async addTodo() {
        const input = document.getElementById('todo-input');
        const dateInput = document.getElementById('todo-date');
        
        const text = input.value.trim();
        const dueDate = dateInput.value;

        if (!text) {
            alert('请输入待办事项内容');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            dueDate: dueDate || null,
            completed: false,
            createdAt: new Date().toISOString()
        };

        try {
            // 调用 API 添加 todo
            const savedTodo = await api.createTodo(newTodo);
            this.todos.push(savedTodo);
            this.saveTodos();
            this.render();
            
            // 清空输入框
            input.value = '';
            dateInput.value = '';
        } catch (error) {
            console.error('添加 todo 失败:', error);
            alert('添加失败，请稍后重试');
        }
    }

    async editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        const todoItem = document.querySelector(`[data-id="${id}"]`);
        if (!todoItem) return;

        todoItem.classList.add('editing');
        
        const contentDiv = todoItem.querySelector('.todo-content');
        const textDiv = todoItem.querySelector('.todo-text');
        const dateDiv = todoItem.querySelector('.todo-date-display');
        const actionsDiv = todoItem.querySelector('.todo-actions');

        const originalText = textDiv.textContent;
        const originalDate = todo.dueDate || '';

        // 创建编辑表单
        const editForm = document.createElement('div');
        editForm.className = 'todo-content';
        editForm.innerHTML = `
            <input type="text" class="edit-text-input" value="${originalText}" />
            <input type="date" class="edit-date-input" value="${originalDate}" />
        `;

        const editActions = document.createElement('div');
        editActions.className = 'todo-actions';
        editActions.innerHTML = `
            <button class="btn btn-save">保存</button>
            <button class="btn btn-cancel">取消</button>
        `;

        contentDiv.replaceWith(editForm);
        actionsDiv.replaceWith(editActions);

        // 绑定保存和取消事件
        const saveBtn = editForm.parentElement.querySelector('.btn-save');
        const cancelBtn = editForm.parentElement.querySelector('.btn-cancel');
        const textInput = editForm.querySelector('.edit-text-input');
        const dateInput = editForm.querySelector('.edit-date-input');

        saveBtn.addEventListener('click', async () => {
            const newText = textInput.value.trim();
            const newDate = dateInput.value || null;

            if (!newText) {
                alert('待办事项内容不能为空');
                return;
            }

            try {
                const updatedTodo = await api.updateTodo(id, {
                    text: newText,
                    dueDate: newDate
                });

                const index = this.todos.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.todos[index] = updatedTodo;
                    this.saveTodos();
                    this.render();
                }
            } catch (error) {
                console.error('更新 todo 失败:', error);
                alert('更新失败，请稍后重试');
            }
        });

        cancelBtn.addEventListener('click', () => {
            this.render();
        });
    }

    async deleteTodo(id) {
        if (!confirm('确定要删除这个待办事项吗？')) {
            return;
        }

        try {
            await api.deleteTodo(id);
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodos();
            this.render();
        } catch (error) {
            console.error('删除 todo 失败:', error);
            alert('删除失败，请稍后重试');
        }
    }

    async updateDueDate(id, newDate) {
        try {
            const updatedTodo = await api.updateTodo(id, {
                dueDate: newDate
            });

            const index = this.todos.findIndex(t => t.id === id);
            if (index !== -1) {
                this.todos[index] = updatedTodo;
                this.saveTodos();
                this.render();
            }
        } catch (error) {
            console.error('更新截止日期失败:', error);
            alert('更新失败，请稍后重试');
        }
    }

    render() {
        const todoList = document.getElementById('todo-list');
        
        if (this.todos.length === 0) {
            todoList.innerHTML = `
                <li class="empty-state">
                    <p>📋</p>
                    <p>还没有待办事项，添加一个吧！</p>
                </li>
            `;
            return;
        }

        todoList.innerHTML = this.todos.map(todo => {
            const dateClass = this.getDateClass(todo.dueDate);
            const dateDisplay = todo.dueDate 
                ? this.formatDate(todo.dueDate) 
                : '无截止日期';

            return `
                <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                    <div class="todo-content">
                        <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                        <div class="todo-date-display ${dateClass}">
                            📅 ${dateDisplay}
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button class="btn btn-edit" onclick="app.editTodo(${todo.id})">编辑</button>
                        <button class="btn btn-delete" onclick="app.deleteTodo(${todo.id})">删除</button>
                    </div>
                </li>
            `;
        }).join('');
    }

    getDateClass(dueDate) {
        if (!dueDate) return '';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        
        const diff = due - today;
        const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 0) return 'overdue';
        if (daysDiff === 0) return 'today';
        return '';
    }

    formatDate(dateString) {
        if (!dateString) return '无截止日期';
        
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const due = new Date(date);
        due.setHours(0, 0, 0, 0);
        
        const diff = due - today;
        const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 0) {
            return `已过期 ${Math.abs(daysDiff)} 天`;
        } else if (daysDiff === 0) {
            return '今天到期';
        } else if (daysDiff === 1) {
            return '明天到期';
        } else {
            return `${daysDiff} 天后到期`;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 使用 localStorage 暂存数据（模拟后端）
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const saved = localStorage.getItem('todos');
        if (saved) {
            this.todos = JSON.parse(saved);
        }
    }
}

// 初始化应用
const app = new TodoApp();

