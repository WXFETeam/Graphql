var express = require('express');
var graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors'); // 用来解决跨域问题

// 创建 schema，需要注意到：
// 1. 感叹号 ！ 代表 not-null
// 2. rollDice 接受参数
const schema = buildSchema(`
  type Query {
    username: String
    age: Int!
    info: User
  }

  type User {
    name: String
    age: Int!
    sex: String
  }
`)


// type Mutation {
//     username: String
//     age: Int!
// }
// type Subscription {
//     username: String
//     age: Int!
//         info: Object!
// }


const root = {
    username: () => {
        return '李华'
    },
    age: () => {
        return Math.ceil(Math.random() * 100)
    },
    info: () => {
        return {
            name: 'Jack',
            age: 18,
            sex: 'Male'
        }
    }
}
const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(3300);
console.log('Running a GraphQL API server at http://localhost:3300/graphql')