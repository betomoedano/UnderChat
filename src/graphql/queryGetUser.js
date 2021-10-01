export const queryGetUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
        id
        name
        username
        email
        expoToken
        imageUri
        status
        friends
        chatRoomUser {
          items {
            id
            userID
            chatRoomID
            createdAt
            updatedAt
            chatRoom {
              id
              chatRoomUsers {
                items {
                  user {
                    id
                    name
                    username
                    email
                    expoToken
                    imageUri
                    status
                  }
                }
              }
              lastMessage {
                id
                content
                updatedAt
                user {
                  id
                  name
                }
              }
            }
          }
          nextToken
        }
        createdAt
        updatedAt
      }
    }
  `;