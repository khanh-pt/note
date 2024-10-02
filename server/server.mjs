import http from "http";
import express from "express";
import cors from "cors";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";

const app = express();
const httpServer = http.createServer(app);

const fakeData = {
  users: [
    {
      id: 1,
      name: "user1",
    },
    {
      id: 2,
      name: "user2",
    },
    {
      id: 3,
      name: "user3",
    },
  ],
  notes: [
    {
      id: 1,
      name: "note1",
      user_id: 1,
    },
    {
      id: 2,
      name: "note2",
      user_id: 2,
    },
    {
      id: 3,
      name: "note3",
      user_id: 3,
    },
  ],
};

const typeDefs = `
  type User {
    id: String
    name: String
    notes: [Note]
  }

  type Note {
    id: String
    name: String
    user: User
  }

  type Query {
    user: User
    users: [User]
    note: Note
    notes: [Note]
  }
`;
const resolvers = {
  Query: {
    user: () => {
      return fakeData.users[0];
    },
    users: () => {
      return fakeData.users;
    },
    note: () => {
      return fakeData.notes[0];
    },
    notes: () => {
      return fakeData.notes;
    },
  },
  Note: {
    user: (note) => {
      console.log({ note });
      return fakeData.users.find((user) => user.id === note.user_id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(cors(), bodyParser.json(), expressMiddleware(server));

await new Promise((resolver) => httpServer.listen({ port: 1234 }, resolver));
console.log("Server is running: http://localhost:1234");
