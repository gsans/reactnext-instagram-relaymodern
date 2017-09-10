import React, { Component } from 'react'
import ListPage from './ListPage'
import {
  QueryRenderer,
  graphql
} from 'react-relay'
import environment from './Environment'
import { withRouter } from 'react-router-dom'

const ALLPOSTS_QUERY = graphql`
  query AppQuery {
    viewer {
      ...ListPage_viewer
    }
  }`

class AppBase extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={ALLPOSTS_QUERY}
        render={({error, props}) => {
          if (error) {
            return <div>{error.message}</div>
          } else if (props) {
            return <ListPage viewer={props.viewer} />
          }
          return <div>Loading...</div>
        }}
      />
    )
  }
}

export default withRouter(AppBase)
