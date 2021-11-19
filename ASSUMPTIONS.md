# Basic assumptions
Both the views are be accessible to all the employees. Assuming that they are able to 
## Admin View
  - Should be able add/update/delete an employee.
  - Should be able to assign other employees for review.
  - Should have the ability to review the employees assigned to him for review.

## Employee View
  - Should be able to view and provide feedback to his own reviews which are provided by other employees.


# Modules:
## Admin
- Has access to employees page to add/edit/delete employees.
- Has access to assign employees to review another employee.
- Will have access to Employee module also.

## Employee
- Can rate reviews for employees assigned to him/her.
- Can submit feedback on his own reviews reviewed by other employees.


# Other
- JWT can be used for authentication.
- Multiple logins of same user is possible.
- Both the server side and client side should provide role based authorization.