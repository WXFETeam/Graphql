const {
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLNonNull
} = require('graphql');
const UsersList = require("../../data/user");
const AssetsList = require("../../data/asset");
const _ = require("lodash");

const User = new GraphQLObjectType({
    name: 'User',
    description: "用户信息",
    fields: () => {
        return ({
            id: { type: new GraphQLNonNull(GraphQLInt) },
            name: { type: new GraphQLNonNull(GraphQLString) },
            sex: { type: new GraphQLNonNull(GraphQLString) },
            age: { type: new GraphQLNonNull(GraphQLInt) },
            totalAmount: { type: new GraphQLNonNull(GraphQLInt) }
        });
    },
});

const UserInput = new GraphQLInputObjectType({
    name: 'UserInput',
    description: "用户信息Input实体",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        sex: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        totalAmount: { type: new GraphQLNonNull(GraphQLInt) }
    }),
});

const AssetContent = new GraphQLObjectType({
    name: "AssetContent",
    description: "资产明细",
    fields: () => ({
        BTC: {
            type: GraphQLInt
        },
        ETH: {
            type: GraphQLInt
        },
        CYB: {
            type: GraphQLInt
        },
    })
});

const Asset = new GraphQLObjectType({
    name: "Asset",
    description: "资产信息",
    fields: () => ({
        name: { type: GraphQLString },
        id: { type: GraphQLInt },
        totalAmount: { type: GraphQLInt },
        assets: {
            type: new GraphQLList(AssetContent)
        },
    })
});

const Query = new GraphQLObjectType({
    name: 'Schema',
    description: 'Root of the user Schema',
    fields: () => ({
        user: {
            type: User,
            description: '根据name查询单个用户',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (source, { name, id }) => {
                return _.find(UsersList, item => item.id === id)
            }
        },
        users: {
            type: new GraphQLList(User),
            description: '查询全部用户列表',
            resolve: (source) => {
                return UsersList
            }
        },
        asset: {
            type: AssetContent,
            description: '根据id查询单个用户资产明细',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (source, { id }) => {
                let current = _.find(AssetsList, item => item.id === id);
                return current.assets;
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    description: "增删改数据",
    fields: () => ({
        addUser: {
            type: User,
            description: '添加用户',
            args: {
                id: { type: GraphQLInt },
                name: { type: new GraphQLNonNull(GraphQLString) },
                sex: { type: new GraphQLNonNull(GraphQLString) },
                intro: { type: new GraphQLNonNull(GraphQLString) },
                skills: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) }
            },
            resolve: (source, { id, name, sex, intro }) => {
                var user = {
                    name: name,
                    sex: sex,
                    intro: intro
                };
            }
        },
        addUserByInput: {
            type: User,
            description: '通过Input添加用户',
            args: {
                userInfo: { type: UserInput },
            },
            resolve: (source, { userInfo }) => {}
        }
    })
})

const UserSchema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

module.exports = UserSchema;
