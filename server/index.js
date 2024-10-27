const express = require('express');
const { ApolloServer } = require('@apollo/server');
const bodyParser = require('body-parser');
const cors = require('cors');
const { expressMiddleware } = require('@apollo/server/express4');
const axios = require('axios');

async function startServer(){
    const app = express();
    const server = new ApolloServer({
        typeDefs:`
            type User{
                id : ID!
                name: String!
                username : String!
                email: String!
                phone : String!
                website : String!
            }
            type Todo{
                id : ID!
                title: String!
                completed: Boolean!
                user : User
            }
            type Query{
                gettodos: [Todo]
                getallusers : [User]
                getuser(id : ID!) : User
            }
        `,
        resolvers: {
            Todo : {
                user : async(todo)=>{
                    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`);
                    return response.data;
                }
            },
            Query : {
                gettodos: async() => {
                    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/');
                    return response.data;
                },
                getallusers: async() => {
                    const response = await axios.get('https://jsonplaceholder.typicode.com/users/');
                    return response.data;
                },
                getuser: async(parent, {id}) => {
                    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
                    return response.data;
                }
            }
        }
    }); //instance of ApolloServer

    //middleware 
    app.use(bodyParser.json());
    app.use(cors());
    
    await server.start(); //starting ApolloServer

    app.use('/graphql', expressMiddleware(server));

    app.listen({ port: 8080 }, () => {
        console.log(`Server ready at http://localhost:4000`);
    });
}

startServer();