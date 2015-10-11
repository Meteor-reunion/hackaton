Template.home.events({
  'click .joinGame': function (event) {
    Session.set('gameStart',true);
    Meteor.call('joinGame');
  }
});


Template.home.helpers({
  gameStart : function (){
    return Session.get('gameStart');
  }
});

Template.game.helpers({
  game : function (){
    return Games.findOne({});
  }
});
