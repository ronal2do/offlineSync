import React from 'react';
import { 
  StyleSheet, 
  TouchableHighlight,
  Text, 
  View, 
  AsyncStorage,
  NetInfo,
  ScrollView,
  Alert,
} from 'react-native';
import Relay from 'react-relay';
import ViewerQuery from '../relay/ViewerQuery';
import { createRenderer } from '../relay/RelayUtils';
import RelayStore from '../relay/RelayStore';

import t from 'tcomb-form-native';
import YourCustomTemplate from './YourCustomTemplate';
import FormAddMutation from './FormAddMutation';

// function myCustomTemplate(locals) {
//   let containerStyle = {};
//   let labelStyle = {};
//   let textboxStyle = {};

//   return (
//     <View style={containerStyle}>
//       <Text style={labelStyle}>{locals.label}</Text>
//       <TextInput style={textboxStyle} />
//     </View>
//   );
// }

const {Form} = t.form;

const Gender = t.enums({
  F: 'Feminino',
  M: 'Masculino',
  T: 'Transgênero',
});

const homeType = t.enums({
  aluguel: 'Aluguel',
  propria: 'Própria',
  parente: 'Casa de parente',
  irregular: 'Sem regularização funciária',
});

const best = t.enums({
  melhor: 'Melhor',
  pior: 'Pior',
  igual: 'Igual',
  ns: 'Não sabe',
});

const problem = t.enums({
  transporte: 'Transporte',
  seguranca: 'Segurança',
  desemprego: 'Desemprego',
  saude: 'Saúde',
  moradia: 'Moradia',
  outro: 'Outro',
});

const Person = t.struct({
  // name: t.String,              // a required string
  // surname: t.maybe(t.String),  // an optional string
  age: t.Number, 
  gender: Gender,              // a required number
  work: t.maybe(t.String),               // a required string
  neighborhood: t.maybe(t.String),               // a required string
  home: homeType, // enum            // a required string
  havePoliticalParty: t.maybe(t.Boolean),               // a required string
  politicalParty: t.maybe(t.String),               // a required string
  question1: t.maybe(t.Number),               // a required Number
  question2: t.maybe(t.Number),               // a required Number
  question3: t.maybe(t.Number),               // a required Number
  question4: t.maybe(t.Number),               // a required Number
  question5: t.maybe(t.Number),               // a required Number
  question6: t.maybe(t.Number),               // a required Number
  question7: t.maybe(t.Number),               // a required Number
  question8: t.maybe(best),               // a required Number
  question9: t.maybe(problem),               // a required Number
  question10: t.maybe(t.Boolean),               // a required Number
});

var options = {  
  label: 'Questionário',
  order: [
    'age',
    'gender',
    'work',
    'neighborhood',
    'home',
    'havePoliticalParty',
    'politicalParty',
    'question1',
    'question2',
    'question3',
    'question4',
    'question5',
    'question6',
    'question7',
    'question8',
    'question9',
    'question10',
  ],
  // auto: 'placeholders',
  fields: {
    home: {
      label: 'Moradia:',
      nullOption: {value: '', text: 'Tipo de moradia'}
    },
    gender: {
      label: 'Sexo:',
      nullOption: {value: '', text: 'Escolha o sexo'}
    },
    age: {
      label: 'Idade:',
      // template: myCustomTemplate,
    },
    neighborhood: {
      label: 'Bairro:'
    },
    work: {
      label: 'Profissão:'
    },
    havePoliticalParty: {
      label: 'Tem partido político de preferência?:',
      template: YourCustomTemplate
    },
    politicalParty: {
      label: 'Se sim, qual?:'
    },
    question1: {
      label: '1. De 0 a 10 que nota você dá para a prefeitura?'
    },
    question2: {
      label: '2. De 0 a 10, como você avalia a qualidade do transporte público na cidade  (ônibus, trem, metrô)?'
    },
    question3: {
      label: '3. De 0 a 10, como você avalia os serviços de saúde na cidade (postos de saúde, médicos, consultas, exames, hospitais)?'
    },
    question4: {
      label: '4. De 0 a 10, como você avalia a educação pública municipal (escolas, professores, quadras esportivas, atividades extraclasse)?'
    },
    question5: {
      label: '5. De 0 a 10, como você avalia a segurança pública na cidade (policiais, viaturas, rondas, postos policiais, sensação nas ruas)?'
    },
    question6: {
      label: '6. De 0 a 10, como você avalia as opções públicas de lazer na cidade (parques, praças, ruas de lazer, shows gratuitos)?'
    },
    question7: {
      label: '7. De 0 a 10, como você avalia a limpeza da cidade (coleta de lixo, aspecto das ruas, parques e monumentos, terrenos baldios, rios e córregos)?'
    },
    question8: {
      label: '8. Em termos gerais, com está a cidade hoje em comparação ao ano passado?'
    },
    question9: {
      label: '9. Qual é o principal problema da cidade?'
    },
    question10: {
      label: '10. Você sabe quem é o atual prefeito?',
      template: YourCustomTemplate
    }
  }
}; // optional rendering options (see documentation)

