## 项目整体文件说明
- `config` 配置文件目录
  - `default.json` 默认配置文件（其中包含数据库配置，jwt配置）
- `dao` 数据访问层，存放对数据库的增删改查操作
  - `DAO.js` 提供的公共访问数据库的方法
- `models` 存放具体数据库 ORM 模型文件
- `modules` 当前项目模块
  - `authorization.js` API权限验证模块
  - `database.js` 数据库模块（数据库加载基于 nodejs-orm2 库加载）
  - `passport.js` 基于 passport 模块的登录搭建
  - `resextra.js` API 统一返回结果接口
- `node_modules` 项目依赖的第三方模块
- `routes` 统一路由
  - `api` 提供 api 接口
  - `mapp` 提供移动APP界面
  - `mweb` 提供移动web站点
- `services` 服务层，业务逻辑代码在这一层编写，通过不同的接口获取的数据转换成统一的前端所需要的数据
- `app.js` 主项目入口文件
- `package.json` 项目配置文件

## 安装运行说明
### 1、安装依赖
在项目根目录vue_api_server下安装相关依赖包
```shell
npm install
```
或者使用淘宝的cnpm
```shell
cnpm install
```
安装好依赖后，会在根目录下生成node_modules目录，里面就是npm install安装的依赖库

### 2、导入数据库脚本到MySQL中
使用Navicat Premium等MySQL客户端，将vue_api_server/db目录下的mydb.sql数据库脚本文件导入到MySQL数据库中；也可以直接使用MySQL命令行导入数据库脚本，前提是在本地或者云服务器上安装了MySQL数据库软件。

### 3、配置MySQL数据库
修改vue_api_server/config目录下的default.json的MySQL数据库的配置为你自己项目的配置，包括服务端的IP和端口等也可以根据需要进行修改。
```json
{
	"config_name" : "develop",
	"jwt_config" : {
		"secretKey":"itcast",
		"expiresIn":86400
	},
	"upload_config":{
		"baseURL":"http://127.0.0.1:8888",
		"upload_ueditor":"uploads/ueditor",
		"simple_upload_redirect":"http://127.0.0.1/reload"
	},
	"db_config" : {
		"protocol" : "mysql",
		"host" : "127.0.0.1",
		"database" : "mydb",
		"user" : "root",
		"password" : "1030",
		"port" : 3306
	}
}
```

### 4、运行
在后端项目的vue_api_server根目录下执行如下命令，运行后端程序
```shell
node app.js
```
运行截图如下所示：


