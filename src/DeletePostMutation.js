import {
  commitMutation,
  graphql,
} from 'react-relay'
import {ConnectionHandler} from 'relay-runtime'
import environment from './Environment'

const mutation = graphql`
  mutation DeletePostMutation($input: DeletePostInput!) {
    deletePost(input: $input) {
      deletedId
    }
  }
`

export default (postId, viewerId) => {
  const variables = {
    input: {
      id: postId,
      clientMutationId: ""
    },
  }
  commitMutation(
    environment,
    {
      mutation,
      variables,
      onError: err => console.error(err),
      updater: (store) => {
        const deletePostField = store.getRootField('deletePost')
        const deletedId = deletePostField.getValue('deletedId')
        const viewer = store.get(viewerId)
        const connection = ConnectionHandler.getConnection(viewer, 'ListPage_allPosts')
        if (connection) {
          ConnectionHandler.deleteNode(connection, deletedId)
        }
      },
      optimisticUpdater: (store) => {
        const viewer = store.get(viewerId)
        const connection = ConnectionHandler.getConnection(viewer, 'ListPage_allPosts')
        if (connection) {
          ConnectionHandler.deleteNode(connection, postId)
        }
      },
    },
  )
}