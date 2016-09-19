import { Mongo } from 'meteor/mongo';

export const People = new Mongo.Collection('People');
export const Tickets = new Mongo.Collection('Tickets');
export const Debts = new Mongo.Collection('Debts');
