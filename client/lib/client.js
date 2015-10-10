/*Meteor._reload.onMigrate(function() {
  return [false];
});*/



Meteor.startup(function () {

  language = window.navigator.userLanguage || window.navigator.language;
   //console.log(language);
   if (language.indexOf('-') !== -1)
      language = language.split('-')[0];

  if (language.indexOf('_') !== -1)
      language = language.split('_')[0];

    Session.set("showLoadingIndicator", true);

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

});





Tracker.autorun(function() {
    if (Reload.isWaitingForResume()) {
        alert("Fermer et ré-ouvrir cette application pour obtenir la nouvelle version!");
    }
});
Tracker.autorun(function() {
Meteor.subscribe('game');
});
