import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projectsetup',
  templateUrl: './projectsetup.component.html',
  styleUrl: './projectsetup.component.css',
})
export class ProjectsetupComponent {
  // Property to control the visibility of ProjDiv
  isProjDiv1Visible: boolean = false;
  isProjDiv2Visible: boolean = false;
  isProjDiv3Visible: boolean = false;

  // Method to show ProjDiv
  showProjDiv1() {
    // console.log(JSON.parse(document.cookie.split('=')[1])); user state..
    this.isProjDiv1Visible = !this.isProjDiv1Visible;
    this.isProjDiv2Visible = false;
    this.isProjDiv3Visible = false;
  }

  showProjDiv2() {
    this.isProjDiv2Visible = !this.isProjDiv2Visible;
    this.isProjDiv1Visible = false;
    this.isProjDiv3Visible = false;
  }

  showProjDiv3() {
    this.isProjDiv3Visible = !this.isProjDiv3Visible;
    this.isProjDiv2Visible = false;
    this.isProjDiv1Visible = false;
  }

  onIconClick() {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  logout() {
    fetch('http://192.168.11.183:3000/auth/logout', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.isCookieDeleted);
        document.cookie =
          '_user=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'; // which sets the cookie expire date to the past (so it'll remove)
        if (data.isCookieDeleted) window.location.href = '/';
      })
      .catch((err) => console.log(err));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      // Handle the file upload logic here
    }
  }

  isFocused: { [key: string]: boolean } = {};

  onFocus(inputId: string) {
    this.isFocused[inputId] = true;
  }

  onBlur(inputId: string) {
    this.isFocused[inputId] = false;
  } 
}
