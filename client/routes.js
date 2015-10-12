Router.map(function() {

      this.route("home", {
    	  template: "home",
    	  layoutTemplate: "layout",
        path: '/'
    });

    this.route('signOut', {
        path: '/sign-out',
        layoutTemplate: "layout",
        onBeforeAction: function() {
            AccountsTemplates.logout();
            this.next();
        }
    });


});

Router.configure({
    loadingTemplate: 'loading'
});

Router.plugin('ensureSignedIn', {
    except: ['/','atSignIn', 'atSignUp', 'atForgotPwd','atChangePwd','atResetPwd','atEnrollAccount']
});
