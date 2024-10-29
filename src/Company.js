//company class
//hold a list of users

import User from './User';

class Company {
    constructor() {
        this.users = [];    //create an empty array 
    }

    addUser(user) {
        if (user instanceof User) {
            this.users.push(user);  //add a user to the array
        } else {
            throw new Error('Invalid user object. Must be an instance of User class.');
        }
    }
}