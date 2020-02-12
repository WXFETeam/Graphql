export const typeDefs = `
    type Channel {
        id: ID!                # "!" 为必填
        name: String
    }
    # 此类型指定了我们的 API 的入口点。在本例中，只有一个——"channels"——返回频道列表。
    type Query {
        channels: [Channel]    # "[]" 意味着这是频道列表
    }
`;