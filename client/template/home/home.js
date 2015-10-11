Template.home.events({
  'click .joinGame': function (event) {
    Meteor.call('joinGame', function(err, game) {
      Session.set('currentGame', game)
    })
  }
});


Template.home.helpers({
  currentGame : function (){
    return Session.get('currentGame');
  }
});

Template.game.helpers({
  game : function (){
    return Games.findOne({});
  }
});

Template.game.events({
  'click .bullet': function (event) {
    Meteor.call('sendPosition', Session.get('currentGame'), $(event.target).attr('data-position'))
  }
});
