import {
  commitMutation,
  graphql,
} from 'react-relay'
import {ConnectionHandler} from 'relay-runtime'
import environment from './Environment'

let tempID = 0

const mutation = graphql`
  mutation PostMutation($input: CreatePostInput!) {
    createPost(input: $input) {
      post {
        id
        description
        imageUrl
      }
    }
  }
`

export default (description, imageUrl, viewerId, callback) => {
  
  const variables = {
    input: {
      description,
      imageUrl,
      clientMutationId: ""
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      
      optimisticUpdater: (store) => {
        const id = 'client:newPost:' + tempID++
        const newPost = store.create(id, 'Post')
        newPost.setValue(id, 'id')
        newPost.setValue(description, 'description')
        newPost.setValue(imageUrl, 'imageUrl')
        
        const viewer = store.get(viewerId)
        const connection = ConnectionHandler.getConnection(viewer, 'ListPage_allPosts')
        if (connection) {
          ConnectionHandler.insertEdgeAfter(connection, newPost)
        }
      },
      updater: (store) => {
        
        const createPostField = store.getRootField('createPost')
        const newPost = createPostField.getLinkedRecord('post')
        
        const viewer = store.get(viewerId)
        const connection = ConnectionHandler.getConnection(viewer, 'ListPage_allPosts')
        if (connection) {
          ConnectionHandler.insertEdgeAfter(connection, newPost)
        }
      },
      
      onCompleted: () => {
        callback()
      },
      onError: err => console.error(err),
    },
  )
}