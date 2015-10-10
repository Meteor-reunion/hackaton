Meteor.publish(null, function (){
  return Meteor.roles.find({})
})

Meteor.publish('singleUser', function() {
	if (!this.userId) {
   return;
    }
    return Meteor.users.find({
        _id: this.userId
    }, {
        fields: {
            'profile': 1,
            'username': 1,
            'services.facebook.id': 1,
            'emailHash': 1,
            'emails': 1,
        }
    });
});
