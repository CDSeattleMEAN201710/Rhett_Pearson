let users = {
    employees: [
        {'first_name':  'Miguel', 'last_name' : 'Jones'},
        {'first_name' : 'Ernie', 'last_name' : 'Bertson'},
        {'first_name' : 'Nora', 'last_name' : 'Lu'},
        {'first_name' : 'Sally', 'last_name' : 'Barkyoumb'}
    ],
    managers: [
       {'first_name' : 'Lillian', 'last_name' : 'Chambers'},
       {'first_name' : 'Gordon', 'last_name' : 'Poe'}
    ]
 };
let students = [
    {name: 'Remy', cohort: 'Jan'},
    {name: 'Genevieve', cohort: 'March'},
    {name: 'Chuck', cohort: 'Jan'},
    {name: 'Osmund', cohort: 'June'},
    {name: 'Nikki', cohort: 'June'},
    {name: 'Boris', cohort: 'June'}
];

for(var object in students){
  console.log("Name: " + students[object].name + ", Cohort: " + students[object].cohort);
}

console.log('EMPLOYEES');
// console.log(users.employees);
for(var idx in users.employees){
  var count = parseInt(idx) + 1;
  var length = users.employees[idx].last_name + users.employees[idx].first_name;
  console.log(count, '-', users.employees[idx].last_name + ",", users.employees[idx].first_name, "-", length.length);
}
console.log('MANAGERS');
for(var idx in users.managers){
  var count = parseInt(idx) + 1;
  var length = users.managers[idx].last_name + users.managers[idx].first_name;
  console.log(count, '-', users.managers[idx].last_name + ",", users.managers[idx].first_name, "-", length.length);
}
