// src/app/components/uis/rich-text-editor/rich-text-editor.component.ts
import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Input, OnDestroy } from '@angular/core';
import Quill from 'quill';
import { OpenAiProxyService } from '../../../services/openai-proxy.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OpenaiToastComponent } from '../openai-toast/openai-toast.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements AfterViewInit, OnDestroy {
  @Output() contentChanged = new EventEmitter<string>();
  @ViewChild('editor') editorElement!: ElementRef;
  private _content: string = '';
  quill!: Quill;
  private subs: Subscription[] = [];

  // Context menu state
  public contextMenuVisible = false;
  public menuX = 0;
  public menuY = 0;

  // Save selection as Quill index/length so we can replace using Quill APIs
  public savedQuillIndex: number | null = null;
  public savedQuillLength = 0;
  public savedText = '';

  @Input()
  set content(value: string) {
    this._content = value;
    if (this.quill) {
      this.quill.root.innerHTML = value;
    }
  }

  get content(): string {
    return this._content;
  }

  constructor(private openAIService: OpenAiProxyService, private snackBar: MatSnackBar) {}

  ngAfterViewInit(): void {
    this.quill = new Quill(this.editorElement.nativeElement, {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      },
      theme: 'snow'
    });

    this.quill.on('text-change', () => {
      this._content = this.quill.root.innerHTML;
      this.contentChanged.emit(this._content);
    });

    // Set initial content
    this.quill.root.innerHTML = this._content;

    // context menu handling
    const root = this.quill.root as HTMLElement;
    const cm = (evt: MouseEvent) => {
      try {
        const sel = window.getSelection();
        if (sel && sel.toString().trim().length > 0) {
          evt.preventDefault();

          // Save selected HTML (preserve formatting)
          let selectedHtml = '';
          if (sel.rangeCount) {
            const range = sel.getRangeAt(0);
            const container = document.createElement('div');
            const frag = range.cloneContents();
            container.appendChild(frag);
            selectedHtml = container.innerHTML;
          }
          this.savedText = selectedHtml || sel.toString();

          // Save Quill selection index/length
          try {
            const qsel = this.quill.getSelection(true);
            if (qsel) {
              this.savedQuillIndex = qsel.index;
              this.savedQuillLength = qsel.length || 0;
            } else {
              this.savedQuillIndex = null;
              this.savedQuillLength = 0;
            }
          } catch (e) {
            this.savedQuillIndex = null;
            this.savedQuillLength = 0;
          }

          // position menu
          this.menuX = evt.clientX;
          this.menuY = evt.clientY;
          this.contextMenuVisible = true;
        }
      } catch (e) {
        console.error('contextmenu handler error', e);
      }
    };

    root.addEventListener('contextmenu', cm);
    this.subs.push({ unsubscribe: () => root.removeEventListener('contextmenu', cm) } as Subscription);

    const docClick = () => {
      if (this.contextMenuVisible) this.contextMenuVisible = false;
    };
    document.addEventListener('click', docClick);
    this.subs.push({ unsubscribe: () => document.removeEventListener('click', docClick) } as Subscription);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  public onMenuImprove(): void {
    this.contextMenuVisible = false;
    if (this.savedText && this.savedText.trim().length > 0) {
      this.openaiImprove(this.savedText, null);
    }
  }

  public closeContextMenu(): void {
    this.contextMenuVisible = false;
  }

  private openaiImprove(selectedText: string, selection: Selection | null) {
    this.openAIService.improveText(selectedText).subscribe(result => {
      if (!result) {
        this.snackBar.open('OpenAI returned no result or API key missing', 'Close', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'bottom' });
        return;
      }

      const snackRef = this.snackBar.openFromComponent(OpenaiToastComponent, {
        data: { result },
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        duration: 0
      });

      snackRef.afterDismissed().subscribe(info => {
        if (!info.dismissedByAction) return;
        try {
          const normalizeHtml = (htmlOrText: string) => {
            const s = (htmlOrText || '').trim();
            if (/<[^>]+>/.test(s)) return s;
            const lines = s.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            if (lines.length === 0) return '';
            const isUnordered = lines.every(l => /^[-*]\s+/.test(l));
            const isOrdered = lines.every(l => /^\d+[.)]\s+/.test(l));
            if (isUnordered) return '<ul>' + lines.map(l => `<li>${l.replace(/^[-*]\s+/, '')}</li>`).join('') + '</ul>';
            if (isOrdered) return '<ol>' + lines.map(l => `<li>${l.replace(/^\d+[.)]\s+/, '')}</li>`).join('') + '</ol>';
            if (lines.length === 1) return `<p>${lines[0]}</p>`;
            return lines.map(l => `<p>${l}</p>`).join('');
          };

          const html = normalizeHtml(result || '');

          if (this.savedQuillIndex !== null) {
            this.quill.deleteText(this.savedQuillIndex, this.savedQuillLength, 'user');
            const beforeLen = this.quill.getLength();
            this.quill.clipboard.dangerouslyPasteHTML(this.savedQuillIndex, html || '', 'user');
            const afterLen = this.quill.getLength();
            const insertedDelta = Math.max(0, afterLen - beforeLen);
            try { this.quill.setSelection(this.savedQuillIndex + insertedDelta, 0, 'silent'); } catch {}
          } else if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const container = document.createElement('div');
            container.innerHTML = html;
            const frag = document.createDocumentFragment();
            while (container.firstChild) frag.appendChild(container.firstChild);
            range.insertNode(frag);
          }

          this._content = this.quill.root.innerHTML;
          this.contentChanged.emit(this._content);
        } catch (e) {
          console.error('Failed to apply improved text', e);
        }
      });
    });
  }

  // Reset editor content cleanly
  resetContent(): void {
    this._content = '';
    if (this.quill && this.quill.root) {
      this.quill.root.innerHTML = '';
    }
    this.contentChanged.emit('');
  }
}
