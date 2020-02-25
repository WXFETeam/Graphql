# 实战GraphQL+express+mysql 项目完整demo


## 安装步骤:

1.`npm install `

2.数据库安装及连接

使用`/graphql.sql`安装数据库

3.启动步骤

`npm start`


4.访问:

`localhost:3003`

通过开发者工具查看相关的接口访问

5.访问调试工具:

`http://localhost:3003/graphql`

`http://localhost:3003/article`


## GraphQL是什么
`GraphQL` 是一个Facebook于2012开发出来且2015开源的应用层的查询语言,你需要在后台定义一个基于GraphQL的图形模式,然后你的客户端就可以查询他们想要的数据,而不需要后台重新定义一个接口返回你需要的数据.

GraphQL 是一个规范.这意味着你可以在任何语言上实现 GraphQL.因为不需要更改你后台,所以这种方式比 `REST API` 方式更好,让我们可以在不同的客户端上灵活改变数据显示.


## 为什么要用

GraphQL对你的API中的数据提供了一套易于理解的完整描述，使得客户端能够准确地获得它需要的数据，而且没有任何冗余，也让 API 更容易地随着时间推移而演进，还能用于构建强大的开发者工具。 
  获取多个资源只用一个请求 

1. 声明式。描述所有的可能类型系统 查询的结果格式由请求方（即客户端）决定而非响应方（即服务器端）决定。你不需要编写很多额外的接口来适配客户端请求

2. 减少开发文档的维护工作量,相对应的减少沟通成本

3. 强类型。每个 GraphQL 查询必须遵循其设定的类型才会被执行。

4. 请求合并 多个接口可以通过组合为一个

5. 请求你所要的数据不多不少 

## 如何使用

### 自省

http://localhost:3003/graphql

GraphQL是可自省的，也就是说你可以通过查询一个GraphQL知道它自己的schema细节。

查询__schema以列出所有该schema中定义的类型，并获取每一个的细节：
```
query {
  __schema {
    types {
      name
      kind
      description
      fields {
        name
      }
    }
  }
}
```
查询__type以获取任意类型的细节：
```
query {
  __type(name: "User") {
    name
    kind
    description
    fields {
      name
    }
  }
}
```

## 查询

### 列表查询(无参数)

```
{
  users{
    name,
    id,
    sex,
    age,
    totalAmount
  }
}
```
结果:
```markdown
{
  "data": {
    "users": [
      {
        "name": "zhangsan",
        "id": 1,
        "sex": "male",
        "age": 20,
        "totalAmount": 6000
      },
      {
        "name": "lisi",
        "id": 2,
        "sex": "female",
        "age": 20,
        "totalAmount": 60000
      },
      {
        "name": "wangwu",
        "id": 3,
        "sex": "male",
        "age": 20,
        "totalAmount": 12010
      },
      {
        "name": "maliu",
        "id": 4,
        "sex": "male",
        "age": 20,
        "totalAmount": 450
      }
    ]
  }
}
```

### 精确查询(有参数)
```$xslt
{
  user(id:1){
    name,
    id,
    sex,
    age,
    totalAmount
  }
}
```
结果:
```markdown
{
  "data": {
    "user": {
      "name": "zhangsan",
      "id": 1,
      "sex": "male",
      "age": 20,
      "totalAmount": 6000
    }
  }
}
```

### 组合查询
```markdown
{
  user(id:1){
    name,
    id,
    sex,
    age,
    totalAmount
  },
  asset(id:1){
    BTC,
    CYB,
    ETH
	}
}

```
结果
```markdown
{
  "data": {
    "user": {
      "name": "zhangsan",
      "id": 1,
      "sex": "male",
      "age": 20,
      "totalAmount": 6000
    },
    "asset": {
      "BTC": 1000,
      "CYB": 3000,
      "ETH": 2000
    }
  }
}

```
### 嵌套查询
http://localhost:3003/article

有时候我们需要对查询到的数据进行筛选,比如限制大小,这时候就需要一个嵌套查询来实现这个功能了.

比如下面这个查询`A`开头的全国省市信息:

```js
{
  address(ShortKey:"A"){
    ShortKey,
    Content(limit:5) {
      Id,
      Code,
      Name,
      FirstStr
    }
  }
}
```

服务器返回:

```js
{
  "data": {
    "address": [
      {
        "ShortKey": "A",
        "Content": [
          {
            "Id": 36,
            "Code": "152900",
            "Name": "阿拉善盟",
            "FirstStr": "A"
          },
          {
            "Id": 39,
            "Code": "210300",
            "Name": "鞍山市",
            "FirstStr": "A"
          },
          {
            "Id": 105,
            "Code": "340800",
            "Name": "安庆市",
            "FirstStr": "A"
          },
          {
            "Id": 155,
            "Code": "410500",
            "Name": "安阳市",
            "FirstStr": "A"
          },
          {
            "Id": 293,
            "Code": "513200",
            "Name": "阿坝藏族羌族自治州 ",
            "FirstStr": "A"
          }
        ]
      }
    ]
  }
}

```
### GraphQL中有对应JavaScript的类型:

```js
GraphQLObjectType,//自定义类型
GraphQLSchema,//定义视图
GraphQLInterfaceType,//描述多个类型的通用字段
GraphQLList,//其他类型的封装
GraphQLString,//字符串类型
GraphQLInt,//整型
GraphQLFloat,//浮点型
GraphQLEnumType,//可迭代类型
GraphQLNonNull,//不允许为空类型,接受一个graphql类型
```


### 定义查询

```js
const Post = new GraphQLObjectType({
  name:"Post",
  description:"一篇文章",
  fields:()=>({
    _id:{
      type:new GraphQLNonNull(GraphQLString),//不允许为空
    },
    title:{
      type:new GraphQLNonNull(GraphQLString),
    },
    category:{
      type:GraphQLString
    },
    content:{
      type:GraphQLString
    },
  })
});
```
一篇文章包含了id,title,category,content这些信息,其中id和title是不允许空的字符串,如果查询到的数据没有这两个就会报错.

定义好后我们就需要在根查询里面建立一个引用,否则定义的就没法使用:


**有时候你需要嵌套几个`GraphQLObjectType`来得到自己想要的数据格式,比如项目中的schema.js定义了一个地址查询,定义了三层查询.**

## Mutation

> 客户端查询数据有时候是也伴随着增删改数据.

```js
mutation CREATE{
  createAddress(Id:1000,Code:"999999",Name:"魔都",FirstStr:"M"){
    Id,
    Name,
    Code,
  }
}
```

增加一个地级市的信息,这个地级市有以下字段:Id,Code,Name,FirstStr.

## 文档推荐:

[GraphQL数据类型](http://www.zhaiqianfeng.com/2017/06/learn-graphql-type-system.html)

[GraphQL-Express](https://www.jianshu.com/p/eea37394a13b)
