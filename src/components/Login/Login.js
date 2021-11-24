import React, { useState, useEffect, useReducer, useContext, useRef } from 'react'

import Card from '../UI/Card/Card'
import classes from './Login.module.css'
import Button from '../UI/Button/Button'
import Input from '../UI/Input/Input'
import AuthContext from '../../store/auth-context'

// reducerFn 可以寫在component之外，因為它並不需要任何定義在component內的東西
// 所有需要的東西都可以定義在reducerFn之內，然後傳進component
// 需要傳進兩個變數，latest state(來自react給的，保證是最新的state)和指派的action，然後會回傳一個new state
const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') }
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') }
  }
  return { value: '', isValid: false }
}
const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 }
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 }
  }
  return { value: '', isValid: false }
}

const Login = () => {
  const authCtx = useContext(AuthContext)
  const [formIsValid, setFormIsValid] = useState(false)
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  })
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  })

  // alias assignment: 把isValid解構出來之後，存到新的變數裡(emailIsValid, passwordIsValid)
  const { isValid: emailIsValid } = emailState
  const { isValid: passwordIsValid } = passwordState

  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  useEffect(() => {
    // debounce:例如在使用者停止輸入的時候，才去檢查email是否包含@，而不是正在輸入的時候就一直去檢查
    // 此時是只有在email和password valid有改變的時候才去重新執行
    // setTimeout + cleanup funciton
    const identifier = setTimeout(() => {
      console.log('Checking form validity!')
      setFormIsValid(emailIsValid && passwordIsValid)
    }, 500)

    // cleanup function
    // run as a cleanup process before useEffect executes next time
    // 1. before every next side-effect function exection(第二次開始的useEffect才會執行)
    // 2. before the component is removed
    // *  not run before the first side-effect function exection(第一次的useEffect不會執行)
    return () => {
      console.log('CLEANUP')
      clearTimeout(identifier) // clear the timer
    }
  }, [emailIsValid, passwordIsValid])

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value })
    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.isValid
    // );
  }

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value })
    // setFormIsValid(
    //   event.target.value.trim().length > 6 && emailState.isValid
    // );
  }

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' })
  }

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' })
  }

  const submitHandler = (event) => {
    event.preventDefault()
    if(formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value)
    } else if (!emailIsValid) {
      // 因為在Input.js裡面useImperativeHandle是叫focus
      emailInputRef.current.focus()
    } else {
      passwordInputRef.current.focus()
    }
  }

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          type="email"
          label="E-Mail"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />

        <Input
          ref={passwordInputRef}
          id="password"
          type="password"
          label="Password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default Login

/* useEffect 重點整理
  
  1. really runs for 'EVERY' time this component reruns, RARELY use it
  useEffect(()=>{ 
    console.log('Effect Running!!')
  })

  2. runs for the 'FIRST' time this component was mounted and rendered
  useEffect(()=>{ 
    console.log('Effect Running for first time!!')
  }, [])

  3. runs when this component was mounted and this state(hi) changed
  useEffect(()=>{ 
    console.log('Effect Running for state changed!!')
  }, [hi])

  4. cleanup function: runs before this state function as a whole run(except the first time), also before component removed
  useEffect(()=>{ 
    console.log('Effect Running for state changed!! with cleanup')

    return ()=> {
      console.log('cleanup')
    }

  }, [hi])
  */
