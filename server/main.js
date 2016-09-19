import { Meteor } from 'meteor/meteor';
import { Person } from '/libs/models';

Meteor.startup(() => {
  if (Person.find().count() == 0) {
    const people = [
      new Person({ _id: '2F4Gw9N7SWftx5oHy', name: 'Ian' }),
      new Person({ _id: 'y3FujAQptsdQuXwic', name: 'Ferran' }),
      new Person({ _id: 'Deroh47rn5SbuBp7c', name: 'Oriol' })
    ];
    for (const person of people) {
      person.save();
    }
  }
});
