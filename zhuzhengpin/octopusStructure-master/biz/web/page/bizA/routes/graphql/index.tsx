import * as React from "react";
import { Row, Col, Form, Icon, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { observer, inject } from 'mobx-react';
import { WrapperGraphqlCmp } from './styled';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import { graphql, ApolloProvider } from 'react-apollo';
// import { 
//   makeExecutableSchema,
//   addMockFunctionsToSchema
// } from 'graphql-tools';
// import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
// import { typeDefs } from './schema';

// const schema = makeExecutableSchema({ typeDefs });
// addMockFunctionsToSchema({ schema });

// const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
});


const ChannelsList = ({ loading, error, data }) => {
  const { rates } = data;

  console.log(rates)

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  if(rates){
    return <ul>
      { rates.map((item,index) => <li key={index}>{item.currency}</li>) }
    </ul>;
  }

  return <ul>
    {/* { rates.map(item => <li>{item.currency}</li>) } */}
  </ul>;


};

const channelsListQuery = gql`
   query ChannelsListQuery {
    student() {
      name
      sex
      age
    }
   }
 `;

 const ChannelsListWithData = graphql(channelsListQuery)(ChannelsList);

declare const webAjax: any;
declare const intl: any;

interface NormalGraphqlFormProps extends FormComponentProps {
    userStore: any,
    ajaxLoadingStore: any,
    form: any,
    history: any
}

@inject("userStore", "ajaxLoadingStore")
@observer
class NormalGraphqlForm extends React.Component<NormalGraphqlFormProps, {}> {
    render() {
        const { userStore, ajaxLoadingStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
          <ApolloProvider client={client}>
            <div className="App">
              <div className="App-header">
                <h2>Welcome to Apollo</h2>
              </div>
              <ChannelsListWithData />
            </div>
          </ApolloProvider>
        );
    }
}

const WrappedNormalGraphqlForm = Form.create<NormalGraphqlFormProps>()(NormalGraphqlForm);
export default WrappedNormalGraphqlForm;