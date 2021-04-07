import React from 'react';
import { graphql } from 'react-apollo'
import {flowRight as compose} from 'lodash'

import withAuthWrapper from './AuthWrapper'
import login from './mutations/login.gql'

import styles from './styles.css'

import RegisterScreen from './RegisterScreen'

class AuthScreen extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showRegister: false
    }
    this.inputChange = this.inputChange.bind(this);
    this.signIn = this.signIn.bind(this);
    this.toggleRegisterScreen = this.toggleRegisterScreen.bind(this);
  }

  inputChange (e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  async signIn () {
    const { email, password } = this.state;
    console.log(email, password);
    const { loginUser } = this.props;

    let token;
    try {
      token = await loginUser({
        variables: {
          email, password
        }
      })
    } catch (e) {
      console.log("error", e.message);
    }

    if (token) {
      const { callback } = this.props
      const { data } = token
      callback(data)
    }
  }

  toggleRegisterScreen (e) {
    e.preventDefault();
    const { showRegister } = this.state

    this.setState({
      showRegister: !showRegister
    })
  }

  render () {

    const { fullscreen, callback } = this.props
    const { showRegister } = this.state

    return (
      <div className={`${styles['react-auth-container']} ${fullscreen ? styles['full'] : ''}`}>
        {!showRegister && <div className={styles['react-auth-box']}>
          <h2>Entrar</h2>
          <div className={styles['react-auth-field']}>
            <label>Email</label>
            <input type="email" id="email" onChange={this.inputChange} />
          </div>
          <div className={styles['react-auth-field']}>
            <label>Senha</label>
            <input type="password" id="password" onChange={this.inputChange} />
          </div>
          <div className={styles['react-auth-new-user']}>
            <div>Novo por aqui? <a href="#" onClick={e => this.toggleRegisterScreen(e)}> Crie uma nova conta!</a></div>
          </div>
          <div className={styles['react-auth-action']}>
            <button className={styles['react-signin-btn']} onClick={this.signIn}>Entrar</button>
          </div>
        </div>}
        {showRegister && <RegisterScreen toggleRegisterScreen={this.toggleRegisterScreen} callback={callback} />}
      </div>
    )
  }
}

export default compose(
  withAuthWrapper,
  graphql(login, { name: 'loginUser' })
)(AuthScreen)
