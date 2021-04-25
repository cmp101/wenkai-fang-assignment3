import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Show extends Component {

  constructor(props) {
    super(props);
    this.state = {
      post: {},
      comment: '',
      editingCommentId: null,
      updatedComment: '',
      loading: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true })
    axios.get('/api/post/'+this.props.match.params.id)
      .then(res => {
        this.setState({ post: res.data, loading: false });
      });
  }

  delete(id){
    this.setState({ loading: true })
    axios.delete('/api/post/'+id)
      .then((result) => {
        this.props.history.push("/")
      });
  }

  deleteComment(id){
    this.setState({ loading: true })
    axios.delete('/api/comment/'+id)
      .then((result) => {
        axios.get('/api/post/'+this.props.match.params.id)
        .then(res => {
          this.setState({ post: res.data, loading: false });
        });
      });
  }

  onChange = (e) => {
    this.setState({comment: e.target.value});
  }

  addComment = () => {
    let { post } = this.state
    let user = sessionStorage.getItem('user')
    if (post && user) {
      const { _id, comments } = post
      const { comment } = this.state
      this.setState({ loading: true })
      user = JSON.parse(user)
      const payload = { text: comment, post_id: _id, author: user.id, comments }
      axios.post('/api/comment/', payload)
      .then((res) => {
        this.setState({ post: res.data, comment: '', loading: false })
      });

    } 
  }

  updateComment = () => {
    const { editingCommentId, updatedComment } = this.state
    this.setState({ loading: true })
    axios.put('/api/comment/'+editingCommentId, { text: updatedComment })
      .then((result) => {
        axios.get('/api/post/'+this.props.match.params.id)
        .then(res => {
          this.setState({ post: res.data, editingCommentId: null, updatedComment: '', loading: false });
        });
      });
  }

  render() {
    const { post, comment, editingCommentId, updatedComment, loading } = this.state
    const userString = sessionStorage.getItem('user')
    let user = ''
    if (userString) user = JSON.parse(userString)
    return (
      <div class="container">
        { loading && (<div class="loader-container"><div class="loader"></div></div>) }
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4><Link to="/"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span> HOME </Link></h4>
          </div>
          <div class="panel-body">
            <h3 class="panel-title ml-3 mb-3">
              {this.state.post.title}
            </h3>
            <small>
              {this.state.post.url && (
                  ` (${this.state.post.url})`
              )}
            </small>
            { this.state.post.author && (<div className='d-block float-right post-author'> Author: {this.state.post.author.username} </div>)}
            <div>
              <div className='post-body'>
                <p>
                  {this.state.post.body}
                </p>
              </div>
            </div>
            { post.author && user && post.author._id === user.id && (
              <React.Fragment>
                <Link to={`/edit/${this.state.post._id}`} class="btn btn-success">Edit</Link>&nbsp;
                <button onClick={this.delete.bind(this, this.state.post._id)} class="btn btn-danger">Delete</button>  
              </React.Fragment>
            )}
          </div>
          <div className='panel-body'>
            <h4 className='font-weight-bold'> Comments </h4>
            { user ? (
              <div>
                <textArea class="form-control " name="comment" onChange={this.onChange} cols="80" rows="3">{comment}</textArea>
                <button className='mt-2' onClick={ this.addComment }> Add comment </button>
              </div>
            ) : (
              <p className='mb-2 ml-2'>
                <Link to="/login"> Login </Link> to add a comment
              </p>
            )}
            <div>
              { post.comments && post.comments.length > 0 ? (
                <div>
                  { post.comments.map(comment => {
                    const { author, text, _id, created_date } = comment
                    let postDateTime = ''
                    if (created_date) {
                      postDateTime = Math.floor((new Date().valueOf() - new Date(created_date).valueOf())/3600000)
                      if (postDateTime === 0) {
                        postDateTime = Math.floor((new Date().valueOf() - new Date(created_date).valueOf())/60000)
                        postDateTime = postDateTime === 0 ? 'just now ' : `${ postDateTime } minutes ago`
                      } else if ( postDateTime < 24) postDateTime = `${ postDateTime } hours ago`
                      else {
                        postDateTime = `${Math.floor(postDateTime/24)} days ago`
                      }
                    }
                    return (
                      <div key={_id}>
                        <div className='comment-author'>
                          { `> ${author.username}  - ${ postDateTime }` }
                          { user && author && user.id === author._id  && (
                            <React.Fragment>
                              <button onClick={this.deleteComment.bind(this, _id)} class="btn btn-danger comment-action-btn">Delete</button>  
                              <button onClick={() => { this.setState({ editingCommentId: _id })}} class="btn btn-success comment-action-btn">Edit</button>  
                            </React.Fragment>
                          )}                        
                        </div>
                        { _id === editingCommentId ? (
                          <div>
                            <textArea class="form-control " name="updatedComment" onChange={(e) => this.setState({ updatedComment: e.target.value })} cols="80" rows="3">{updatedComment || text }</textArea>
                            <button className='mt-2' onClick={ this.updateComment }> Update comment </button>
                          </div>
                        ) : (
                          <p> { text }</p>
                        ) }
                      </div>
                    )
                  })}
                </div>
              ) : 'No comments yet'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Show;
