Template.home.events({
  'click .joinGame': function (event) {
    Meteor.call('joinGame')
  }
});

Template.game.helpers({
  game : function (){
    return Games.findOne({}).bullets;
  }
});
