import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import {Tasks} from '../imports/api/db.js';
import {Transactions} from '../imports/api/db.js';

import './templates.html';
Router.route('/',function(){
  this.render('/login');
});
Router.route('/login');
Router.route('/dashboard');
Router.route('/borrow');
Router.route('/signup');


/*Template.dashboard.onCreated(function helloOnCreated() {
  // counter starts at 0


Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});
*/




Template.signup.events({
  'click .signup'(event, instance) {
    var email =document.getElementById("email").value;
    var password =document.getElementById("password").value.toString();

    var registerData = {
          email: email,
          password: password
       }

    Accounts.createUser(registerData, function(error) {
    if (Meteor.user()) {
        console.log(Meteor.userId());
        Router.go('login');
      }

    else {
          console.log("ERROR: " + error.reason);
        }
      });
  },
});

Template.login.events({

  'click .login'(event, instance) {

    var email =document.getElementById("email").value;
    var password =document.getElementById("password").value.toString();

       Meteor.loginWithPassword(email, password, function(error) {

            if (Meteor.user()) {
               console.log(Meteor.userId());
                sessionStorage.setItem("email", email);

                Router.go('/dashboard')
            } else {
               console.log("ERROR: " + error.reason);
            }
         });
  },
})

Template.dashboard.events({
  'click .borrowed'(event, instance) {
    var email=sessionStorage.getItem("email");
    console.log()
    var test=document.getElementsByClassName('borrowed');
    console.log(test[0].value);
      var data = Tasks.find({borrow_id:email }).fetch();
      console.log(data)
      //console.log(data[0]['borrow_id']);

      var display=document.getElementById('display');
      display.innerHTML="";

      var lend_data=document.createElement('table');
      var heading1= document.createElement("TR");
      lend_data.appendChild(heading1);
      var column = document.createElement("TH");
      var bid=document.createTextNode('Borrower Id');
      column.appendChild(bid);
      heading1.appendChild(column);

      var column = document.createElement("TH");
      var amount=document.createTextNode('Requested Amount');
      column.appendChild(amount);
      heading1.appendChild(column);

      var column = document.createElement("TH");
      var lid=document.createTextNode('Lender Id');
      column.appendChild(lid);
      heading1.appendChild(column);

      var column = document.createElement("TH");
      var status=document.createTextNode('Status');
      column.appendChild(status);
      heading1.appendChild(column);


      for(var i=0;i<data.length;i++)
      {


        if(data[i]['lender_id']=="0"){
          console.log("in");
          var row= document.createElement("TR");
          lend_data.appendChild(row);
          var column = document.createElement("TD");
          var bid=document.createTextNode(data[i]['borrow_id']);
          column.appendChild(bid);
          row.appendChild(column);



          var column = document.createElement("TD");
          var amount=document.createTextNode(data[i]['borrow_amount']);
          column.appendChild(amount);
          row.appendChild(column);



          var column = document.createElement("TD");
          var lid = document.createTextNode("NA");
          column.appendChild(lid);
          row.appendChild(column);
          display.appendChild(lend_data);

          var column = document.createElement("TD");
          var status = document.createTextNode("Pending");
          column.appendChild(status);
          row.appendChild(column);
          display.appendChild(lend_data);
        }
        else{
          var row= document.createElement("TR");
          lend_data.appendChild(row);
          var column = document.createElement("TD");
          var bid=document.createTextNode(data[i]['borrow_id']);
          column.appendChild(bid);
          row.appendChild(column);



          var column = document.createElement("TD");
          var amount=document.createTextNode(data[i]['borrow_amount']);
          column.appendChild(amount);
          row.appendChild(column);



          var column = document.createElement("TD");
          var lid = document.createTextNode(data[i]['lender_id']);
          column.appendChild(lid);
          row.appendChild(column);
          display.appendChild(lend_data);

          var column = document.createElement("TD");
          var status = document.createTextNode("Successful");
          column.appendChild(status);
          row.appendChild(column);
          display.appendChild(lend_data);
        }
      }
    //  a.appendChild(b);
      },
      'click .lend'(event, instance) {

      var email=  sessionStorage.getItem("email");
      console.log(email)

        var data = Tasks.find({$and: [{lender_id: "0"},
                            {borrow_id: {$ne:email}}]}).fetch();
        var display=document.getElementById('display');
        display.innerHTML="  ";
          var lend_data=document.createElement('table');
          var heading1= document.createElement("TR");
          lend_data.appendChild(heading1);
          var column = document.createElement("TH");
          var bid=document.createTextNode('Borrower Id');
          column.appendChild(bid);
          heading1.appendChild(column);


          lend_data.appendChild(heading1);
          var column = document.createElement("TH");
          var bid=document.createTextNode('Requested Amount');
          column.appendChild(bid);
          heading1.appendChild(column);

        for(var i=0;i<data.length;i++){
          console.log(data[i]['_id']);

          var row= document.createElement("TR");
          lend_data.appendChild(row);
          var column = document.createElement("TD");
          var bid=document.createTextNode(data[i]['borrow_id']);
          column.appendChild(bid);
          row.appendChild(column);


          lend_data.appendChild(row);
          var column = document.createElement("TD");
          var amount=document.createTextNode(data[i]['borrow_amount']);
          column.appendChild(amount);
          row.appendChild(column);


          lend_data.appendChild(row);
          var column = document.createElement("TD");
          var lend=document.createElement('button');
          var text = document.createTextNode("Lend");
          lend.appendChild(text);
          lend.setAttribute('value',data[i]['_id']);
          lend.setAttribute('class','clend');
          column.appendChild(lend);
          row.appendChild(column);

          display.appendChild(lend_data);
        //  lend_data.innerHTML="Borrower ID:"+data[i]['borrow_id']+"       Amount:"+data[i]['borrow_amount']

        }
        //console.log(data[1]['_id']);
        //  a.appendChild(b);
          },
          'click .clend'(event, instance) {
            if (confirm("Are you sure you want to lend")) {
              var id=event.target.value.toString();

                var email=sessionStorage.getItem("email")

              console.log(event.target.value);
              Tasks.update({'_id':id},{$set:{'lender_id':email}})

              //Tasks.remove(event.target.value);
              Router.go('/dashboard');
              } else {

              }

            },
            'click .lent'(event, instance) {
              var email=sessionStorage.getItem("email");
              var data=Tasks.find({lender_id:email}).fetch();
              console.log(data);
              var display=document.getElementById('display');
              display.innerHTML="  ";
                var lend_data=document.createElement('table');
                var heading1= document.createElement("TR");
                lend_data.appendChild(heading1);
                var column = document.createElement("TH");
                var bid=document.createTextNode('Borrower Id');
                column.appendChild(bid);
                heading1.appendChild(column);


                lend_data.appendChild(heading1);
                var column = document.createElement("TH");
                var bid=document.createTextNode('Requested Amount');
                column.appendChild(bid);
                heading1.appendChild(column);

                for(var i=0;i<data.length;i++){
                  console.log(data[i]['_id']);

                  var row= document.createElement("TR");
                  lend_data.appendChild(row);
                  var column = document.createElement("TD");
                  var bid=document.createTextNode(data[i]['borrow_id']);
                  column.appendChild(bid);
                  row.appendChild(column);


                  lend_data.appendChild(row);
                  var column = document.createElement("TD");
                  var amount=document.createTextNode(data[i]['borrow_amount']);
                  column.appendChild(amount);
                  row.appendChild(column);




                  display.appendChild(lend_data);
          }  },

})

Template.borrow.events({
  'click .test'(event, instance) {
    var amount=document.getElementById('borrow_money').value;
    console.log(amount);
    var email=sessionStorage.getItem("email");
    Tasks.insert({borrow_id:email,borrow_amount:amount,lender_id:"0", createdAt: new Date()});
    Router.go('/dashboard');
  },
})
