import { Injectable, Injector } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, EmailAuthProvider, getAuth, GoogleAuthProvider, onAuthStateChanged, reauthenticateWithCredential, signInAnonymously, signInWithEmailAndPassword, signInWithPopup, signOut, updatePassword, updateProfile } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { IUser } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authSubject = new BehaviorSubject<boolean>(false);
  auth$ = this.authSubject.asObservable();

  provider = new GoogleAuthProvider();

  currentUserMail: string = "";

  constructor(private auth: Auth, private userService: UserService) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    // onAuthStateChanged(this.auth, (user) => {
    //   if (user) {
    //     this.authSubject.next(true);
    //   } else {
    //     this.authSubject.next(false);
    //   }
    // })
  }

  async registerUserWithEmailAndPassword(name: string, email: string, password: string, avatar: string) {

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        this.createNewUser(name, email, avatar);
      }
    } catch (error) {
      console.error('Registration Error', error);
    }
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        this.authSubject.next(true);
        this.userService.changeCurrentUserMail(userCredential.user.email as string);
      }
    } catch (error) {
      console.error('login Error', error);
    }
  }

  async forceLogin() {
    try {
      const userCredential = await signInAnonymously(this.auth);
      if (userCredential.user) {
        this.authSubject.next(true);
        this.userService.changeCurrentUserMail("guest@mail.com");
      }
    } catch (error) {
      console.error('Guest login Error', error);
    }
  }

  async loginWithGoogleAccount() {
    try {
      const userCredential = await signInWithPopup(this.auth, this.provider);
      if (userCredential.user) {
        const userData = userCredential.user;

        this.authSubject.next(true);

        const userExists = await this.userService.checkIfUserExists(userData.email as string);

      if (!userExists) {
        this.createNewUser(userData.displayName as string, userData.email as string, "assets/avatars/avatar_1.png");
      } 

        this.userService.changeCurrentUserMail(userData.email as string);
      }
    } catch (error) {
      console.error('Google login Error', error);
    }
  }

  createNewUser(name: string, email: string, avatar: string) {
    let newUser: IUser = {
      email: email,
      name: name,
      picture: avatar,
      onlineStatus: true,
    }
    this.userService.addUser(newUser);
  }

  // Neue Methode: Erneute Authentifizierung
  async reauthenticate(currentPassword: string) {
    const user = this.auth.currentUser;
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        console.log('Erneute Authentifizierung erfolgreich');
      } catch (error) {
        console.error('Fehler bei der erneuten Authentifizierung:', error);
        throw error;
      }
    } else {
      console.error('Kein Benutzer angemeldet oder keine E-Mail vorhanden');
      throw new Error('Kein Benutzer angemeldet oder keine E-Mail vorhanden');
    }
  }

  // Neue Methode: Passwort ändern
  async changePassword(currentPassword: string, newPassword: string) {
    try {
      // Step 1: Get the current user
      const user = this.auth.currentUser;

      if (!user) {
        throw new Error('No user is currently signed in');
      }

      // Step 2: (Optional) Reauthenticate the user if required
      await this.reauthenticate(currentPassword); // Uncomment if reauthentication is implemented

      // Step 3: Update the password
      await updatePassword(user, newPassword);
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      throw error; // Propagate the error to the caller
    }
  }

  async logout() {
    await signOut(this.auth);
    this.authSubject.next(false);
  }
}
