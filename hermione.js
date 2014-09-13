if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 100) ;

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click button': function () {

      // increment the counter when button is clicked
      alert(document.getElementById("questionBox").value); // "something something";// + counter + " times";
      document.getElementById("questionText").innerHTML =  document.getElementById("questionBox").value;
      Session.set("counter", Session.get("counter") + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
