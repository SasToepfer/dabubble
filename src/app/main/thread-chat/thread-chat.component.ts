import { Component } from '@angular/core';
import { WriteMessageComponent } from '../../shared/write-message/write-message.component';
import { ThreadService } from '../../services/thread.service';
import { IMessage, IChannels } from '../../interfaces/ichannels';
import { SingleMessageComponent } from '../../shared/single-message/single-message.component';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/iuser';
import { ChannelsService } from '../../services/channels.service';

@Component({
  selector: 'app-thread-chat',
  standalone: true,
  imports: [WriteMessageComponent, SingleMessageComponent],
  templateUrl: './thread-chat.component.html',
  styleUrl: './thread-chat.component.scss',
})
export class ThreadChatComponent {
  showThread: boolean = false;
  threadMessage: IMessage | null = null;
  currentUser: IUser | null = null;
  currentChannel: IChannels | null = null;

  constructor(
    private threadService: ThreadService,
    private userService: UserService,
    private channelService: ChannelsService
  ) {
    this.threadService.getShowThreadStatus().subscribe((status) => {
      this.showThread = status;
    });

    this.threadService.getThreadMessage().subscribe((message) => {
      this.threadMessage = message;
    });

    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user!;
    });
  }

  addMessage(newMessage: string) {
    if (!this.currentUser || !this.threadMessage) {
      console.error('Fehlende Daten: Benutzer, Channel oder Thread-Nachricht');
      return;
    }

    let newMessageToAdd: IMessage = {
      writer: this.currentUser.name,
      message: newMessage,
      time: this.styleTime(),
      emojis: [],
      answer: [],
    };

    if (!this.threadMessage.answer) {
      this.threadMessage.answer = [];
    }
    this.threadMessage.answer.push(newMessageToAdd);
  }

  styleTime() {
    let time = new Date();
    return {
      hour: time.getHours(),
      minute: time.getMinutes(),
      day: time.getDate(),
      month: time.getMonth(),
      year: time.getFullYear(),
      dayName: time.toLocaleDateString('de-DE', { weekday: 'long' }),
      fullDate: time.toDateString(),
    };
  }
}
