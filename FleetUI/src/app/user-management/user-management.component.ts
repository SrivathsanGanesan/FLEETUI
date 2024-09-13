import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {

  cookieValue: any;
  userId = 0;
  userName = '';
  passWord = '';
  confrimPassword = '';
  errorMessage = "";
  userRole = 'User';
  userRoleOCstate = false;
  userPermissionOCstate = false;
  passwordState = false;
  confrimPasswordState = false;
  passwordType = 'password';
  confrimPasswordType = 'password';
  userCreatePopUp = false;
  deleteUserOCstate = false;
  userCredentialsTemplate: any = {};
  user: any;
  deleteUserName = "";
  passwordView = "SHOW";
  confrimPasswordView = "SHOW";
  deleteUserRole = "";

  // Default user permission state for local use
  userPermissionState = [
    [false, false, false, false, false], // MAPS
    [false, false, false, false, false], // MISSION
    [false, false, false, false, false], // TRANSITION
    [false, false, false, false, false]  // PATHS
  ];

  // Local permission options
  userPermissionOptions = [
    { order: 0, nameTag: "MAPS", isAvail: 0, create: 1, edit: 2, delete: 3, view: 4 },
    { order: 1, nameTag: "MISSION", isAvail: 0, create: 1, edit: 2, delete: 3, view: 4 },
    { order: 2, nameTag: "TRANSITION", isAvail: 0, create: 1, edit: 2, delete: 3, view: 4 },
    { order: 3, nameTag: "PATHS", isAvail: 0, create: 1, edit: 2, delete: 3, view: 4 }
  ];

  // Predefined roles
  userRoleCredentials = [
    { order: 0, userRole: 'User', nameTag: 'USER' },
    { order: 1, userRole: 'Administrator', nameTag: 'ADMIN' },
    { order: 2, userRole: 'Maintainer', nameTag: 'MAINTAINER' }
  ];

  // Local users (initialize empty)
  userCredentials: any[] = [];

  constructor(private cookieService: CookieService) { }

  
  ngOnInit(): void {
    // Local Initialization logic
    this.loadDefaultUsers();
  }

  // Load default users locally
  loadDefaultUsers() {
    this.userCredentials = [
      {
        userId: 1,
        userName: 'JohnDoe',
        passWord: 'Password123!',
        role: 'Administrator',
        permissions: this.defaultPermissions()
      },
      {
        userId: 2,
        userName: 'JaneDoe',
        passWord: 'Password123!',
        role: 'User',
        permissions: this.defaultPermissions()
      }
    ];
  }

  // Default permissions for new users
  defaultPermissions() {
    return [
      [true, true, false, false, true], // MAPS permissions: [isAvail, create, edit, delete, view]
      [true, false, false, false, true], // MISSION permissions
      [true, true, false, false, true], // TRANSITION permissions
      [false, false, false, false, false]  // PATHS permissions
    ];
  }

  // Open user permission popup
  userPermissionPopUpOpen(username: string) {
    this.user = this.userCredentials.find(user => username === user.userName);
    if (this.user) {
      console.log("User found:", this.user.userName);
      this.userPermissionState = this.user.permissions; // Assign stored permissions
      this.userPermissionOCstate = !this.userPermissionOCstate;
    } else {
      console.error("User not found:", username);
    }
  }

  // Close user permission popup
  userPermissionPopUpClose() {
    this.userPermissionOCstate = false;
  }

  // Reset Password Fields
  resetPassword() {
    this.passwordState = false;
    this.confrimPasswordState = false;
    this.passwordType = "password";
    this.confrimPasswordType = "password";
    this.passwordView = "SHOW";
    this.confrimPasswordView = "SHOW";
  }

  // Create New User Locally
  createUser() {
    if (this.userName === '' || this.passWord === '' || this.confrimPassword === '') {
      this.errorMessage = '*Please fill all required fields';
      setTimeout(() => {
        this.errorMessage = '';
      }, 4000);
      return;
    }

    if (this.passWord !== this.confrimPassword) {
      this.errorMessage = '*Passwords do not match';
      setTimeout(() => {
        this.errorMessage = '';
      }, 4000);
      return;
    }

    // Validate and add user
    this.userId += 1;
    const newUser = {
      userId: this.userId,
      userName: this.userName,
      passWord: this.passWord,
      role: this.userRole,
      permissions: this.defaultPermissions()
    };

    this.userCredentials.push(newUser); // Add to local users
    this.resetPassword();
    console.log('User created:', newUser);
  }




 // Deleting the user credentials locally

 
 // Deleting the user credentials locally
 deleteUser(username: any, userRole: any) {
   let findingAdmin = this.userCredentials.filter((user) => user.userRole === "Administrator");
   console.log("Delete User =>>>", findingAdmin);
 
   if (findingAdmin.length <= 1 && userRole === "Administrator") {
       alert("Should have at least one admin");
       this.deleteUserPopUp();  // Close the popup after alert
       return;
   }
 
   console.log("DELETE:", username); // Log the username to delete
   const userToDelete = this.userCredentials.find(user => username === user.userName);
   console.log(userToDelete); // Log the user object to delete
 
   if (!userToDelete) {
       console.error('User not found for deletion:', username);
       return;
   }
 
   // Remove the user from the local list
   this.userCredentials = this.userCredentials.filter(user => user.userName !== username);
   console.log('Updated users after deletion:', this.userCredentials);
 
   // Clear the deletion state
   this.deleteUserName = "";
   this.deleteUserPopUp();  // Close the delete popup after deletion
 }
 
 // Opens the delete user popup and sets the selected user's data
 getDeleteUser(userName: any, userRole: any) {
   this.deleteUserName = userName;
   this.deleteUserRole = userRole;
   console.log(this.deleteUserName);
   this.deleteUserPopUp();  // Open the delete popup
 }
 
 // Method to toggle the delete user popup
 deleteUserPopUp() {
   this.deleteUserOCstate = !this.deleteUserOCstate;
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

  // userPermissionPopUpOpen(username: string) {
  //   this.user = this.userCredentials.find(user => username === user.userName);

  //   if (this.user) {
  //     console.log("User found:", this.user.userName);
     
  //     this.fetchUserPermissions(this.user.userName);
  //     this.userPermissionOCstate = !this.userPermissionOCstate;
  //   } else {
  //     console.error("User not found:", username);
  //   }
  // }
 // Mock fetching user permissions locally
fetchUserPermissions(username: string) {
  const userPermissions = this.userCredentials.find(user => user.userName === username)?.permissions;
  
  if (!userPermissions) {
      console.error('No permissions found for user:', username);
      return;
  }

  console.log('Fetched user permissions:', userPermissions);

  // Update the local permission state with mock data
  this.userPermissionState = [
      [userPermissions.maps.enable, userPermissions.maps.create, userPermissions.maps.edit, userPermissions.maps.delete, userPermissions.maps.view],
      [userPermissions.mission.enable, userPermissions.mission.create, userPermissions.mission.edit, userPermissions.mission.delete, userPermissions.mission.view],
      [userPermissions.transition.enable, userPermissions.transition.create, userPermissions.transition.edit, userPermissions.transition.delete, userPermissions.transition.view],
      [userPermissions.paths.enable, userPermissions.paths.create, userPermissions.paths.edit, userPermissions.paths.delete, userPermissions.paths.view]
  ];
}

  // userPermissionPopUpClose(){
  //   this.userPermissionOCstate = !this.userPermissionOCstate
  // }

  changeUserPermission(option:number, i:number) {
    this.userPermissionState[option][i] = !this.userPermissionState[option][i]
  }

  saveEditPermission() {
    if (!this.user) {
        console.error('No user selected for updating permissions');
        return;
    }

    // Prepare the permissions object to update locally
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

    // Update the permissions in the local user data
    const userIndex = this.userCredentials.findIndex(user => user.userName === this.user.userName);
    if (userIndex !== -1) {
        this.userCredentials[userIndex].permissions = updatedPermissions;
        console.log('Updated permissions locally for user:', this.userCredentials[userIndex]);
    }

    // Close the popup
    this.userPermissionPopUpClose();
}
}