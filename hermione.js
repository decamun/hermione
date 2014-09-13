
//create dynamic list of questions

Questions = new Mongo.Collection("questions");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 100) ;

  Template.questionBoxTemplate.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.questionBoxTemplate.events({
    'click button': function () {

      // increment the counter when button is clicked
      //alert(document.getElementById("questionBox").value); // "something something";// + counter + " times";
      var questionText = document.getElementById("questionBox").value;
      Questions.insert({text: "" + questionText, upvotes: 1});
      Session.set("counter", Session.get("counter") + 1);
    }
  });


  Template.questionBoardTemplate.questions = function () {
    return Questions.find({}, {sort: {text: -1, upvotes: 1}});
  };

  Template.questionTemplate.events({
    'click button': function () {
      //when the button is clicked or something. Do things here
    }
  });

  // Template.questionTemplate.text = function() {
  //   //return the text for current question
  //   return "fuck";
  // };

  // Template.questionTemplate.upvotes = function() {
  //   //return the number of upvotes for current question
  //   return -3;
  // };
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Questions.insert({text: "Lorem ipsem blah blah blah", upvotes: 1});
  });
}
