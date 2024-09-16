import { Component,ViewEncapsulation , OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
 
})
export class UserManagementComponent implements OnInit {

  cookieValue:any

  constructor(private cookieService:CookieService){}

  userId = 0
  userName = '';
  passWord = '';
  confrimPassword = '';
  errorMessage = ""
  userRole = 'User';
  userRoleOCstate = false;
  userPermissionOCstate = false;
  passwordState = false;
  confrimPasswordState = false;
  passwordType = 'password';
  confrimPasswordType = 'password'
  userCreatePopUp = false;
  deleteUserOCstate = false
  userCredentialsTemplate: any = {};
  user: any
  deleteUserName = "";
  passwordView = "SHOW"
  confrimPasswordView = "SHOW"
  deleteUserRole = ""



  ngOnInit(): void {
    try {
      this.cookieValue = JSON.parse(this.cookieService.get("_user"));
    } catch (error) {
      console.error("Error parsing cookie:", error);
      this.cookieValue = null;
    }
    this.fetchUsers();
  }

  userPermissionState = [
    [
     false, false, false, false, false //index = 0 MAPS =[isAvail, Create, Edit Delete, View]
    ],
    [
      false, false, false, false, false //index = 1 MISSION =[isAvail, Create, Edit Delete, View]
    ],
    [
      false, false, false, false, false //index = 2 TRANSITION =[isAvail, Create, Edit Delete, View]
    ],
    [
      false, false, false, false, false //index = 3 PATH =[isAvail, Create, Edit Delete, View]
    ]
  ]

  userPermissionOptions = [
    {
      order:0,
      nameTag: "MAPS",
      isAvail: 0,
      create: 1,
      edit: 2,
      delete: 3,
      view: 4
    },
    {
      order:1,
      nameTag: "MISSION",
      isAvail: 0,
      create: 1,
      edit: 2,
      delete: 3,
      view: 4
    },{
      order:2,
      nameTag: "TRANSITION",
      isAvail: 0,
      create: 1,
      edit: 2,
      delete: 3,
      view: 4
    },{
      order:3,
      nameTag: "PATHS",
      isAvail: 0,
      create: 1,
      edit: 2,
      delete: 3,
      view: 4
    },
  ]

  userRoleCredentials = [
    {
      order: 0,
      userRole: 'User',
      nameTag: 'USER'
    },
    {
      order: 1,
      userRole: 'Administrator',
      nameTag: 'ADMIN'
    },
    {
      order: 2,
      userRole: 'Maintainer',
      nameTag: 'MAINTAINER'
    }
  ];

  userCredentials: any[] = [{
    userName : 'SaiBala',
    userRole : 'ADMIN',
    createdBy : 'SaiBala',
    createdOn : new Date().toDateString()
  }];  // Initialized as an empty array

  userPermissionStateFn(order:number,option:number) {
    this.userPermissionState[order][option]
  }

  resetPassword() {
    this.passwordState = false
    this.confrimPasswordState = false
    this.passwordType = "password"
    this.confrimPasswordType = "password";
    this.passwordView = "SHOW"
    this.confrimPasswordView = "SHOW"
  }

