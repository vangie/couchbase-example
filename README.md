# 函数计算 couchbase 模板项目

该项目模板是一个在阿里云函数计算平台 nodejs8 环境下安排配置 couchbase 的模板项目，由于 couchbase 依赖高版本 libstdc++.so.6 , 其中缘由和细节请参阅文章 ["函数运行环境系统动态链接库版本太低？函数计算 fun 神助力分忧解难"](https://yq.aliyun.com/articles/690856)。

## 依赖工具

本项目是在 MacOS 下开发的，涉及到的工具是平台无关的，对于 Linux 和 Windows 桌面系统应该也同样适用。在开始本例之前请确保如下工具已经正确的安装，更新到最新版本，并进行正确的配置。

* [Docker](https://www.docker.com/)
* [Fun](https://github.com/aliyun/fun)
* [Fcli](https://github.com/aliyun/fcli)

Fun 和 Fcli 工具依赖于 docker 来模拟本地环境。

对于 MacOS 用户可以使用 [homebrew](https://brew.sh/) 进行安装：

```bash
brew cask install docker
brew tap vangie/formula
brew install fun
brew install fcli
```

Windows 和 Linux 用户安装请参考：

1. https://github.com/aliyun/fun/blob/master/docs/usage/installation.md
2. https://github.com/aliyun/fcli/releases

安装好后，记得先执行 `fun config` 初始化一下配置。

**注意**, 如果你已经安装过了 fun，确保 fun 的版本在 2.10.1 以上。

```bash
$ fun --version
2.10.1
```

## 快速开始

### 初始化

使用 fun init 命令可以快捷地将本模板项目初始化到本地。

```bash
fun init vangie/couchbase-example
```

## 安装依赖

```bash
$ fun install
[skip pulling image aliyunfc/runtime-nodejs8:build-1.2.0...
Task => [UNNAMED]
     => apt-get update (if need)
     => apt-get install -y -d -o=dir::cache=/code/.fun/tmp libnss3
     => bash -c 'for f in $(ls /code/.fun/tmp/archives/*.deb); do dpkg -x $f /code/.fun/root; done;'
     => bash -c 'rm -rf /code/.fun/tmp/archives'
Task => [UNNAMED]
     => bash -c  'curl -L https://github.com/muxiangqiu/puppeteer-fc-starter-kit/raw/master/chrome/headless_shell.tar.gz --output headless_shell.tar.gz'](Task => install libstdc++
     => bash -c  'if [ ! -f /code/.fun/root/usr/lib/x86_64-linux-gnu/libstdc++.so.6 ]; then
  mkdir -p /code/.fun/tmp/archives/
  curl http://mirrors.ustc.edu.cn/debian/pool/main/g/gcc-6/libstdc++6_6.3.0-18+deb9u1_amd64.deb -o /code/.fun/tmp/archives/libstdc++6_6.3.0-18+deb9u1_amd64.deb
  bash -c 'for f in $(ls /code/.fun/tmp/archives/*.deb); do dpkg -x f /code/.fun/root; done;'
  rm -rf /code/.fun/tmp/archives
fi '
Task => npm install couchbase
     => bash -c  'npm install')
...
```

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

### 部署

```bash
$ fun deploy
using region: cn-shanghai
using accountId: ***********4733
using accessKeyId: ***********KbBS
using timeout: 60

Waiting for service couchbase to be deployed...
        Waiting for function couchbase-test to be deployed...
                Waiting for packaging function couchbase-test code...
                package function couchbase-test code done
        function couchbase-test deploy success
service couchbase deploy success
```

### 执行

```bash
$ fcli function invoke -s couchbase -f couchbase-test
{"hello":"world"}
```

## 参考阅读

1. https://yq.aliyun.com/articles/690856