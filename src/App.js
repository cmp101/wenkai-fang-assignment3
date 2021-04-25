import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App.css'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      user: null,
      loading: false
    };
  }

  componentDidMount() {
    let user = sessionStorage.getItem('user')
    this.setState({ loading: true })
    if (user) user = JSON.parse(user)
    this.setState({ user })
    axios.get('/api/post')
      .then(res => {
        this.setState({ posts: res.data, loading: false });
      });
  }

  onLogout = () => {
    alert('Logged out successfully!')
    sessionStorage.removeItem('user')
    this.setState({ user: null })
  }

  render() {
    const { user, loading } = this.state
    return (
      <div class="container">
        { loading && (<div class="loader-container"><div class="loader"></div></div>) }
        <nav class="navbar navbar-dark bg-dark">
          <ul class="navbar-nav d-inline w-100">
            <li class="nav-item active mx-2">
              <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            { user ? (
              <React.Fragment>
                <li class="nav-item mx-2 float-right">
                  <button className='nav-link nav-button' onClick={ () => this.onLogout()}>Logout</button>
                </li>
                <li class="nav-item mx-2 float-right">
                  <Link className='nav-link nav-button border-none' to="/#">{ user.username && (user.username.charAt(0).toUpperCase() + user.username.slice(1)) }</Link>
                </li>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <li class="nav-item mx-2 float-right">
                  <Link className='nav-link nav-button' to="/register">Register</Link>
                </li>
                <li class="nav-item mx-2 float-right">
                  <Link className='nav-link nav-button' to="/login">Login</Link>
                </li>
              </React.Fragment>
            )}
          </ul>
        </nav>
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title d-inline">
              Posts
            </h3>
            { user && (<h4 class="d-inline float-right m-0"><Link class="nav-button create-post-btn" to="/create"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Create Post </Link></h4>)}
          </div>
          <div class="panel-body">
            {this.state.posts.map((post, i) => {
              const { created_date, comments } = post
              let postDateTime = ''
              if (created_date) {
                postDateTime = Math.floor((new Date().valueOf() - new Date(post.created_date).valueOf())/3600000)
                if (postDateTime === 0) {
                  postDateTime = Math.floor((new Date().valueOf() - new Date(post.created_date).valueOf())/60000)
                  postDateTime = postDateTime === 0 ? 'just now ' : `${ postDateTime } minutes ago`
                } else if ( postDateTime < 24) postDateTime = `${ postDateTime } hours ago`
                else {
                  postDateTime = `${Math.floor(postDateTime/24)} days ago`
                }
              }
              return (
                <div key={ post._id }>
                <h5 class="py-2 font-weight-bold post-title">
                  { `${ i + 1 }. `}
                  <Link to={`/show/${post._id}`}>{`${post.title}  `}</Link>
                  { post.url && (<span style={ { fontSize: '12px'} }><a href={ post.url } target="_blank">({post.url})</a></span>)}
                </h5>
                { post && post.author && (
                <p className='post-desc'>
                  {`by: ${post.author.username} - ${postDateTime}    - ${comments.length || 0} comments`}
                </p>
                )}
              </div>
              )}
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
