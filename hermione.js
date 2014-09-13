
//create dynamic list of questions

Questions = new Mongo.Collection("questions");

if (Meteor.isClient) {
<<<<<<< HEAD
  // counter starts at 0
  Session.setDefault("counter", 0);
=======
  //runs when someone clicks the button next to the question box
  Template.questionBoxTemplate.events({
    'click button': function () {
      // increment the counter when button is clicked
      //alert(document.getElementById("questionBox").value); // "something something";// + counter + " times";
      var questionText = document.getElementById("questionBox").value;
      Questions.insert({text: questionText, upvotes: 1, downvotes: 0, score: 1});
    }
  });

  //runs to sort the list of questions and return them somehow <- (magic)
  Template.questionBoardTemplate.questions = function () {
    return Questions.find({}, {sort: {score: -1, text: 1}}); //this is the magic
  };
>>>>>>> FETCH_HEAD

  Template.questionTemplate.events({
      'click #upButton': function () {
      //when the button is clicked or something. Do things here.
      Questions.update(this._id, {$inc: {upvotes: 1}});
      Questions.update(this._id, {$inc: {score: 1}});

      //some quick code to uncomment if you want to delete things:
      //Questions.remove(this._id);
    }
  });

<<<<<<< HEAD
  Template.hello.events({
    'click': function () {

      // increment the counter when Submit button is clicked
      document.getElementById("Submit").onclick = function () { Session.set("counter", Session.get("counter") + 1); };
      
=======
  Template.questionTemplate.events({
      'click #downButton': function () {
      //when the button is clicked or something. Do things here.

      //update the score and vote count
      Questions.update(this._id, {$inc: {downvotes: 1}});
      Questions.update(this._id, {$inc: {score: -1}});

      //decide whether question is below threshold
      if((this.downvotes / this.upvotes > 1.5) && this.downvotes > 5) {
        Questions.remove(this._id);
      }


      //some quick code to uncomment if you want to delete things:
      //Questions.remove(this._id);
>>>>>>> FETCH_HEAD
    }
  });



}

//run at startup
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if(Questions.find().count === 0) {
      Questions.insert({text: "This is an example question. Ask your own question by writing in the box below.", upvotes: 1, downvotes: 0, score: 1});
    }
  });
}

