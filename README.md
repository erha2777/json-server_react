# React + TypeScript + Vite

### 项目功能
通过node服务器模拟管理多个数据库，支持动态加载、创建、删除和更新数据库，管理表结构，支持数据的增删改查，以及维护数据库和表的元数据。通过json-server提供了一系列RESTful接口，适用于需要模拟接口进行前后端交互开发的场景。

### 运行项目
#### 运行前端
```bash
npm start
```
#### 运行服务端

```bash
# src/server
nodemon server.js
```

### 项目依赖
#### 前端依赖
```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^2.5.1",
    "antd": "^5.23.4",
    "axios": "^1.7.9",
    "body-parser": "^2.0.1",
    "mockjs": "^1.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-redux": "^9.2.0",
    "react-router-dom": "^7.1.5"
  },
  "devDependencies": {
    "@ant-design/v5-patch-for-react-19": "^1.0.3",
    "@eslint/js": "^9.19.0",
    "@types/mockjs": "^1.0.10",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.19.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.18",
    "globals": "^15.14.0",
    "sass": "^1.84.0",
    "typescript": "~5.7.2",
    "typescript-eslint": "^8.22.0",
    "vite": "^6.1.0"
  }
}
```
#### 服务端依赖
```json
{
  "dependencies": {
    "json-server": "^0.17.4",
    "nodemon": "^3.1.9"
  }
}
```

### 项目结构
vite-react-ts                        
├─ public                            
│  └─ vite.svg                       
├─ src                               
│  ├─ api                            
│  │  ├─ database.ts                 
│  │  └─ table.ts                    
│  ├─ assets                         
│  │  └─ react.svg                   
│  ├─ components                     
│  │  ├─ AppMenu                     
│  │  │  ├─ index.scss               
│  │  │  └─ index.tsx                
│  │  ├─ CreatTableModal             
│  │  │  ├─ index.scss               
│  │  │  └─ index.tsx                
│  │  ├─ MockDataGenerator           
│  │  │  ├─ MockAddressAI.tsx        
│  │  │  ├─ MockArrayAI.tsx          
│  │  │  ├─ MockBoolean.tsx          
│  │  │  ├─ MockBooleanAI.tsx        
│  │  │  ├─ MockColorAI.tsx          
│  │  │  ├─ MockDateAI.tsx           
│  │  │  ├─ MockFunctionAI.tsx       
│  │  │  ├─ MockImageAI.tsx          
│  │  │  ├─ MockMiscellaneousAI.tsx  
│  │  │  ├─ MockNameAI.tsx           
│  │  │  ├─ MockNumber.tsx           
│  │  │  ├─ MockNumberAI.tsx         
│  │  │  ├─ MockObject.tsx           
│  │  │  ├─ MockObjectAI.tsx         
│  │  │  ├─ MockPathAI.tsx           
│  │  │  ├─ MockRegExpAI.tsx         
│  │  │  ├─ MockString.tsx           
│  │  │  ├─ MockStringAI.tsx         
│  │  │  ├─ MockTextAI.tsx           
│  │  │  ├─ MockWebAI.tsx            
│  │  │  └─ index.tsx                
│  │  ├─ MockDataGeneratorModal      
│  │  │  ├─ enum.ts                  
│  │  │  └─ index.tsx                
│  │  ├─ RestfulApi                  
│  │  │  ├─ index.scss               
│  │  │  └─ index.tsx                
│  │  ├─ TableCard                   
│  │  │  ├─ index.scss               
│  │  │  └─ index.tsx                
│  │  └─ UpdateModal                 
│  │     └─ index.tsx                
│  ├─ routes                         
│  │  ├─ CreateDB.tsx                
│  │  ├─ Database.tsx                
│  │  ├─ Home.tsx                    
│  │  └─ NotFound.tsx                
│  ├─ server                         
│  │  ├─ dbs                         
│  │  │  ├─ db1.json                 
│  │  │  ├─ db2.json                 
│  │  │  └─ default.json             
│  │  ├─ databases.json              
│  │  ├─ package-lock.json           
│  │  ├─ package.json                
│  │  ├─ server.js                   
│  │  └─ test.http                   
│  ├─ store                          
│  │  ├─ databaseSlice.ts            
│  │  └─ store.ts                    
│  ├─ types                          
│  │  └─ database.ts                 
│  ├─ utils                          
│  │  └─ request.ts                  
│  ├─ App.scss                       
│  ├─ App.tsx                        
│  ├─ common.css                     
│  ├─ main.tsx                       
│  └─ vite-env.d.ts                  
├─ README.md                         
├─ eslint.config.js                  
├─ index.html                        
├─ package-lock.json                 
├─ package.json                      
├─ tsconfig.app.json                 
├─ tsconfig.json                     
├─ tsconfig.node.json                
└─ vite.config.ts                    

