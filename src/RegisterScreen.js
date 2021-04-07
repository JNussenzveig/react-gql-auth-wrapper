import React, { useState, useReducer } from 'react'

import register from './mutations/register.gql'
import { graphql } from 'react-apollo'
import {flowRight as compose} from 'lodash'
import withAuthWrapper from './AuthWrapper'

import styles from './styles.css'

import Spinner from './Spinner'

const registerReducer = (state, action) => {
  switch (action.type) {
    case 'register': {
      return {
        ...state,
        error: '',
        loading: true
      }
    }

    case 'success': {
      return {
        ...state,
        error: '',
        loading: false
      }
    }

    case 'error': {
      return {
        ...state,
        error: action.value,
        loading: false
      }
    }

    case 'field_update': {
      const { value, field } = action

      return {
        ...state,
        [field]: value,
        error: ''
      }
    }

    default:
      break;
  }
  return state
}

const initialState = {
  email: '',
  password: '',
  passwordConfirmation: '',
  name: '',
  error: '',
  loading: false
}

const RegisterScreen = props => {

  const [state, dispatch] = useReducer(registerReducer, initialState)

  const {
    email,
    password,
    passwordConfirmation,
    name,
    loading,
    error
  } = state

  const register = async () => {

    dispatch({ type: 'register' })

    let newUser;
    const { registerUser } = props
    try {
      newUser = await registerUser({
        variables: {
          email,
          password,
          name
        }
      })

      const { callback } = props
      const { data } = newUser
      callback(data)

      dispatch({ type: 'success' })
    } catch (e) {
      dispatch({ type: 'error', value: e.message })
    }
  }

  const { toggleRegisterScreen } = props

  return (
    <div className={styles['react-auth-container']}>
      <div className={styles['react-auth-box']}>
        <h2>Nova Conta</h2>
        {error && <div className={styles['react-auth-error']}>
          <span>{error}</span>
        </div>}
        <div className={styles['react-auth-box-return']} onClick={e => toggleRegisterScreen(e)}>
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 492 492" space="preserve"><g><g><path d="M464.344,207.418l0.768,0.168H135.888l103.496-103.724c5.068-5.064,7.848-11.924,7.848-19.124c0-7.2-2.78-14.012-7.848-19.088L223.28,49.538c-5.064-5.064-11.812-7.864-19.008-7.864c-7.2,0-13.952,2.78-19.016,7.844L7.844,226.914C2.76,231.998-0.02,238.77,0,245.974c-0.02,7.244,2.76,14.02,7.844,19.096l177.412,177.412c5.064,5.06,11.812,7.844,19.016,7.844c7.196,0,13.944-2.788,19.008-7.844l16.104-16.112c5.068-5.056,7.848-11.808,7.848-19.008c0-7.196-2.78-13.592-7.848-18.652L134.72,284.406h329.992c14.828,0,27.288-12.78,27.288-27.6v-22.788C492,219.198,479.172,207.418,464.344,207.418z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
        </div>
        <div className={styles['react-auth-field']}>
          <label>Nome Completo</label>
          <input type="text" id="name" onChange={e => dispatch({ type: 'field_update', value: e.target.value, field: e.target.id })} />
        </div>
        <div className={styles['react-auth-field']}>
          <label>Email</label>
          <input type="email" id="email" onChange={e => dispatch({ type: 'field_update', value: e.target.value, field: e.target.id })} />
        </div>
        <div className={styles['react-auth-field']}>
          <label>Senha</label>
          <input type="password" id="password" onChange={e => dispatch({ type: 'field_update', value: e.target.value, field: e.target.id })} />
        </div>
        <div className={styles['react-auth-field']}>
          <label>Confirme sua senha</label>
          <input type="password" id="passwordConfirmation" onChange={e => dispatch({ type: 'field_update', value: e.target.value, field: e.target.id })} />
        </div>
        <div className={styles['react-auth-action']}>
          <button className={styles['react-signin-btn']} onClick={register}>{loading ? <Spinner /> : 'Criar'}</button>
        </div>
      </div>
    </div>
  )
}

export default compose(
  withAuthWrapper,
  graphql(register, { name: 'registerUser' })
)(RegisterScreen)
