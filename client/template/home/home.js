Template.home.events({
  'click .joinGame': function (event) {
    Meteor.call('joinGame')
  }
});
