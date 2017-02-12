import { Class } from 'meteor/jagi:astronomy';
import { People, Tickets, Debts } from '/libs/collections';

const Person = Class.create({
  name: 'Person',
  secured: false,
  collection: People,
  fields: {
    name: String
  }
});

const Debt = Class.create({
  name: 'Debt',
  secured: false,
  collection: Debts,
  fields: {
    fromPersonId: String,
    toPersonId: String,
    amount: Number,
    paid: {
      type: Boolean,
      default: false
    }
  }
});

const Ticket = Class.create({
  name: 'Ticket',
  secured: false,
  collection: Tickets,
  fields: {
    tag: String,
    price: Number,
    buyerId: String,
    debtsIds: [ String ],
  },
  behaviors: {
    timestamp: {}
  },
  helpers: {
    setPaid(personId, paid) {
      for (const debtId of this.debtsIds) {
        const debt = Debt.findOne(debtId);
        if (debt.fromPersonId == personId) {
          debt.paid = paid;
          debt.save();
        }
      }
    }
  }
});

export { Person, Ticket, Debt };
