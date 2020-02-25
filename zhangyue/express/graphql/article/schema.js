const {
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLEnumType,
    GraphQLNonNull
} = require('graphql');

const _ = require("lodash");
// const AddressList = require("../../data/address");
const {
    Store,
    AddressList
} = require("./store");
const AddressContent = new GraphQLObjectType({
    name: "AddressContent",
    description: "地址子信息",
    fields: () => ({
        Id: {
            type: GraphQLInt
        },
        Code: {
            type: GraphQLString
        },
        Name: {
            type: GraphQLString
        },
        FirstStr: {
            type: GraphQLString
        },
    })
});

const Address = new GraphQLObjectType({
    name: "Address",
    description: "地址信息",
    fields: () => ({
        ShortKey: {
            type: GraphQLString
        },
        Content: {
            type: new GraphQLList(AddressContent),
            args: {
                limit: { type: GraphQLInt },
                // id: { type: GraphQLInt }
            },
            resolve: (source, { limit, id }) => {
                if (limit) {
                    return _.first(source.Content, limit);
                } else {
                    return source.Content;
                }
                // if (id) {
                //     return [_.find(source.Content, item => item.Id === id)];
                // } else {
                //     return source.Content;
                // }
            }
        },
    })
});

const Query = new GraphQLObjectType({
    name: 'Schema',
    description: 'Root of the article Schema',
    fields: () => ({
        echo: {
            type: GraphQLString,
            description: '回应你输入的内容',
            args: {
                message: { type: GraphQLString },
                name: { type: GraphQLString }
            },
            resolve: function(source, { message, name }) {
                return `${name}hello: ${message}`;
            }
        },
        address: {
            type: new GraphQLList(Address),
            args: {
                ShortKey: { type: GraphQLString }
            },
            resolve: (source, { ShortKey }) => {
                return [_.find(AddressList, item => item.ShortKey === ShortKey.toUpperCase())]
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    description: "增删改数据",
    fields: () => ({
        createAddress: {
            type: AddressContent,
            args: {
                Id: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                Code: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                Name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                FirstStr: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (source, args) => {
                let address = Object.assign({}, args); //获取数据

                //改为大写
                address.FirstStr = address.FirstStr.toUpperCase();

                let queryData = _.find(AddressList, item => item.ShortKey === address.FirstStr); //查找的数据

                //检测是否存在FirstStr开头的
                if (queryData) {
                    // 有这个数据
                    //存储数据
                    Store.add(address);
                    // console.log(address)
                    return address; //返回新存储的数据
                } else {
                    return null;
                }
            }
        }
    })
})

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

module.exports = Schema;
