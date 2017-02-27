/**
 * Created by rawrt on 2/26/2017.
 */

Tasks=new Mongo.Collection('tasks');


if(Meteor.isClient){
  Meteor.subscribe('tasks')

  Template.tasks.helpers({
    tasks:function(){
      return Tasks.find({},{sort:{createdAt:-1}});
    }
  })

  Template.tasks.events({
    "submit .add-task":function(event){
      var name=event.target.name.value;
      Meteor.call('addTask',name)

      event.target.name.value='';
      return false;
    },
    "click .delete-task":function(event){
      if(confirm('Delete Tasks?')){
        Meteor.call('deleteTask',this._id)
      }
    }

  });

}

if(Meteor.isServer){
  Meteor.publish('tasks',function(){
    return Tasks.find({userId:this.userId});
  });

}

Meteor.methods({
  addTask:function(name){
    if(!Meteor.userId()){
      throw new Meteor.Error('GTFO');
    }

    Tasks.insert({
      name:name,
      createdAt:new Date(),
      userId:Meteor.userId()
    });

  },

  deleteTask:function(taskId){
    Tasks.remove(taskId);
  }



})