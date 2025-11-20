# Todo App

一个简单的待办事项管理应用，支持添加、编辑、删除待办事项，以及设置截止日期。

## 功能特性

- ✅ 添加待办事项
- ✏️ 编辑待办事项内容
- 📅 设置和更改截止日期
- 🗑️ 删除待办事项
- 📱 响应式设计
- 💾 本地存储（临时方案）

## 技术栈

- 纯 HTML/CSS/JavaScript
- 无依赖，可直接在浏览器中运行

## 文件结构

```
todo-app-web/
├── index.html      # 主页面
├── style.css       # 样式文件
├── app.js          # 应用主逻辑
├── api.js          # API 接口文件（保留后端接口，暂时使用 localStorage）
└── README.md       # 说明文档
```

## 使用方法

1. 直接在浏览器中打开 `index.html` 文件
2. 或者使用本地服务器：
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (需要安装 http-server)
   npx http-server
   ```
3. 访问 `http://localhost:8000`

## API 接口说明

所有 API 接口定义在 `api.js` 文件中，目前使用 localStorage 模拟后端。

### 接口列表

- `getAllTodos()` - 获取所有待办事项
- `createTodo(todo)` - 创建新的待办事项
- `updateTodo(id, updates)` - 更新待办事项
- `deleteTodo(id)` - 删除待办事项
- `getTodoById(id)` - 根据 ID 获取待办事项

### 后端集成

当后端 API 准备好后，只需修改 `api.js` 文件中的接口实现，取消注释 fetch 调用，并注释掉 localStorage 相关代码。

后端 API 应该遵循以下规范：

- `GET /api/todos` - 获取所有待办事项
- `POST /api/todos` - 创建待办事项
- `PUT /api/todos/:id` - 更新待办事项
- `DELETE /api/todos/:id` - 删除待办事项
- `GET /api/todos/:id` - 获取单个待办事项

## Todo 数据结构

```javascript
{
    id: number,              // 唯一标识符
    text: string,            // 待办事项内容
    dueDate: string | null,   // 截止日期 (YYYY-MM-DD)
    completed: boolean,      // 是否完成
    createdAt: string        // 创建时间 (ISO 8601)
}
```

## 开发计划

- [ ] 完成后端 API 实现
- [ ] 添加完成/未完成状态切换
- [ ] 添加待办事项筛选功能
- [ ] 添加待办事项排序功能
- [ ] 添加数据持久化（后端数据库）

