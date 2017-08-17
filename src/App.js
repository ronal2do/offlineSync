import React from 'react';
import Relay from 'react-relay';
import { StackNavigator } from 'react-navigation';

import RelayStore from '../relay/RelayStore';

import FormList from './FormList';
import FormDetail from './FormDetail';

import Home from './Home';

RelayStore.reset(
  new Relay.DefaultNetworkLayer('http://localhost:5000/graphql'),
);

const RelayApp = StackNavigator(
  {
    FormList: { screen: FormList },
    FormDetail: { screen: FormDetail },
    Home: { screen: Home },
  },
  {
    initialRouteName: 'FormList',
  },
);

export default () => <RelayApp />;