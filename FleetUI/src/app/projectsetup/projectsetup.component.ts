import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-projectsetup',
  templateUrl: './projectsetup.component.html',
  styleUrls: ['./projectsetup.component.css'],
})
export class ProjectsetupComponent {
  isProjDiv1Visible: boolean = false;
  isProjDiv2Visible: boolean = false;
  isProjDiv3Visible: boolean = false;
  sitename: string = '';
  projectname: string = '';
  isFocused: { [key: string]: boolean } = {};
  selectedProject: string = '';
  selectedFileName: string = 'Import Project File';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  showProjDiv1() {
    this.isProjDiv1Visible = !this.isProjDiv1Visible;
    this.isProjDiv2Visible = false;
    this.isProjDiv3Visible = false;
    if (!this.isProjDiv1Visible) {
      this.sitename = '';
      this.projectname = '';
      this.isFocused = {};
      this.errorMessage = '';
    }  
    if (!this.isProjDiv2Visible){
      this.selectedFileName = "Import Project File";
    }
  }

  showProjDiv2() {
    this.isProjDiv2Visible = !this.isProjDiv2Visible;
    this.isProjDiv1Visible = false;
    this.isProjDiv3Visible = false;
    if (!this.isProjDiv1Visible) {
      this.sitename = '';
      this.projectname = '';
      this.isFocused = {};
      this.errorMessage = '';
    } 
    if (!this.isProjDiv2Visible){
      this.selectedFileName = "Import Project File";
    }
  }

  showProjDiv3() {
    this.isProjDiv3Visible = !this.isProjDiv3Visible;
    this.isProjDiv2Visible = false;
    this.isProjDiv1Visible = false;
    if (!this.isProjDiv1Visible) {
      this.sitename = '';
      this.projectname = '';
      this.isFocused = {};
      this.errorMessage = '';
    }
    if (!this.isProjDiv2Visible){
      this.selectedFileName = "Import Project File";
    } 
  }

  onIconClick() {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  logout() {
    fetch('http://localhost:3000/auth/logout', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.isCookieDeleted);
        // document.cookie =
        //   '_user=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'; // which sets the cookie expire date to the past (so it'll remove)
        if (data.isCookieDeleted) {
          this.authService.logout();
          this.router.navigate(['/']);
        }
      })
      .catch((err) => console.log(err));
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      this.selectedFileName = file.name; // Update the variable with the file name
    }
  }

  onFocus(inputId: string) {
    this.isFocused[inputId] = true;
  }

  onBlur(inputId: string) {
    this.isFocused[inputId] = false;
  }

  onProjectChange(event: any) {
    this.projectname = event.target.value;
  }
  createProject() {
    if (this.sitename && this.projectname) {
      // Logic to handle project creation
      console.log('Creating project with:', this.sitename, this.projectname);
      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
    } 
    if(!this.sitename){
      this.errorMessage = '*Please fill Site Name.'
    }
    if(!this.projectname){
      this.errorMessage = '*Please fill Project Name.'
    }
    if(!this.projectname && !this.projectname){
      this.errorMessage = '*Please fill in both the fields.';
    }
  }
}
