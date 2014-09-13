
//create dynamic list of questions

Questions = new Mongo.Collection("questions");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 100) ;

  //this returns the number of times something has been clicked
  Template.questionBoxTemplate.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });


  //runs when someone clicks the button next to the question box
  Template.questionBoxTemplate.events({
    'click button': function () {
      // increment the counter when button is clicked
      //alert(document.getElementById("questionBox").value); // "something something";// + counter + " times";
      var questionText = document.getElementById("questionBox").value;
      Questions.insert({text: questionText, upvotes: 1});
      Session.set("counter", Session.get("counter") + 1);
    }
  });

  //runs to sort the list of questions and return them somehow <- (magic)
  Template.questionBoardTemplate.questions = function () {
    return Questions.find({}, {sort: {text: -1, upvotes: 1}}); //this is the magic
  };

  Template.questionTemplate.events({
    'click button': function () {
      //when the button is clicked or something. Do things here.
      Questions.update(this._id, {$inc: {upvotes: 1}})


      //some quick code to uncomment if you want to delete things:
      //Questions.remove(this._id);
    }
  });
}

//run at startup
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Questions.insert({text: "Lorem ipsem blah blah blah", upvotes: 1});
  });
}
