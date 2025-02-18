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
          alias: db.alias || db.name,
          tables: db.tables || {},
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

// 定义删除接口
server.delete('/:table/:id', (req, res) => {
  const table = req.params.table;
  const id = parseInt(req.params.id);
  const dbName = req.query.db || 'default';

  try {
    const db = req.router.db;
    const collection = db.get(table);

    // 检查表是否存在
    if (!collection.value()) {
      return res.status(404).json({
        status: 404,
        message: `表 ${table} 不存在`,
        data: null
      });
    }

    // 检查数据是否存在
    const data = collection.find({ id }).value();
    if (!data) {
      return res.status(404).json({
        status: 404,
        message: `数据不存在`,
        data: null
      });
    }

    // 删除数据
    collection.remove({ id }).write();

    // 设置 res.locals.data
    res.locals.data = data;

    // 返回 200 状态码，并包含被删除的数据
    res.status(200).json({
      status: 200,
      message: '数据删除成功',
      data
    });
  } catch (error) {
    console.error('删除数据错误:', error);
    res.status(500).json({
      status: 500,
      message: '内部服务器错误',
      data: null
    });
  }
});


// 批量插入数据接口（示例路径：POST /posts/batch?db=mydb）
// 批量插入数据接口（支持自增ID）
server.post('/:table/batch', (req, res) => {
  const table = req.params.table; // 获取表名
  const data = req.body; // 请求体中的数组数据
  const dbName = req.query.db || 'default'; // 数据库名称

  if (!Array.isArray(data)) {
    return res.status(400).json({
      status: 400,
      message: '请求体必须是数组',
      data: null
    });
  }

  try {
    const db = req.router.db; // 获取数据库实例
    const tableCollection = db.get(table); // 获取表对象

    // 检查表是否存在
    if (!tableCollection.value()) {
      return res.status(404).json({
        status: 404,
        message: `表 ${table} 不存在`,
        data: null
      });
    }

    // 获取当前表的最大 ID（用于自增）
    const currentData = tableCollection.value();
    let maxId = currentData.length > 0
      ? Math.max(...currentData.map(item => item.id || 0))
      : 0;

    // 为每条数据生成自增 ID
    const dataWithIds = data.map(item => {
      if (!item.id) {
        maxId += 1;
        return { ...item, id: maxId };
      }
      return item;
    });

    // 批量插入数据
    dataWithIds.forEach(item => {
      tableCollection.push(item).write();
    });

    // 返回响应
    res.json({
      status: 201,
      message: '批量插入成功',
      data: { insertedCount: data.length }
    });
  } catch (error) {
    console.error('批量插入错误:', error);
    res.status(500).json({
      status: 500,
      message: '内部服务器错误',
      data: null
    });
  }
});

// 动态新增表的接口
server.post('/addTable', (req, res) => {
  const { tableName, data, metadata } = req.body;

  // 获取当前使用的数据库名称
  const dbName = req.query.db || 'default';
  const dbPath = path.join(DB_DIR, `${dbName}.json`);
  const dbListPath = path.join(__dirname, 'databases.json');

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

    // 更新 databases.json 中的 tables 信息
    if (fs.existsSync(dbListPath)) {
      const dbListContent = fs.readFileSync(dbListPath, 'utf8');
      let dbList = JSON.parse(dbListContent).databases;

      dbList = dbList.map(db => {
        if (db.name === dbName) {
          return {
            ...db,
            tables: {
              ...db.tables,
              [tableName]: metadata || {}
            }
          };
        }
        return db;
      });

      fs.writeFileSync(dbListPath, JSON.stringify({ databases: dbList }, null, 2));
    }

    // 重新加载路由
    req.router = jsonServer.router(dbPath);

    // 返回成功响应
    res.json({
      status: 200,
      message: 'Table added successfully',
      data: { [tableName]: metadata }
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

// 更新表元数据接口 (PUT /updateTableMetadata)
server.put('/updateTableMetadata', (req, res) => {
  const { dbName, tableName, metadata } = req.body; // 从请求体中获取参数
  const dbListPath = path.join(__dirname, 'databases.json');

  // 参数校验
  if (!dbName || !tableName || !metadata) {
    return res.status(400).json({
      status: 400,
      message: '缺少必要参数: dbName, tableName 或 metadata',
      data: null
    });
  }

  try {
    // 读取 databases.json
    const dbListContent = fs.readFileSync(dbListPath, 'utf8');
    const databases = JSON.parse(dbListContent).databases;

    // 查找目标数据库
    const targetDbIndex = databases.findIndex(db => db.name === dbName);
    if (targetDbIndex === -1) {
      return res.status(404).json({
        status: 404,
        message: `数据库 ${dbName} 不存在`,
        data: null
      });
    }

    // 查找目标表
    const targetDb = databases[targetDbIndex];
    if (!targetDb.tables || !targetDb.tables[tableName]) {
      return res.status(404).json({
        status: 404,
        message: `表 ${tableName} 不存在`,
        data: null
      });
    }

    // 更新元数据
    databases[targetDbIndex] = {
      ...targetDb,
      updated_at: new Date().toISOString(),
      tables: {
        ...targetDb.tables,
        [tableName]: {
          ...targetDb.tables[tableName],
          metadata: metadata // 将 mock 数据写入 metadata
        }
      }
    };

    // 写回文件
    fs.writeFileSync(dbListPath, JSON.stringify({ databases }, null, 2));

    res.json({
      status: 200,
      message: '表元数据更新成功',
      data: {
        dbName,
        tableName,
        metadata: metadata
      }
    });
  } catch (error) {
    console.error('更新元数据错误:', error);
    res.status(500).json({
      status: 500,
      message: '内部服务器错误',
      data: null
    });
  }
});

// 创建新数据库的接口
server.post('/createDatabase', (req, res) => {
  const { dbName, alias, initialData, tables } = req.body;
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
      alias: alias || dbName,
      tables: tables || {},
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
      data: newDbEntry
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
  const { dbName, updatedData, updatedTables } = req.body;
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
        return {
          ...db,
          updated_at: currentTime,
          tables: updatedTables || db.tables
        };
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