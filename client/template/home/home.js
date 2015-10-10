Template.home.events({
  'click .joinGame': function (event) {
    Meteor.call('joinGame', function(err, game) {
      Session.set('currentGame', game)
    })
  }
});
