import { Component, Input } from '@angular/core';
import { AvatarPictureService } from '../../services/avatar-picture.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss'
})
export class SelectAvatarComponent {
  userToRegister = {
    name: "",
    email: "",
    password: "",
  };
  availablePictures: string[] = [];
  choosenPicture: string = "assets/avatars/avatar_default.png";

  constructor(private router: Router, private avatarService: AvatarPictureService, private authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    this.availablePictures = this.avatarService.avatarPictures;
    this.userToRegister = this.userService.getUserToRegister();
  }

  returnToRegister() {
      this.router.navigateByUrl('/(login-router:register)');
  }

  changeAvatarPicture(index : number) {
    this.choosenPicture = this.availablePictures[index];
  }

  finishRegister() {
    this.authService.registerUserWithEmailAndPassword(this.userToRegister.name, this.userToRegister.email, this.userToRegister.password, this.choosenPicture);
  }
}
