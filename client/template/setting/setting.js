 
  Template.setting.helpers({
  user: function() {
            return Meteor.users.findOne({});
        }
   });
   
