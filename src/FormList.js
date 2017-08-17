// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Button,
} from 'react-native';
import Relay from 'react-relay';
import ViewerQuery from '../relay/ViewerQuery';
import { createRenderer } from '../relay/RelayUtils';

type Props = {};

type State = {
  isFetchingTop: boolean,
  isFetchinEnd: boolean,
};

class FormList extends Component<any, Props, State> {

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;

    return {
      title: 'Form List',
      headerRight: (
        <Button
          title={'+ Adicionar'}
          onPress={() => navigate('Home')}
        />
      ),
    };
  };

  state = {
    isFetchingTop: false,
    isFetchingEnd: false,
  };

  onRefresh = () => {
    const { isFetchingTop } = this.state;

    if (isFetchingTop) return;

    this.setState({ isFetchingTop: true });

    this.props.relay.forceFetch({}, readyState => {
      if (readyState.done || readyState.aborted) {
        this.setState({
          isFetchingTop: false,
          isFetchingEnd: false,
        });
      }
    });
  };

  onEndReached = () => {
    const { isFetchingEnd } = this.state;
    const { forms } = this.props.viewer;

    if (isFetchingEnd) return;
    if (!forms.pageInfo.hasNextPage) return;

    this.setState({ isFetchingEnd: true });

    this.props.relay.setVariables(
      {
        count: this.props.relay.variables.count + 10,
      },
      readyState => {
        if (readyState.done || readyState.aborted) {
          this.setState({ isFetchingEnd: false });
        }
      },
    );
  };

  renderItem = ({ item }) => {
    const { node } = item;

    return (
      <TouchableHighlight
        onPress={() => this.goToFormDetail(node)}
        underlayColor="whitesmoke"
      >
        <View style={styles.formContainer}>
          <Text>{node.work}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  goToFormDetail = form => {
    const { navigate } = this.props.navigation;

    navigate('FormDetail', { id: form.id });
  };

  render() {
    const { forms } = this.props.viewer;

    return (
      <View style={styles.container}>
        <FlatList
          data={forms.edges}
          renderItem={this.renderItem}
          keyExtractor={item => item.node.id}
          onEndReached={this.onEndReached}
          onRefresh={this.onRefresh}
          refreshing={this.state.isFetchingTop}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }
}

// Create a Relay.Renderer container
export default createRenderer(FormList, {
  queries: ViewerQuery,
  initialVariables: {
    count: 5,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        forms(first: $count) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              id
              work
            }
          }
        }
      }
    `,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc',
  },
  formContainer: {
    margin: 20,
  },
});