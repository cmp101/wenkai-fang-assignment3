import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      post: {},
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true })
    axios.get('/api/post/'+this.props.match.params.id)
      .then(res => {
        this.setState({ post: res.data, loading: false });
      });
  }

  onChange = (e) => {
    const state = this.state.post
    state[e.target.name] = e.target.value;
    this.setState({post: state});
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { body, title, url } = this.state.post;
    this.setState({ loading: true })
    axios.put('/api/post/'+this.props.match.params.id, { title, body, url })
      .then((result) => {
        this.props.history.push("/show/"+this.props.match.params.id)
      });
  }

  render() {
    const { title, body, url, loading } = this.state.post;
    return (
      <div class="container">
        { loading && (<div class="loader-container"><div class="loader"></div></div>) }
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              EDIT POST
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to={`/show/${this.state.post._id}`}><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> BACK TO POST</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" class="form-control" name="title" value={title} onChange={this.onChange} placeholder="Title" />
              </div>
              <div class="form-group">
                <label for="description">Text:</label>
                <textArea class="form-control" name="body" onChange={this.onChange} placeholder="Text" cols="80" rows="5">{body}</textArea>
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

export default Edit;