class Home extends React.Component {

  state = {
    value: null,
    count: null,
  }

  async componentDidMount() {
    this.updateKeys();
    // Verify NetWork, 
    // is online ?
    // NetInfo
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const countKeys = allKeys.length
      
      if (allKeys !== null){
        // We have data!!
        // Send data to API
 
        await AsyncStorage.getAllKeys((err, keys) => {
          AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            // get at each store's key/value so you can work with it
            let key = store[i][0];
            let value = store[i][1];

            console.log('value', value);
            if ( value !== null ) {
              try {
                this._createForm({ value });
                // AsyncStorage.removeItem(key);
                console.log('====================================');
                console.log('form key created');
                console.log('====================================');
              } catch (error) {
                console.log('====================================');
                console.log('error key created', error);
                console.log('====================================');
              }
            }

            });
          });
        });

      } 

    } catch (error) {
      // Error retrieving data
    }

  } 

  _createForm = ({ value }) => {
    const { viewer } = this.props;
    console.log('======= value ================')
    console.log({value})
    console.log('====================================')
    // validation
    const mutation = new FormAddMutation({
      age: value.age,
      gender: value.gender,
      work: value.work,
      neighborhood: value.neighborhood,
      home: value.home,
      havePoliticalParty: value.havePoliticalParty,
      politicalParty: value.politicalParty,
      question1: value.question1,
      question2: value.question2,
      question3: value.question3,
      question4: value.question4,
      question5: value.question5,
      question6: value.question6,
      question7: value.question7,
      question8: value.question8,
      question9: value.question9,
      question10: value.question10,
      viewer,
    });

    const callbacks = {
      onSuccess: ({ FormCreate }) => {
        console.log(FormCreate)
      },
      onFailure: (transaction) => {
        Alert.alert('Erro', 'Ocorreu um erro ao salvar a sua tattoo, tente novamente');
        console.log('error: ', transaction, transaction.getError());
      },
    };

    RelayStore.commitUpdate(mutation, callbacks);
  };

  onChange = (value) => {
    const { name, surname, age } = value;
    this.setState({
      value: {
        ...value
      },
    });
  };

  clearForm = () => {
    this.setState({ value: null }); 
    this.refs.form.getComponent('age').refs.input.focus();
  }

  async updateKeys() {
    const allKeys = await AsyncStorage.getAllKeys();
    this.setState({ count: allKeys.length });
    console.log('====================================')
    console.log(allKeys)
    console.log('====================================')
  }

  handleSubmit = () => {
    const t = new Date();

    var data = this.refs.form.getValue();
    
    if (data) {
      console.log('data ====> ',data);
    }

    // if online
    // send to api
    // is offline 

    try {
      // save on async storage 
      AsyncStorage.setItem(`@${t}:key`, JSON.stringify(data));
      this.clearForm();
      Alert.alert('Sucesso', 'O item foi salvo')
    } catch (error) {
        Alert.alert('Erro', error.toString() )
    }

    this.updateKeys();

  }

  render() {
    const { count } = this.state
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{ paddingBottom: 30 }}>Você tem { count } pesquisas para sincronizar</Text>
        <Form
          ref="form"
          type={Person}
          value={this.state.value}
          onChange={this.onChange}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={ this.handleSubmit } underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }
}

export default createRenderer(Home, {
  queries: ViewerQuery,
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${FormAddMutation.getFragment('viewer')}
      }
    `,
  },
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 60,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
