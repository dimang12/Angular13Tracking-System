// src/app/components/uis/rich-text-editor/rich-text-editor.component.ts
import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import Quill from 'quill';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements AfterViewInit {
  @Output() contentChanged = new EventEmitter<string>();
  @ViewChild('editor') editorElement!: ElementRef;
  private _content: string = '';
  quill!: Quill;

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

  ngAfterViewInit(): void {
    this.quill = new Quill(this.editorElement.nativeElement, {
      modules: {
        toolbar: [
          [{ 'header': [1, 2, false] }],
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
  }

  resetContent(): void {
    this._content = '';
    this.quill.root.innerHTML = '';
    this.contentChanged.emit('');
  }
}
