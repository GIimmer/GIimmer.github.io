import {
  Input,
  Output,
  OnDestroy,
  Component,
  ViewChild,
  Renderer2,
  ElementRef,
  HostListener,
  EventEmitter,  
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'popout-window',
  styleUrls: ['./popout-window.component.scss'],
  templateUrl: './popout-window.component.html',
})

export class PopoutWindowComponent implements OnDestroy  {
  @Input() windowTitle: string;
  @Input() whiteIcon: boolean;
  @Output() closed: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('innerWrapper') private innerWrapper: ElementRef;
  @ViewChild('popoutWrapper') private popoutWrapper: ElementRef;

  private popoutWindow: Window;
  private observer: MutationObserver;

  @HostListener('window:beforeunload')
  private beforeunloadHandler(): void {
    this.close();
  }

  constructor(private renderer2: Renderer2, private cd: ChangeDetectorRef) {}

  get isPoppedOut() {
    return !!this.popoutWindow;
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
    this.close();
  }

  popIn(): void {
    this.renderer2.appendChild(this.popoutWrapper.nativeElement, this.innerWrapper.nativeElement);
    this.close();
    this.cd.detectChanges();
  }

  popOut(): void {
    if (!this.popoutWindow) {
      this.createPopoutWindow();
      this.cloneStylesToPopoutWindow();

      this.renderer2.appendChild(this.popoutWindow.document.body, this.innerWrapper.nativeElement);

      this.popoutWindow.addEventListener('unload', () => this.popIn());

      this.cd.detectChanges();
    } else {
      this.popoutWindow.focus();
    }
  }
  
  private createPopoutWindow() {
      const elmRect = this.innerWrapper.nativeElement.getBoundingClientRect();

      const [winLeft, winTop] = this.getWindowPositioning(elmRect);

      this.popoutWindow = window.open(
        '',
        `popoutWindow${Date.now()}`,
        `width=${elmRect.width},
        height=${elmRect.height + 1},
        left=${winLeft},
        top=${winTop}`
      );

      this.popoutWindow.document.title = this.windowTitle || window.document.title;
      this.popoutWindow.document.body.style.margin = '0';
  }

  private getWindowPositioning(elmRect: DOMRect) {
      const navHeight = window.outerHeight - window.innerHeight;
      const navWidth = window.outerWidth - window.innerWidth;

      const winLeft = window.screenX + navWidth + elmRect.left;
      const winTop = window.screenY + navHeight + elmRect.top - 60;
      return [winLeft, winTop];
  }

  private close(): void {
    if (this.popoutWindow) {
      this.popoutWindow.close();
      this.popoutWindow = null;
      this.closed.next(true)
    }
  }
  
  private cloneStylesToPopoutWindow() {
    document.fonts.forEach(node => {
      (this.popoutWindow.document as any).fonts.add(node);
    });

    document.head.querySelectorAll('link[rel="stylesheet"]').forEach(node => {
      this.popoutWindow.document.head.insertAdjacentHTML('beforeend',
        `<link rel="stylesheet" type="${(node as HTMLLinkElement).type}" href="${(node as HTMLLinkElement).href}">`);
    });

    document.head.querySelectorAll('style').forEach(node => {
      this.popoutWindow.document.head.appendChild(node.cloneNode(true));
    });

    this.observeStyleChanges();
  }

  private observeStyleChanges() {
    const node = document.querySelector('head');

    this.observer?.disconnect();
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'STYLE') {
            this.popoutWindow.document.head.appendChild(node.cloneNode(true));
          }
        });
      });
    });

    this.observer.observe(node, { childList: true });
  }
}
