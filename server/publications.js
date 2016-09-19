import { Meteor } from 'meteor/meteor';
import { Person, Ticket, Debt } from '/libs/models';

Meteor.publish('People', function() {
  return Person.find();
});

Meteor.publish('Person', function(personId) {
  return Person.find({ _id: personId });
})

Meteor.publish('Tickets', function() {
  return Ticket.find();
});

Meteor.publish('Ticket', function(ticketId) {
  return Ticket.find({ _id: ticketId });
})

Meteor.publish('Debts', function() {
  return Debt.find();
});

Meteor.publish('Debt', function(debtId) {
  return Debt.find({ _id: debtId });
})
