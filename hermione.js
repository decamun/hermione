if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click': function () {

      // increment the counter when Submit button is clicked
      document.getElementById("Submit").onclick = function () { Session.set("counter", Session.get("counter") + 1); };
      
    }
  });



}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

