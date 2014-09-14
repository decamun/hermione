
//create dynamic list of questions

Questions = new Mongo.Collection("questions");
Answered = new Mongo.Collection("answered");

function submit() {
    var questionText = document.getElementById("questionBox").value;
    Questions.insert({text: questionText, upvotes: 1, downvotes: 0, score: 1});
}

if (Meteor.isClient) {



  Session.setDefault("questionsVoted", []);
  Session.setDefault("questionsUpvoted", []);
  Session.setDefault("questionsDownvoted", []);
  Session.setDefault("questionsAnswered", []);

  //runs when someone clicks the button next to the question box
  Template.questionBoxTemplate.events({
    'click #submit': function () {
      // increment the counter when button is clicked
      //alert(document.getElementById("questionBox").value); // "something something";// + counter + " times";
      submit();
    }
  });

  //runs to sort the list of questions and return them somehow <- (magic)
  Template.questionBoardTemplate.questions = function () {
    return Questions.find({}, {sort: {score: -1, text: 1}}); //this is the magic
  };

  //runs to sort the list of questions and return them somehow <- (magic)
  Template.answeredBoardTemplate.answered = function () {
    return Answered.find({}, {sort: {score: -1, text: 1}}); //this is (Still) the magic
  };

  //returns whether this is in Questions.
  Template.questionTemplate.helpers({
    inQuestions: function () {
      return Questions.find(this._id).count() > 0;
    }
  });

  //returns whether or not the question has been voted on before
  Template.questionTemplate.helpers({
    hasVotedUp: function () {

      return Session.get("questionsUpvoted").indexOf(this._id) > -1 ;
    }
  });

Template.questionTemplate.helpers({
    hasVotedDown: function () {
 
      return Session.get("questionsDownvoted").indexOf(this._id) > -1 ;
    }
  });
  
Template.questionTemplate.helpers({
    hasAnswered: function () {
 
      return Session.get("questionsAnswered").indexOf(this._id) > -1 ;
    }
  });

  Template.questionTemplate.events({
    'click #upButton': function () {
      //when the button is clicked or something. Do things here.
      Questions.update(this._id, {$inc: {upvotes: 1}});
      Questions.update(this._id, {$inc: {score: 1}});
      Answered.update(this._id, {$inc: {upvotes: 1}});
      Answered.update(this._id, {$inc: {score: 1}});
      Session.set("questionsUpvoted", Session.get("questionsUpvoted").concat(this._id));

//redundant shit
      var downvotedindex = Session.get("questionsDownvoted").indexOf(this._id);
      if(downvotedindex > -1) {
        Questions.update(this._id, {$inc: {downvotes: -1}});
        Answered.update(this._id, {$inc: {downvotes: -1}});
        Questions.update(this._id, {$inc: {score: 1}});
        Answered.update(this._id, {$inc: {score: 1}});
        var downvotedSet = Session.get("questionsDownvoted");
        downvotedSet.splice(downvotedindex, 1);
        Session.set("questionsDownvoted", downvotedSet);
      }
      //some quick code to uncomment if you want to delete things:
      //Questions.remove(this._id);
      //Answered.remove(this._id);
    }
  });

  Template.questionTemplate.events({
    'click #upButtonVoted': function () {

      //some quick code to uncomment if you want to delete things:
      //Questions.remove(this._id);
      //Answered.remove(this._id);
    }
  });

  Template.questionTemplate.events({
    'click #answeredButton': function () {
      //when the button is clicked or something. Do things here.
      Questions.update(this._id, {$inc: {answered: 1}});
      Answered.update(this._id, {$inc: {answered: 1}});
      //Questions.update(this._id, {$inc: {score: 1}});
      Session.set("questionsAnswered", Session.get("questionsAnswered").concat(this._id));
      //some quick code to uncomment if you want to delete things:
      //Questions.remove(this._id);

      //decide whether question is fully answered
      if(this.answered / this.upvotes > 0.25 && this.answered > 5) {
        Answered.insert(Questions.findOne(this._id));
        Answered.insert({text: "This is an example question. Ask your own question by writing in the box below.", upvotes: 1, downvotes: 0,answered: 0, score: 1});

        Questions.remove(this._id);
      }
    }
  });

  Template.questionTemplate.events({
      'click #downButton': function () {
      //when the button is clicked or something. Do things here.

      //update the score and vote count
      Questions.update(this._id, {$inc: {downvotes: 1}});
      Questions.update(this._id, {$inc: {score: -1}});
      Answered.update(this._id, {$inc: {downvotes: 1}});
      Answered.update(this._id, {$inc: {score: -1}});
      Session.set("questionsDownvoted", Session.get("questionsDownvoted").concat(this._id));


//redundant shit
      var upvotedindex = Session.get("questionsUpvoted").indexOf(this._id);
      if(upvotedindex > -1) {
        Questions.update(this._id, {$inc: {upvotes: -1}});
        Answered.update(this._id, {$inc: {upvotes: -1}});
        Questions.update(this._id, {$inc: {score: -1}});
        Answered.update(this._id, {$inc: {score: -1}});
        var upvotedSet = Session.get("questionsUpvoted");
        upvotedSet.splice(upvotedindex, 1);
        Session.set("questionsUpvoted", upvotedSet);
      }

      //decide whether question is below threshold
      if((this.downvotes / this.upvotes > 1.5) && this.downvotes > 5) {
        Questions.remove(this._id);
      }
    }
  });



  document.onkeydown=function(){
    if(window.event.keyCode=='13'){
        submit();
    }
  }

  

  Template.questionTemplate.events({
    'click div': function () {
      //some quick code to uncomment if you want to delete things:
      //Questions.remove(this._id);
    }
  });

  Template.questionTemplate.events({
    'click img': function () {
      Session.set("questionsVoted", Session.get("questionsVoted").concat(this._id));
    }
  });



}

//run at startup
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if(Questions.find().count < 1) {
      Questions.insert({text: "This is an example question. Ask your own question by writing in the box below.", upvotes: 1, downvotes: 0,answered: 0, score: 1});
    }

    if(Answered.find().count < 1) {
      Answered.insert({text: "This is an example question. Ask your own question by writing in the box below.", upvotes: 1, downvotes: 0,answered: 0, score: 1});
    }
  });
}

