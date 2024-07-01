import { Component } from '@angular/core';

@Component({
  selector: 'app-projectsetup',
  templateUrl: './projectsetup.component.html',
  styleUrl: './projectsetup.component.css'
})
export class ProjectsetupComponent {
// Property to control the visibility of ProjDiv
isProjDiv1Visible: boolean = false;
isProjDiv2Visible: boolean = false;
isProjDiv3Visible: boolean = false;

// Method to show ProjDiv
showProjDiv1() {
  this.isProjDiv1Visible =!this.isProjDiv1Visible;
  this.isProjDiv2Visible =false;
  this.isProjDiv3Visible =false;
}
showProjDiv2() {
  this.isProjDiv2Visible =!this.isProjDiv2Visible;
  this.isProjDiv1Visible =false;
  this.isProjDiv3Visible =false;
}
showProjDiv3() {
  this.isProjDiv3Visible =!this.isProjDiv3Visible;
  this.isProjDiv2Visible =false;
  this.isProjDiv1Visible =false;
}
onIconClick() {
  const fileInput = document.getElementById('fileInput') as HTMLElement;
  fileInput.click();
}
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    console.log('File selected:', file.name);
    // Handle the file upload logic here
  }
}
}
