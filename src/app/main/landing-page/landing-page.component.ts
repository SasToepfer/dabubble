import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../header/header.component";
import { DevSpaceComponent } from "../dev-space/dev-space.component";
import { ThreadChatComponent } from "../thread-chat/thread-chat.component";

@Component({
  selector: "app-landing-page",
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    DevSpaceComponent,
    ThreadChatComponent,
  ],
  templateUrl: "./landing-page.component.html",
  styleUrl: "./landing-page.component.scss",
})
export class LandingPageComponent {
  isMainVisible = true;
  isRoutingContentVisible = false; // Standard: router-outlet sichtbar

  toggleMainVisibility() {
    this.isMainVisible = !this.isMainVisible;
  }

  onViewSwitch(isDevSpaceVisible: boolean) {
    if (window.innerWidth < 800) {
      this.isMainVisible = isDevSpaceVisible;
      this.isRoutingContentVisible = !isDevSpaceVisible;
    }
  }
}
