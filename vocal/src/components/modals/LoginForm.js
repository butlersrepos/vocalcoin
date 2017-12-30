import React, { Component } from 'react'
import { Button, Checkbox, Form, FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import { createUser, signInUser } from './../../utils/fire';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      repeatPassword: '',
      address: '',
      error: '',
      isRegister: false,
      loginButtonStyle: "success",
      loginButtonText: "Sign In"
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.clearError = this.clearError.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handleAddressChange(event) {
    this.setState({ password: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleRepeatPasswordChange(event) {
    this.setState({ repeatPassword: event.target.value });
  }

  handleCheckboxChange(event) {
    const isRegister = event.target.checked;
    console.log("checkbox changed!", isRegister);
    const newLoginText = isRegister ? "Register" : "Sign In";
    const newLoginStyle = isRegister ? "danger" : "success";
    this.setState({ isRegister: isRegister, loginButtonText: newLoginText, loginButtonStyle: newLoginStyle });

  }

  clearError() {
    this.setState({ error: '' });
  }

  handleLogin(event) {
    if (this.state.isRegister) {
      this.handleRegister(event);
    } else {
      this.handleSignIn(event);
    }
  }

  handleRegister(event) {
    const self = this;
    self.clearError();
    const email = self.state.email;
    const password = self.state.password;
    const repeatPassword = self.state.repeatPassword;
    const address = self.state.address;

    if (password !== repeatPassword) {
      self.setState({ error: "Passwords do not match." });
      return;
    }

    if (!password) {
      self.setState( {error: "Password must not be empty"})
      return;
    }

    if (!address) {
      self.setState( {error: "Address must not be empty"})
      return;
    }

    localStorage.setItem("address", address);

    createUser(email, password).then(function (res) {
        self.props.onLogin();
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        self.setState({ error: error.message });
        console.error('error creating new account', errorCode, errorMessage);
        // ...
      });

    event.preventDefault();
  }

  handleSignIn(event) {
    const self = this;
    self.clearError();
    const email = self.state.email;
    const password = self.state.password;
    signInUser(email, password)
      .then(function (res) {
        self.props.onLogin();
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        self.setState({ error: error.message });
        console.error('error creating new account', errorCode, errorMessage);
        // ...
      });
    event.preventDefault();
  }

  render() {
    const self = this;
    return (
      <div className="login-form">
        <Form>
          <div className="login-form-field-name">Email:</div>
          <FormGroup className="login-form-group">
            <FormControl placeholder="email" type="text" value={self.state.email} onChange={self.handleEmailChange} />
          </FormGroup>
          <div className="login-form-field-name">Password:</div>
          <FormGroup className="login-form-group">
            <FormControl placeholder="password" type="password" value={self.state.password} onChange={self.handlePasswordChange} />
          </FormGroup>

          {self.state.isRegister && <div className="register-form">
            <div className="repeat-password">
              <div className="login-form-field-name">Repeat Password:</div>
              <FormGroup className="login-form-group">
                <FormControl placeholder="password" type="password" value={self.state.repeatPassword} onChange={self.handleRepeatPasswordChange} />
              </FormGroup>
            </div>

            <hr/>

            <div className="address">
              <div className="login-form-field-name">Enter your public Ethereum Address:</div>
              <FormGroup className="login-form-group">
                <FormControl placeholder="address" type="text" value={self.state.address} onChange={self.handleAddressChange} />
              </FormGroup>
            </div>

          </div>}

          <FormGroup className="login-form-group">
            <Button bsSize="large" bsStyle={self.state.loginButtonStyle} className="login-button" onClick={self.handleLogin}>{self.state.loginButtonText}</Button>
            <Checkbox onChange={self.handleCheckboxChange} checked={self.state.isRegister}>Register</Checkbox>
          </FormGroup>
          
          {self.state.error && <p className="error-text centered red italics medium">{self.state.error}</p>}
        </Form>
      </div>
    );
  }
}
