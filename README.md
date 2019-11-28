<a name="23035d75"></a>
# 函数计算 couchbase 模板项目

该项目模板是一个在阿里云函数计算平台 nodejs8 环境下安排配置 couchbase 的模板项目。

<a name="c3dd8329"></a>
## 依赖工具

本项目是在 MacOS 下开发的，涉及到的工具是平台无关的，对于 Linux 和 Windows 桌面系统应该也同样适用。在开始本例之前请确保如下工具已经正确的安装，更新到最新版本，并进行正确的配置。

- [Docker](https://www.docker.com/)
- [Fun](https://github.com/aliyun/fun)
- [Fcli](https://github.com/aliyun/fcli)

Fun 和 Fcli 工具依赖于 docker 来模拟本地环境。

对于 MacOS 用户可以使用 [homebrew](https://brew.sh/) 进行安装：

```bash
brew cask install docker
brew tap vangie/formula
brew install fun
brew install fcli
```

Windows 和 Linux 用户安装请参考：

1. [https://github.com/aliyun/fun/blob/master/docs/usage/installation.md](https://github.com/aliyun/fun/blob/master/docs/usage/installation.md)
1. [https://github.com/aliyun/fcli/releases](https://github.com/aliyun/fcli/releases)

安装好后，记得先执行 `fun config` 初始化一下配置。

**注意**, 如果你已经安装过了 fun，确保 fun 的版本在 2.10.1 以上。

```bash
$ fun --version
2.10.1
```

<a name="c182e73c"></a>
## 快速开始

<a name="2cb472ff"></a>
### 初始化

使用 fun init 命令可以快捷地将本模板项目初始化到本地。

```bash
fun init vangie/couchbase-example
```

<a name="277b7e0f"></a>
## 安装依赖

```bash
$ fun install -d
using template: template.yml
start installing functions using docker

building couchbase/couchbase-test
skip pulling image aliyunfc/runtime-nodejs8:build-1.7.3...

build function using image: aliyunfc/runtime-nodejs8:build-1.7.3
running task flow NpmTaskFlow
running task: CopySource
running task: NpmInstall

Install Success

Tips for next step
======================
* Invoke Event Function: fun local invoke
* Invoke Http Function: fun local start
* Build Http Function: fun build
* Deploy Resources: fun deploy
```

<a name="5310a90c"></a>
### 本地测试

测试代码 index.js 的内容为：

```javascript
const couchbase = require('couchbase').Mock;

module.exports.handler = function(event, context, callback) {
    var cluster = new couchbase.Cluster();
    var bucket = cluster.openBucket();

    bucket.upsert('testdoc', {hello:'world'}, function(err, result) {
        if (err) throw err;
        bucket.get('testdoc', function(err, result) {
            if (err) throw err;
            callback(null, result.value)
        });
    });
}
```

上面的代码引入 couchbase 的 Mock，以免真实的配置一个外部的 couchbase 服务。

```bash
$ fun local invoke couchbase-test
skip pulling image aliyunfc/runtime-nodejs8:1.4.0...
FC Invoke Start RequestId: d4db3263-6e0f-4885-bf9d-05341c697533
load code for handler:index.handler
FC Invoke End RequestId: d4db3263-6e0f-4885-bf9d-05341c697533
{"hello":"world"}

RequestId: d4db3263-6e0f-4885-bf9d-05341c697533          Billed Duration: 2222 ms        Memory Size: 1998 MB    Max Memory Used: 36 MB
```

<a name="a9f94dcd"></a>
### 部署

```bash
$ fun deploy
using template: template.yml
using region: cn-shanghai
using accountId: ***********8320
using accessKeyId: ***********mTN4
using timeout: 10

Waiting for service couchbase to be deployed...
        Waiting for function couchbase-test to be deployed...
                Waiting for packaging function couchbase-test code...
                The function couchbase-test has been packaged. A total of 3279 files files were compressed and the final size was 6.09 MB
        function couchbase-test deploy success
service couchbase deploy success
```

<a name="1a6aa24e"></a>
### 执行

```bash
$ fun invoke
using template: template.yml

Missing invokeName argument, Fun will use the first function couchbase/couchbase-test as invokeName

========= FC invoke Logs begin =========
FC Invoke Start RequestId: 173a818d-533e-47c8-bf94-fc001d562f88
load code for handler:index.handler
FC Invoke End RequestId: 173a818d-533e-47c8-bf94-fc001d562f88

Duration: 184.58 ms, Billed Duration: 200 ms, Memory Size: 128 MB, Max Memory Used: 40.60 MB
========= FC invoke Logs end =========

FC Invoke Result:
{"hello":"world"}
```

<a name="2473ec5a"></a>
## 参考阅读

1. [https://yq.aliyun.com/articles/690856](https://yq.aliyun.com/articles/690856)
