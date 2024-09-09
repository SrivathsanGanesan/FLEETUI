import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProjectService } from '../services/project.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment.development';

interface Project {
  _id: string;
  projectName: string;
}

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
  project: Project = { _id: '', projectName: '' };
  projectname: string = '';
  isFocused: { [key: string]: boolean } = {};
  selectedProject: string = '';
  selectedFileName: string = 'Import Project File';
  errorMessage: string = '';
  productList: Project[] = [];
  selectedFile: File | null = null;
  form: FormData | null = null;
  renamedProj: any;
  isRenamed: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private projectService: ProjectService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    // hook
    let pDet = this.cookieService.get('project-data');
    console.log(pDet);

    fetch(
      `http://${environment.API_URL}:${environment.PORT}/fleet-project/projects/project-list`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error("Error : data doesn't attained " + res.status);
      })
      .then((data) => {
        console.log(data.user + ' : ' + data.msg);
        this.productList = data.projects;
      })
      .catch((err) => console.log(err));
  }

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
    if (!this.isProjDiv2Visible) {
      this.selectedFileName = 'Import Project File';
    }
    if (!this.isProjDiv3Visible) {
      this.selectedProject = '';
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
    if (!this.isProjDiv2Visible) {
      this.selectedFileName = 'Import Project File';
    }
    if (!this.isProjDiv3Visible) {
      this.selectedProject = '';
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
    if (!this.isProjDiv2Visible) {
      this.selectedFileName = 'Import Project File';
    }
    if (!this.isProjDiv3Visible) {
      this.selectedProject = '';
    }
  }

  onIconClick() {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  async logout() {
    /* try {
      const response = await fetch(
        'http://localhost:3000/fleet-project-file/download-project/project_2',
        {
          credentials: 'include',
        }
      );
      if (!response.ok) alert('try once again');
      else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `project_2.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.log('Err ra pans : ', error);
    }

    return; */
    fetch(`http://${environment.API_URL}:${environment.PORT}/auth/logout`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.isCookieDeleted);
        if (data.isCookieDeleted) {
          this.authService.logout();
          this.projectService.clearProjectData();
          this.router.navigate(['/']);
        }
      })
      .catch((err) => console.log(err));
  }

  async sendZip() {
    try {
      let response = await fetch(
        `http://${environment.API_URL}:${environment.PORT}/fleet-project-file/upload-project/`,
        {
          credentials: 'include',
          method: 'POST',
          body: this.form,
        }
      );
      let data = await response.json();
      if (data.conflicts) alert(data.msg);
      if (data.error) {
        alert('Try submitting file again');
        return;
      } else if (data.idExist) {
        alert('Sry, project (with this id) already exist');
        this.projectService.clearProjectData();
      } else if (!data.idExist && data.nameExist) {
        return true;
      } else if (!data.err && !data.conflicts && data.user) {
        console.log(data.user);
        console.log(data.project);
        this.projectService.setProjectCreated(true); //
        this.projectService.setSelectedProject(data.project); //
        this.router.navigate(['/dashboard']);
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async importFile() {
    if (!this.selectedFile) {
      alert('No file selected');
      return;
    }
    const projRename = {
      isRenamed: this.isRenamed, // false
      alterName: this.renamedProj, // ""
    };
    this.form = new FormData();
    this.form.append('projFile', this.selectedFile);
    this.form.append('projRename', JSON.stringify(projRename));
    const isConflict = await this.sendZip();
    if (isConflict) {
      this.renamedProj = prompt(
        'project with this name already exists, would you like to rename?'
      );
      if (this.renamedProj === null && this.renamedProj === '') return;
      this.isRenamed = true;
    }
  }

  // project file handling..
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (
      file.type !== 'application/zip' &&
      file.type !== 'application/x-zip-compressed'
    ) {
      alert('file type not valid');
      return;
    }
    if (file) {
      console.log('File selected:', file.name);
      this.selectedFileName = file.name; // Update the variable with the file name
    }
    this.renamedProj = '';
    let projRename = {
      isRenamed: this.isRenamed, // false
      alterName: this.renamedProj, // ""
    };
    // this.projectService.setProjectCreated(true); //
    // this.projectService.setSelectedProject(file.name); //
    this.selectedFile = file;
  }

  onFocus(inputId: string) {
    this.isFocused[inputId] = true;
  }

  onBlur(inputId: string) {
    this.isFocused[inputId] = false;
  }

  onProjectChange(event: any) {
    this.project = JSON.parse(event.target.value);
    if (!JSON.parse(event.target.value)._id)
      this.project._id = JSON.parse(event.target.value).projectId;
  }

  createProject() {
    if (!this.projectname && !this.sitename) {
      this.errorMessage = '*Please fill in both the fields.';
      return;
    }

    if (!this.projectname) {
      this.errorMessage = '*Please fill Project Name.';
      return;
    }
    if (!this.sitename) {
      this.errorMessage = '*Please fill Site Name.';
      return;
    }

    fetch(
      `http://${environment.API_URL}:${environment.PORT}/fleet-project/project`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          project: {
            projectName: this.projectname,
            siteName: this.sitename,
          },
        }),
      }
    )
      .then((res) => {
        if (res.status === 400) alert('project Name already exits');
        else if (res.status === 500) console.log('Error in server side');
        else if (res.status === 403) {
          alert('Toke Invalid');
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data.exists) {
          this.projectService.setProjectCreated(true); //
          this.projectService.setSelectedProject(data.project); //
          this.router.navigate(['/dashboard']);
        }
        console.log(data);
      })
      .catch((err) => console.log(err));
  }

  openProject() {
    // console.log('name : ', this.project._id, this.project.projectName);
    if (this.project._id === '' && this.project.projectName === '') {
      alert('no project selected');
      return;
    }
    fetch(
      `http://${environment.API_URL}:${environment.PORT}/fleet-project/${this.project._id}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((res) => {
        // if (!res.ok) {
        //   throw new Error('Project not found: ' + res.status);
        // }
        return res.json();
      })
      .then((data) => {
        // console.log(this.project._id, this.project.projectName);
        // return;
        if (!data.exists) {
          alert('Project does not exist on DB, try deleting it from the user');
          return;
        }
        console.log(data.project);
        this.projectService.setSelectedProject(data.project);
        this.projectService.setProjectCreated(true);
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => console.log(err));
  }
}