  //fetch the user details from the database
  fetchUsers(): void {
    fetch(`http://${environment.API_URL}:${environment.PORT}/api/users`)
      .then(response => response.json())
      .then((users: any[]) => {
        this.userCredentials = users.map(user => {
          const dateString = user.createdOn;

          // Split the dateString into date and time parts
          const [datePart, timePart] = dateString.split(' ');

          // Split the date part into day, month, and year
          const [day, month, year] = datePart.split(':').map(Number);

          // Split the time part into hours and minutes
          const [hours, minutes] = timePart.split(':').map(Number);

          // Construct a new Date object
          const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

          // Format the date
          const formattedDay = String(date.getUTCDate()).padStart(2, '0');
          const formattedMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
          const formattedYear = date.getUTCFullYear();
          const formattedHours = String(date.getUTCHours()).padStart(2, '0');
          const formattedMinutes = String(date.getUTCMinutes()).padStart(2, '0');
          const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear} ${formattedHours}:${formattedMinutes}`;


          return {
            userId: user._id, // Assuming MongoDB `_id` is used as userId
            userName: user.username,
            userRole: user.role,
            createdBy: user.createdBy, // Fetch createdBy from the response
            createdOn: formattedDate // Format createdOn date
          };
        });
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }

  validatePassword(password: string): string {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!/[@$!%*?&]/.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return '';
  }

  createUser() {
    console.log(this.passwordState, this.confrimPasswordState)
    this.resetPassword()
    if (this.userName === '') {
      this.errorMessage = '*Username is not entered';
      setTimeout(()=>{
        this.errorMessage = ""
      },4000)
      return;
    } else if (this.passWord === '') {
      this.errorMessage = '*Password is not entered';
      setTimeout(()=>{
        this.errorMessage = ""
      },4000)
      return;
    } else if (this.confrimPassword === '') {
      this.errorMessage = '*Confirm password is not entered';
      setTimeout(()=>{
        this.errorMessage = ""
      },4000)
      return;
    } else if (this.passWord !== this.confrimPassword) {
      this.errorMessage = '*Password mismatch';
      setTimeout(()=>{
        this.errorMessage = ""
      },4000)
      return;
    }

    const passwordValidationMessage = this.validatePassword(this.passWord);
    if (passwordValidationMessage) {
      this.errorMessage = passwordValidationMessage;
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }

    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);

    this.userId += 1; // Increment userId

    const cookieValue = this.cookieService.get("_user");
    let user = "Unknown"; // Default to "Unknown" if cookie is not found

    try {
      if (cookieValue) {
        const parsedCookie = JSON.parse(cookieValue);
        user = parsedCookie.name || "Unknown"; // Use `name` for username
      }
    } catch (e) {
      console.error('Error parsing cookie:', e);
    }

    // Prepare the new user object
    const newUser = {
      userId: 1, //this.userId - 1
      username: "Sai Bala", // this.userName
      password: '123', //this.passWord
      role: 'USER', //this.userRole
      createdBy: 'Sai Bala', // Replace with actual user if applicable
      createdAt: new Date().toISOString() // Or use any other date format
    };

    console.log('Creating user with:', newUser);
    this.userCreatePopUpOpen();
    return;

    // Send POST request to backend
    fetch(`http://${environment.API_URL}:${environment.PORT}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw new Error(error.error || 'Failed to create user');
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('User created successfully:', data);

        // Fetch updated user list after successful creation
        this.fetchUsers();

        // Reset form fields
        this.userName = '';
        this.passWord = '';
        this.confrimPassword = '';
        this.userRole = 'User';
        // Close create user popup
        this.userCreatePopUpOpen();
      })
      .catch(error => {
        console.error('Error creating user:', error);
        this.errorMessage = error.message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      });
  }

  //Deleting the user credentials from the database
  deleteUser(username: any, userRole:any) {
    let findingAdmin = this.userCredentials.filter((user)=> user.userRole === "Administrator")
    console.log("Delete User =>>>",findingAdmin);


    if(findingAdmin.length <= 1 && userRole === "Administrator"){
      alert("Should have atleast one admin")
      this.deleteUserPopUp()
      return
    }
    console.log("DELETE:", username);  // Log the username to delete
    const userToDelete = this.userCredentials.find(user => username === user.userName);
    console.log(userToDelete);  // Log the user object to delete

    if (!userToDelete) {
      console.error('User not found for deletion:', username);
      return;
    }

    console.log(`Sending DELETE request to: http://${environment.API_URL}:${environment.PORT}/api/users/${username}`);

    fetch(`http://${environment.API_URL}:${environment.PORT}/api/users/${username}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Response from server:', response); // Log the response from the server
      if (!response.ok) {
        throw new Error(`Failed to delete user (${response.status} ${response.statusText})`);
      }
      console.log('Deleted user with username:', username);

      // Remove the user from the local list
      this.userCredentials = this.userCredentials.filter(user => user.userName !== username);
      console.log('Updated users after deletion:', this.userCredentials);
    })
    .catch(error => {
      console.error('Error deleting user:', error);
    });

    this.deleteUserName = "";
    this.deleteUserPopUp();
  }

  getDeleteUser(userName: any, userRole:any) {
    this.deleteUserName = userName
    this.deleteUserRole = userRole
    console.log(this.deleteUserName)
    this.deleteUserPopUp()
  }

  changeUserRole(order: number) {
    this.userRole = this.userRoleCredentials[order].userRole;
  }

  userRoleChange() {
    this.userRoleOCstate = !this.userRoleOCstate;
  }

  showPassword() {
    this.passwordState = !this.passwordState;
    this.passwordType = this.passwordState ? 'text' : 'password';
    this.passwordView = this.passwordState ? 'HIDE' : 'SHOW'
    console.log("PASS State: ",this.passwordState)
  }

  showConfrimPassword() {
    this.confrimPasswordState = !this.confrimPasswordState;
    this.confrimPasswordType = this.confrimPasswordState ? 'text' : 'password';
    this.confrimPasswordView = this.confrimPasswordState ? 'HIDE' : 'SHOW'
    console.log("CPASS State: ",this.confrimPasswordState)
  }

  userCreatePopUpOpen() {
    this.userRoleOCstate =false
    this.userCreatePopUp = !this.userCreatePopUp;
    this.errorMessage = ""
    this.userName = '';
    this.passWord = '';
    this.confrimPassword = '';
    this.userRole = 'User';
    this.resetPassword()
    console.log(this.passwordState, this.confrimPasswordState)
  }

  userPermissionPopUpOpen(username: string) {
    this.user = this.userCredentials.find(user => username === user.userName);

    if (this.user) {
      console.log("User found:", this.user.userName);
      // Fetch user permissions and update the state
      this.fetchUserPermissions(this.user.userName);
      this.userPermissionOCstate = !this.userPermissionOCstate;
    } else {
      console.error("User not found:", username);
    }
  }
  fetchUserPermissions(username: string) {
    fetch(`http://${environment.API_URL}:${environment.PORT}/api/users/${username}/permissions`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user permissions');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched user permissions:', data);
        // Update the local permission state
        this.userPermissionState = [
          [data.permissions.maps.enable, data.permissions.maps.create, data.permissions.maps.edit, data.permissions.maps.delete, data.permissions.maps.view],
          [data.permissions.mission.enable, data.permissions.mission.create, data.permissions.mission.edit, data.permissions.mission.delete, data.permissions.mission.view],
          [data.permissions.transition.enable, data.permissions.transition.create, data.permissions.transition.edit, data.permissions.transition.delete, data.permissions.transition.view],
          [data.permissions.paths.enable, data.permissions.paths.create, data.permissions.paths.edit, data.permissions.paths.delete, data.permissions.paths.view]
        ];
      })
      .catch(error => {
        console.error('Error fetching user permissions:', error);
      });
  }

