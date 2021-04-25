import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Login extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      error: '',
      loading: false,
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    this.setState({ loading: true })
    if (!username || !password) return null
    axios.post('/api/user/login', { username, password })
      .then((result) => {
        sessionStorage.setItem('user', JSON.stringify({ id: result.data.user_id, username: result.data.username }))
        this.props.history.push("/")
      })
      .catch((err) => {
        if (err) this.setState({error: err.response.data})
      });
  }

  render() {
    const { username, password, error, loading } = this.state;
    return (
      <div class="container">
        { loading && (<div class="loader-container"><div class="loader"></div></div>) }
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              LOGIN
            </h3>
          </div>
          <div class="panel-body">
            <h4 className='d-inline'><Link to="/"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span> HOME </Link></h4>
            <h4 className='d-inline ml-2'><Link to="/register"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span> REGISTER </Link></h4>
            <form onSubmit={this.onSubmit}>
              <div className='py-2 auth-error'>
                { error }
              </div>
              <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" class="form-control w-25" name="username" value={username} onChange={this.onChange} placeholder="Username" />
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" class="form-control w-25" name="password" value={password} onChange={this.onChange} placeholder="Password" />
              </div>
              <button type="submit" class="btn btn-default">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
