/*Meteor._reload.onMigrate(function() {
  return [false];
});*/

kickSound = new Blaze.ReactiveVar(null)
poopSound = new Blaze.ReactiveVar(null)

Meteor.startup(function () {

  language = window.navigator.userLanguage || window.navigator.language;
   //console.log(language);
   if (language.indexOf('-') !== -1)
      language = language.split('-')[0];

  if (language.indexOf('_') !== -1)
      language = language.split('_')[0];

    Session.set("showLoadingIndicator", true);
    Session.setDefault("currentGame", false);

T9n.setLanguage(language);
Helpers.setLanguage(language);
    TAPi18n.setLanguage(language)
      .done(function () {
        Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });


      if (Meteor.userId()) {
;

    }

function userName() {
    return Meteor.user().username || Meteor.user().profile.name;
}

Template.registerHelper('langChoix',
function() {
    return Helpers.language();
  }
);

Handlebars.registerHelper('key_value', function(context, options) {
  var result = [];
  _.each(context, function(value, key, list){
    result.push({key:key, value:value});
  })
  return result;
});

});





Tracker.autorun(function() {
    if (Reload.isWaitingForResume()) {
        alert("Fermer et ré-ouvrir cette application pour obtenir la nouvelle version!");
    }
});

Tracker.autorun(function() {
  if (Session.get('currentGame')) {
    Meteor.subscribe('game', Session.get('currentGame'));
  }
});
