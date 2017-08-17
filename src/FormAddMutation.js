// @flow

import Relay from 'react-relay';

export default class FormAddMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      },
    `,
  };

  getVariables() {
    return {
      age: this.props.age,
      gender: this.props.gender,
      work: this.props.work,
      neighborhood: this.props.neighborhood,
      home: this.props.home,
      havePoliticalParty: this.props.havePoliticalParty,
      politicalParty: this.props.politicalParty,
      question1: this.props.question1,
      question2: this.props.question2,
      question3: this.props.question3,
      question4: this.props.question4,
      question5: this.props.question5,
      question6: this.props.question6,
      question7: this.props.question7,
      question8: this.props.question8,
      question9: this.props.question9,
      question10: this.props.question10,
    };
  }

  getMutation() {
    return Relay.QL`mutation {
      FormAdd,
    }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on FormAddPayload {
        error,
      }
    `;
  }

  // tattooEdge
  getConfigs() {
    return [
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on FormAddPayload {
              error
            },
          `
        ],
      }
    ];
  }
}
