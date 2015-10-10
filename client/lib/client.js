/*Meteor._reload.onMigrate(function() {
  return [false];
});*/

getUserLanguage = function () {
  // Put here the logic for determining the user language
  return "fr";
};

Meteor.startup(function () {


    Session.set("showLoadingIndicator", true);

    TAPi18n.setLanguage(getUserLanguage())
      .done(function () {
        Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });


      if (Meteor.userId()) {



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
