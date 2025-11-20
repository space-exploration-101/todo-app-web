// API 接口文件
// 保留与后端交互的接口，暂时使用 localStorage 模拟

const API_BASE_URL = '/api'; // 后端 API 基础路径

const api = {
    /**
     * 获取所有 todos
     * @returns {Promise<Array>} todo 列表
     */
    async getAllTodos() {
        // TODO: 实现后端接口调用
        // return fetch(`${API_BASE_URL}/todos`).then(res => res.json());
        
        // 临时使用 localStorage
        const saved = localStorage.getItem('todos');
        return Promise.resolve(saved ? JSON.parse(saved) : []);
    },

    /**
     * 创建新的 todo
     * @param {Object} todo - todo 对象
     * @param {string} todo.text - todo 内容
     * @param {string|null} todo.dueDate - 截止日期 (YYYY-MM-DD)
     * @param {boolean} todo.completed - 是否完成
     * @returns {Promise<Object>} 创建的 todo 对象
     */
    async createTodo(todo) {
        // TODO: 实现后端接口调用
        // return fetch(`${API_BASE_URL}/todos`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(todo)
        // }).then(res => res.json());
        
        // 临时使用 localStorage
        const todos = await this.getAllTodos();
        const newTodo = {
            ...todo,
            id: todo.id || Date.now()
        };
        todos.push(newTodo);
        localStorage.setItem('todos', JSON.stringify(todos));
        return Promise.resolve(newTodo);
    },

    /**
     * 更新 todo
     * @param {number} id - todo ID
     * @param {Object} updates - 要更新的字段
     * @param {string} [updates.text] - todo 内容
     * @param {string|null} [updates.dueDate] - 截止日期
     * @param {boolean} [updates.completed] - 是否完成
     * @returns {Promise<Object>} 更新后的 todo 对象
     */
    async updateTodo(id, updates) {
        // TODO: 实现后端接口调用
        // return fetch(`${API_BASE_URL}/todos/${id}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(updates)
        // }).then(res => res.json());
        
        // 临时使用 localStorage
        const todos = await this.getAllTodos();
        const index = todos.findIndex(t => t.id === id);
        if (index === -1) {
            return Promise.reject(new Error('Todo not found'));
        }
        
        todos[index] = {
            ...todos[index],
            ...updates
        };
        localStorage.setItem('todos', JSON.stringify(todos));
        return Promise.resolve(todos[index]);
    },

    /**
     * 删除 todo
     * @param {number} id - todo ID
     * @returns {Promise<void>}
     */
    async deleteTodo(id) {
        // TODO: 实现后端接口调用
        // return fetch(`${API_BASE_URL}/todos/${id}`, {
        //     method: 'DELETE'
        // }).then(res => res.json());
        
        // 临时使用 localStorage
        const todos = await this.getAllTodos();
        const filtered = todos.filter(t => t.id !== id);
        localStorage.setItem('todos', JSON.stringify(filtered));
        return Promise.resolve();
    },

    /**
     * 根据 ID 获取单个 todo
     * @param {number} id - todo ID
     * @returns {Promise<Object>} todo 对象
     */
    async getTodoById(id) {
        // TODO: 实现后端接口调用
        // return fetch(`${API_BASE_URL}/todos/${id}`).then(res => res.json());
        
        // 临时使用 localStorage
        const todos = await this.getAllTodos();
        const todo = todos.find(t => t.id === id);
        if (!todo) {
            return Promise.reject(new Error('Todo not found'));
        }
        return Promise.resolve(todo);
    }
};

// 导出 API 对象供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}

