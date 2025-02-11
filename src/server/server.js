const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

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

// 添加 body-parser 中间件
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// 获取所有数据库的接口
server.get('/databases', (req, res) => {
  const dbListPath = path.join(__dirname, 'databases.json');

  if (!fs.existsSync(dbListPath)) {
    return res.status(404).json({
      status: 404,
      message: 'Databases list file not found',
      data: null
    });
  }

  try {
    const dbListContent = fs.readFileSync(dbListPath, 'utf8');
    const databases = JSON.parse(dbListContent).databases;

    res.json({
      status: 200,
      message: 'Databases retrieved successfully',
      data: {
        databases: databases.map(db => ({
          name: db.name,
          alias: db.alias || db.name, // 如果 alias 不存在，使用 name 作为默认值
          created_at: db.created_at,
          updated_at: db.updated_at
        }))
      }
    });
  } catch (error) {
    console.error('Error retrieving databases:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
});

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

// 动态新增表的接口
server.post('/addTable', (req, res) => {
  const { tableName, data } = req.body;

  // 获取当前使用的数据库名称
  const dbName = req.query.db || 'default';
  const dbPath = path.join(DB_DIR, `${dbName}.json`);

  // 检查数据库文件是否存在
  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({
      status: 404,
      message: 'Database not found',
      data: null
    });
  }

  try {
    // 读取当前数据库内容
    const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // 检查表是否已经存在
    if (dbContent[tableName]) {
      return res.status(400).json({
        status: 400,
        message: 'Table already exists',
        data: null
      });
    }

    // 添加新表
    dbContent[tableName] = data;

    // 将更新后的内容写回数据库文件
    fs.writeFileSync(dbPath, JSON.stringify(dbContent, null, 2));

    // 重新加载路由
    req.router = jsonServer.router(dbPath);

    // 返回成功响应
    res.json({
      status: 200,
      message: 'Table added successfully',
      data: { tableName }
    });
  } catch (error) {
    console.error('Error adding table:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
});

// 创建新数据库的接口
server.post('/createDatabase', (req, res) => {
  const { dbName, alias, initialData } = req.body;
  const dbPath = path.join(DB_DIR, `${dbName}.json`);
  const dbListPath = path.join(__dirname, 'databases.json');

  if (fs.existsSync(dbPath)) {
    return res.status(400).json({
      status: 400,
      message: 'Database already exists',
      data: null
    });
  }

  try {
    if (typeof initialData !== 'object' || initialData === null) {
      throw new Error('Initial data must be a valid JSON object');
    }

    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));

    const currentTime = new Date().toISOString();
    const newDbEntry = {
      name: dbName,
      alias: alias || dbName, // 如果 alias 未提供，则使用 dbName 作为默认值,
      created_at: currentTime,
      updated_at: currentTime
    };

    let dbList = [];
    if (fs.existsSync(dbListPath)) {
      const existingList = fs.readFileSync(dbListPath, 'utf8');
      dbList = JSON.parse(existingList).databases;
    }

    dbList.push(newDbEntry);
    fs.writeFileSync(dbListPath, JSON.stringify({ databases: dbList }, null, 2));

    res.json({
      status: 200,
      message: 'Database created successfully',
      data: { dbName }
    });
  } catch (error) {
    console.error('Error creating database:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
});

// 删除数据库的接口
server.delete('/deleteDatabase', (req, res) => {
  const { dbName } = req.body;
  const dbPath = path.join(DB_DIR, `${dbName}.json`);
  const dbListPath = path.join(__dirname, 'databases.json');

  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({
      status: 404,
      message: 'Database not found',
      data: null
    });
  }

  try {
    fs.unlinkSync(dbPath);

    let dbList = [];
    if (fs.existsSync(dbListPath)) {
      const existingList = fs.readFileSync(dbListPath, 'utf8');
      dbList = JSON.parse(existingList).databases;
    }

    const updatedList = dbList.filter(db => db.name !== dbName);
    fs.writeFileSync(dbListPath, JSON.stringify({ databases: updatedList }, null, 2));

    res.json({
      status: 200,
      message: 'Database deleted successfully',
      data: { dbName }
    });
  } catch (error) {
    console.error('Error deleting database:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
});

// 更新数据库的接口
server.put('/updateDatabase', (req, res) => {
  const { dbName, updatedData } = req.body;
  const dbPath = path.join(DB_DIR, `${dbName}.json`);
  const dbListPath = path.join(__dirname, 'databases.json');

  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({
      status: 404,
      message: 'Database not found',
      data: null
    });
  }

  try {
    const currentContent = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const updatedContent = { ...currentContent, ...updatedData };
    fs.writeFileSync(dbPath, JSON.stringify(updatedContent, null, 2));

    let dbList = [];
    if (fs.existsSync(dbListPath)) {
      const existingList = fs.readFileSync(dbListPath, 'utf8');
      dbList = JSON.parse(existingList).databases;
    }

    const currentTime = new Date().toISOString();
    const updatedList = dbList.map(db => {
      if (db.name === dbName) {
        return { ...db, updated_at: currentTime };
      }
      return db;
    });

    fs.writeFileSync(dbListPath, JSON.stringify({ databases: updatedList }, null, 2));

    res.json({
      status: 200,
      message: 'Database updated successfully',
      data: { dbName }
    });
  } catch (error) {
    console.error('Error updating database:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
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