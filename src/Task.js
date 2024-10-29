// class task

class Task{
    constructor({data, duedate}){
        this.data = data;
        this.duedate = duedate;
    }

    getDueDate(){
        return this.duedate;
    }

    getTask(){
        return this.data;
    }
}


/*
const task1 = new Task({
  data: "Buy groceries",
  duedate: new Date(2024, 10, 31), // Example due date
});

console.log(task1.getTask());  // Output: "Buy groceries"
console.log(task1.getDueDate()); // Output: The date object for October 31st, 2024
*/