import React from 'react'
import { withRouter } from 'react-router'
import PostMutation from './PostMutation'
import {
  QueryRenderer,
  graphql
} from 'react-relay'
import environment from './Environment'

const CreatePageQuery = graphql`
  query CreatePageQuery {
    viewer {
      id
    }
  }`

class CreatePage extends React.Component {
  state = {
    description: '',
    imageUrl: '',
  }
  render () {
    return (
      <QueryRenderer
        environment={environment}
        query={CreatePageQuery}
        render={({error, props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return (
              <div className='w-100 pa4 flex justify-center'>
                <div style={{ maxWidth: 400 }} className=''>
                  <input
                    className='w-100 pa3 mv2'
                    value={this.state.description}
                    placeholder='Description'
                    onChange={(e) => this.setState({description: e.target.value})}
                  />
                  <input
                    className='w-100 pa3 mv2'
                    value={this.state.imageUrl}
                    placeholder='Image Url'
                    onChange={(e) => this.setState({imageUrl: e.target.value})}
                  />
                  {this.state.imageUrl &&
                  <img src={this.state.imageUrl} className='w-100 mv3' />
                  }
                  {this.state.description && this.state.imageUrl &&
                  <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={() => this._handlePost(props.viewer.id)}>Post</button>
                  }
                </div>
              </div>
            )
          }
          return <div>Loading...</div>
        }}
      />
    )
  }
  _handlePost = (viewerId) => {
    const {description, imageUrl} = this.state
    PostMutation(description, imageUrl, viewerId, () => this.props.history.push("/"))
  }
}
export default withRouter(CreatePage)