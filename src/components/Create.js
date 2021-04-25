import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Create extends Component {

  constructor() {
    super();
    this.state = {
      title: '',
      url: '',
      body: '',
      loading: false
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { title, url, body } = this.state;
    let user = sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      this.setState({ loading: true })
      axios.post('/api/post/', { title, author: user.id, url, body })
        .then((result) => {
          this.props.history.push("/")
        });
    }
  }

  render() {
    const { title, author, url, body, loading } = this.state;
    return (
      <div class="container">
        { loading && (<div class="loader-container"><div class="loader"></div></div>) }
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              CREATE POST
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to="/"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span> Home</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" class="form-control" name="title" value={title} onChange={this.onChange} placeholder="Title" />
              </div>
              <div class="form-group">
                <label for="description">Text:</label>
                <textArea class="form-control" name="body" onChange={this.onChange} placeholder="Text" cols="80" rows="3">{body}</textArea>
              </div>
              <div class="form-group">
                <label for="author">URL:</label>
                <input type="text" class="form-control" name="url" value={url} onChange={this.onChange} placeholder="URL" />
              </div>
              <button type="submit" class="btn btn-default">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Create;
