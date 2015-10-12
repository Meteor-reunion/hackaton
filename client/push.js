Meteor.startup(function () {

	if (Meteor.isCordova) {
		window.alert = navigator.notification.alert;
	}

 /*Push.addListener('startup', function(notification) {

  if(notification.payload.pushType === 'startGame'){
    Router.go('startGame', {
     commandeId: notification.payload.gameId
    });
  }
  else if(notification.payload.pushType === 'endGame'){
    //offreDetail n'existe pas encore
    //il faudra recupere restoId pour que  le panier fonctionne session.set()
    Router.go('endGame', {
     _id: notification.payload.gameId
    });
  }
   else if(notification.payload.pushType === 'interest'){
    alert('not implemented yet');
  }
});

Push.addListener('message', function(notification) {
		// Called on every message
		function alertDismissed() {
 if(notification.payload.pushType === 'startGame'){
    Router.go('startGame', {
      commandeId: notification.payload.gameId
    });
  }else if(notification.payload.pushType === 'endGame'){
    Router.go('endGame', {
     _id: notification.payload.gameId
    });
  }
		}
		window.alert(notification.message, alertDismissed, notification.payload.title, "Ok");
	});
	*/
});
