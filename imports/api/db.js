import { Mongo } from 'meteor/mongo';

export const Tasks = new Mongo.Collection('tasks');

export const Transactions = new Mongo.Collection('transactions');