  userPermissionPopUpClose(){
    this.userPermissionOCstate = !this.userPermissionOCstate
  }

  changeUserPermission(option:number, i:number) {
    this.userPermissionState[option][i] = !this.userPermissionState[option][i]
  }

  saveEditPermission() {
    if (!this.user) {
      console.error('No user selected for updating permissions');
      return;
    }

    // Prepare the permissions object to send to the backend
    const updatedPermissions = {
      maps: {
        enable: this.userPermissionState[0][0],
        create: this.userPermissionState[0][1],
        edit: this.userPermissionState[0][2],
        delete: this.userPermissionState[0][3],
        view: this.userPermissionState[0][4]
      },
      mission: {
        enable: this.userPermissionState[1][0],
        create: this.userPermissionState[1][1],
        edit: this.userPermissionState[1][2],
        delete: this.userPermissionState[1][3],
        view: this.userPermissionState[1][4]
      },
      transition: {
        enable: this.userPermissionState[2][0],
        create: this.userPermissionState[2][1],
        edit: this.userPermissionState[2][2],
        delete: this.userPermissionState[2][3],
        view: this.userPermissionState[2][4]
      },
      paths: {
        enable: this.userPermissionState[3][0],
        create: this.userPermissionState[3][1],
        edit: this.userPermissionState[3][2],
        delete: this.userPermissionState[3][3],
        view: this.userPermissionState[3][4]
      }
    };

    // Send the PUT request to update the user permissions
    fetch(`http://${environment.API_URL}:${environment.PORT}/api/users/${this.user.userName}/permissions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissions: updatedPermissions })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      return response.json();
    })
    .then(data => {
      console.log('User updated successfully:', data);
      // Optionally refresh the user list or update the local user list
      this.fetchUsers();
    })
    .catch(error => {
      console.error('Error updating user:', error);
    });

    // Close the popup
    this.userPermissionPopUpClose();
  }
  deleteUserPopUp() {
    this.deleteUserOCstate = !this.deleteUserOCstate
  }

}
