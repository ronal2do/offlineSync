import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Relay from 'react-relay';
import ViewerQuery from '../relay/ViewerQuery';
import { createRenderer } from '../relay/RelayUtils';

class FormDetail extends Component {
  static navigationOptions = {
    title: 'Pesquisas',
  };

  render() {
    const { form } = this.props.viewer;

    return (
      <View style={styles.container}>
        <Text>ID: {form.id}</Text>
        <Text>Work: {form.work}</Text>
        <Text>Age: {form.age}</Text>
      </View>
    );
  }
}

// Create a Relay.Renderer container
export default createRenderer(FormDetail, {
  queries: ViewerQuery,
  queriesParams: ({ navigation }) => ({
    id: navigation.state.params.id,
  }),
  initialVariables: {
    id: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        form(id: $id) {
          id
          work
          age
        }
      }
    `,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});