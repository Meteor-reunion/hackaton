Meteor.startup(function() {
  // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
  //Accounts.emailTemplates.from = 'OopsCat <>';
  Accounts.emailTemplates.siteName = 'OopsCat';

  // A Function that takes a user object and returns a String for the subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Confirmez votre adresse Email, ' + user.username;
  };

  // A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'cliquez sur le lien suivant pour vérifier votre adresse e-mail: ' + url;
  };

Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Bienvenue sur Mapphotos, " + user.username;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return "Vous avez été sélectionné pour participer à OopsCat !"
     + " Pour activer votre compte, cliquez simplement sur le lien ci-dessous:\n\n"
     + url;
};

Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Réinitialiser votre mot de passe, " + user.username;
};
Accounts.emailTemplates.resetPassword.text = function (user, url) {
   return "Suivez le lien ci-dessous pour réinitialiser votre mot de passe:\n\n"
     + url;
};

Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Un compte a été créé pour vous sur OopsCat " + user.username;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return "Pour commencer à utiliser le service, il suffit de cliquer sur le lien ci-dessous:\n\n"
     + url;
};

Accounts.emailTemplates.verifyEmail.subject = function (user) {
    return "Vérifier votre adresse e-mail sur OOpsCat" + user.username;
};
Accounts.emailTemplates.verifyEmail.text = function (user, url) {
   return " Pour vérifier votre compte e-mail, cliquez simplement sur le lien ci-dessous:\n\n"
     + url;
};


});
