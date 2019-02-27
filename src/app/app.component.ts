import { Component } from '@angular/core';
import * as Box from '3box';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  address: string;
  nickname: string;
  isSyncing: boolean;
  profileName: string;
  box;

  public async getProfileFrom(address = '0x57cd6bb30487bb7efeb285c26146dd04f3c75844') {
    this.profileName = (await Box.getProfile(address)).nickname;
  }

  public async connection() {
    try {
      const ethereum = (window as any).ethereum;
      const [ address ] = await ethereum.enable();
      this.address = address;
      const box = await Box.openBox(address, ethereum);
      this.isSyncing = true;
      box.onSyncDone(_ => {
        this.isSyncing = false;
        this.box = box;
      });
    } catch (err) {
      console.error(err);
    }
  }

  public addNickname(nickname: string) {
    if (!this.box) {
      throw new Error('Box is not sync yet');
    }
    this.box.public.set('nickname', nickname);
  }

  public async showNickname() {
    this.nickname = await this.box.public.get('nickname');
  }
}
