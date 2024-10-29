// File: User.js
// class: User

class User {
    constructor({
      email,
      password,
      firstName,
      lastName,
      age,
      phoneNumber,
      isSup = false     //Is suppervisor?
    }) {
      // Basic info
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.age = age;
      this.phoneNumber = phoneNumber;
      this.password = password;
      // Account info
      this.isSup = isSup;
    }

    // Getter methods
    getFullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  
    getAge() {
      return this.age;
    }
  
    // Setter methods
    updateContactInfo({ email, phoneNumber }) {
      if (email) this.email = email;
      if (phoneNumber) this.phoneNumber = phoneNumber;
    }
  
    // Utility methods
    toJSON() {
      return {
        username: this.username,
        email: this.email,
        fullName: this.getFullName(),
        age: this.age,
        phoneNumber: this.phoneNumber,
        isSup: this.isSup,
      };
    }

  }
  
  /*
  // Example usage (you can put this in app.js):
  const user = new User({
    email: 'john.doe@example.com',
    password: 'ABC123DEF'
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    phoneNumber: '+1-555-555-5555',
    isSup: false
  }); 
  */
  