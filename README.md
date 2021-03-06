# k-blog

绑定域名 https://www.wintersnow.vip

本项目采用 react16.2 + redux3.7 + webpack3.8 的形式进行开发，前端进行路由，按照如下命令启动开发

##  1、安装依赖

```
// 开发之前需要安装依赖：

npm install

（如果node-sass无法安装，请尝试：SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ npm install node-sass）
```

## 2. 安装mongodb并设置用户权限后启动
```
// 启动服务

sudo mongod

// 利用mongo命令行创建用户

use kblog

db.createUser({
  user:'kblogdb',
  pwd:'kblogdb',
  customData:{description:"kblog数据库账户"},
  roles:[{
    'role':'readWrite',
    'db':'kblog'
  }]
})

// 修改配置文件

dbpath=/usr/local/mongodb/data/db/
logpath=/usr/local/mongodb/log/mongod.log
logappend = true
// 默认27017
port = 19999
fork = true
auth = true

// 重启服务

sudo mongod -f /usr/local/mongodb/mongod.conf

// 导入数据库

mongorestore -u kblogdb -p kblogdb --port 1999 -d kblog /Users/wangxue/Documents/web/github/k-blog/db/kblog

// 登录认证

/usr/local/mongodb/bin/mongo 127.0.0.1:19999

db.auth("kblogdb","kblogdb")

```

## 3. 安装redis并设置用户权限后启动
```
// 找到redis安装目录，修改redis.conf配置文件

port 29999
requirepass 12345678

// 启动服务

redis-server /usr/local/redis/redis.conf

```

## 4、启动后端服务
```
// 会在本地启动一个监听 11234 端口的 node 服务器，固接口链接为http://本机ip:11234/

npm run server

```

## 5、启动前端服务
```
// 会在本地启动一个监听 3002 端口的 node 服务器，本地预览，请访问 http://本机ip:3002/

npm run start

```

## 6、项目打包
```
// 在 build 文件夹下生成打包好的文件

npm run build

```

注册admin账号为管理员账号，可以审核文章
