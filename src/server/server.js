const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// 设置默认的数据库路径
const DB_DIR = path.join(__dirname, 'dbs'); // 假设所有 db.json 文件放在 dbs 目录下

// 确保数据库目录存在
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

// 使用默认中间件
server.use(middlewares);

// 中间件：动态加载数据库
server.use((req, res, next) => {
  const dbName = req.query.db || 'default'; // 通过查询参数指定数据库名称，例如 ?db=db1,默认使用 default.json
  if (!dbName) {
    return res.status(400).json({
      status: 400,
      message: 'Missing db parameter',
      data: null
    });
  }

  const dbPath = path.join(DB_DIR, `${dbName}.json`);
  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({
      status: 404,
      message: 'Database not found',
      data: null
    });
  }

  // 动态加载数据库
  const router = jsonServer.router(dbPath);

  // 使用动态路由器
  req.router = router; // 将路由器存储到 req 对象中，供后续中间件使用
  next();
});

// 中间件：统一封装响应格式
server.use((req, res, next) => {
  // 保存原始的 res.send 方法
  const originalSend = res.send;

  res.send = (body) => {
    // 统一封装响应格式
    const formattedResponse = {
      status: 200,
      message: '请求成功',
      data: typeof body === 'string' ? JSON.parse(body) : body,
    };
    originalSend.call(res, JSON.stringify(formattedResponse));
  };

  next();
});

// 最后挂载路由器
server.use((req, res, next) => {
  if (req.router) {
    req.router(req, res, next); // 使用动态加载的路由器处理请求
  } else {
    next();
  }
});

// 启动服务
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});