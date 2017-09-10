import {
  graphql,
  requestSubscription
} from 'react-relay'
import environment from './Environment'
const {ConnectionHandler} = require('relay-runtime');
//(filter: { mutation_in: [CREATED OR UPDATED OR DELETED] })
const newPostSubscription = graphql`
  subscription NewPostSubscription {
    Post {
      mutation
      node {
        id description imageUrl   
      }
      previousValues {
        id
      }
    }
  }
`

export default () => {
  const subscriptionConfig = {
    subscription: newPostSubscription,
    variables: {},
    onNext: (response) => {
      debugger;
    },
    updater: (store) => {
      debugger
      const postField = store.getRootField('Post')
      const newPost = postField.getLinkedRecord('node')
      const mutationType = postField.getValue('mutation')

      switch(mutationType) {
        case 'CREATED': 
          const viewer = store.getRoot().getLinkedRecord('viewer');
          const allPosts =
            ConnectionHandler.getConnection(viewer, 'ListPage_allPosts');
          const edge = ConnectionHandler.createEdge(
            store,
            allPosts,
            newPost,
            '<TypeOfNotificationsEdge>',
          );
          ConnectionHandler.insertEdgeBefore(allPosts, edge);
          break;
        case 'UPDATED': 
          const postId = newPost.getValue('id')
          const postDescription = newPost.getValue('description')
          const postImageUrl = newPost.getValue('imageUrl')
          const post = store.get(postId)
          if (post){
            post.setValue(postDescription, 'description')
            post.setValue(postImageUrl, 'imageUrl')
          }
          break;
        case 'DELETED': 
          const previousPostId = postField
            .getLinkedRecord('previousValues')
            .getValue('id');
          if (previousPostId) {
            const viewer = store.getRoot().getLinkedRecord('viewer');
            const allPosts =
              ConnectionHandler.getConnection(viewer, 'ListPage_allPosts');
            ConnectionHandler.deleteNode(allPosts, previousPostId)
          }
          break;
        default: break;
      }

    }, 
    onError: error => console.log(`An error occured:`, error)
  }

  requestSubscription(
    environment,
    subscriptionConfig
  )
}