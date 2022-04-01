import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  numberInput = new FormControl(0);
  itemArray: { color: string }[] = [];

  wrapperRetainSizeOnPopout = new FormControl(false);

  onDeleteItem(itemIdx: number)  {
    this.itemArray.splice(itemIdx,1);
    this.numberInput.setValue(this.numberInput.value - 1);
  }

  ngOnInit(): void {
    this.numberInput.valueChanges.subscribe(change => {
      if (change === null) return;

      const delta = change  - this.itemArray.length;
      const diff = Math.abs(delta);
      if (delta > 0) {
        for (let i = 0; i < delta; i++) {
          this.itemArray.push({ color: this.getRandomRGBA() });
        }
      } else if (delta < 0) {
        this.itemArray.splice(-diff,diff);
      }
    })
    this.numberInput.setValue(2);
  }

  private getRandomRGBA() {
    const rand255 = () => Math.round(Math.random()*255);
    return 'rgba(' + rand255() + ',' + rand255() + ',' + rand255() + ',' + Math.random().toFixed(1) + ')';
  }
}
