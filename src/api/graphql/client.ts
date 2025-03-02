import { GraphQLClient } from "graphql-request";

const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT}/graphql`;
export const client = new GraphQLClient(endpoint);