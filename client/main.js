import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Person, Ticket, Debt } from '/libs/models';

import './main.html';

Template.debtStatus.onCreated(function debtStatusOnCreated() {
  this.subs = {}
  this.subs.tickets = this.subscribe('Tickets');
  this.subs.people = this.subscribe('People');
  this.subs.debts = this.subscribe('Debts');
});

Template.debtStatus.helpers({
  people() {
    return Person.find();
  }
});

Template.debtStatusRow.onCreated(function debtStatusRowOnCreated() {
  this.debts = new ReactiveVar([]);
  this.debt = new ReactiveVar(0);
  const from = Template.currentData()._id;
  const to = Template.parentData()._id;
  this.autorun(() => {
    let totalDebt = 0;
    const newDebts = [];

    let debts = Debt.find({ fromPersonId: from , toPersonId: to, paid: false }).fetch();
    for (const debt of debts) {
      newDebts.push(debt);
      totalDebt += debt.amount;
    }
    debts = Debt.find({ fromPersonId: to, toPersonId: from, paid: false }).fetch();
    for (const debt of debts) {
      newDebts.push(debt);
      totalDebt -= debt.amount;
    }
    this.debt.set(totalDebt);
    this.debts.set(newDebts)
  })
});

Template.debtStatusRow.helpers({
  isDebtPositive() {
    return Template.instance().debt.get() > 0;
  },
  debt() {
    return Template.instance().debt.get().toFixed(2);
  }
});

Template.debtStatusRow.events({
  'change .checkbox input'(event, template) {
    if (confirm("U sure?")) {
      for (debt of template.debts.get()) {
        debt.paid = true;
        debt.save();
      }
    }
  }
});

Template.addTicket.onCreated(function addTicketOnCreated() {
  this.subs = {}
  this.subs.people = this.subscribe('People');
});

Template.addTicket.onRendered(function addTicketOnRendered() {
  $('#create-ticket-form').form({
    fields: {
      tag: 'empty',
      buyerId: 'empty',
      ownersIds: 'empty',
      price: 'number'
    }
  })
});

Template.addTicket.events({
  'submit #create-ticket-form'(event, instance) {
    event.preventDefault();
    const tag = $('#tag-input').val();
    const buyerId = $('#buyer-id-input').val();
    const price = parseFloat($('#price-input').val());
    const ownersIds = $('#owners-ids-select').val();
    const debtsIds = [];
    for (const personId of ownersIds) {
      if (personId != buyerId) {
        const amount = parseFloat(price/ownersIds.length);
        const debt = new Debt({ fromPersonId: personId, toPersonId: buyerId, amount });
        debtsIds.push(debt.save());
      }
    }
    const ticket = new Ticket({ tag, buyerId, debtsIds, price })
    ticket.save();
    $('#create-ticket-form').form('reset')
  }
});

Template.buyerDropdown.onCreated(function buyerDropdownOnCreated() {
  this.subs = {}
  this.subs.people = this.subscribe('People');
});

Template.buyerDropdown.onRendered(function buyerDropdownOnRendered() {
  $('#buyer-dropdown').dropdown();
});

Template.buyerDropdown.helpers({
  people() {
    return Person.find();
  }
});

Template.ownersDropdown.onCreated(function ownersDropdownOnCreated() {
  this.subs = {}
  this.subs.people = this.subscribe('People');
});

Template.ownersDropdown.onRendered(function ownersDropdownOnRendered() {
  $('#owners-ids-select').dropdown();
});

Template.ownersDropdown.helpers({
  people() {
    return Person.find();
  }
});

Template.ticketList.onCreated(function ticketListOnCreated() {
  this.subs = {}
  this.subs.tickets = this.subscribe('Tickets');
});

Template.ticketList.helpers({
  tickets() {
    return Ticket.find({}, { sort: { createdAt: -1 } });
  }
});

Template.ticket.onCreated(function ticketOnCreated() {
  this.ticketId = Template.currentData()._id;
  this.subs = {}
  this.subs.ticket = this.subscribe('Ticket', this.ticketId);
  this.subs.debts = this.subscribe('Debts');
  this.subs.people = this.subscribe('People');
  this.autorun(() => this.ticket = Ticket.findOne(this.ticketId));
});

Template.ticket.onRendered(function ticketOnRendered() {
  $(this.find('.checkbox')).checkbox();
})

Template.ticket.helpers({
  name(personId) {
    const person = Person.findOne(personId);
    return person == null ? "" : person.name;
  },
  debts() {
    debts = Debt.find({ _id: { $in: this.debtsIds } }).fetch();
    return debts;
  },
  amount() {
    return this.amount.toFixed(2);
  }
});

Template.ticket.events({
  'change .checkbox input'(event, template) {
    template.ticket.setPaid(this.fromPersonId,
      $(event.currentTarget).closest('.checkbox').checkbox('is checked'));
  },
  'click .trash.icon'(event, template) {
    if (confirm('U sure?')) {
      for (debtId of template.ticket.debtsIds) {
        debt = Debt.findOne(debtId);
        debt.remove();
      }
      template.ticket.remove();
    }
  }
});
