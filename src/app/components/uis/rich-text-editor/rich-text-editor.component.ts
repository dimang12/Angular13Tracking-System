import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Quill from 'quill';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements AfterViewInit {
  @Output() contentChanged = new EventEmitter<string>();
  @ViewChild('editor') editorElement!: ElementRef;
  quill!: Quill;

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
      this.contentChanged.emit(this.quill.root.innerHTML);
    });
  }

  resetContent(): void {
    this.quill.root.innerHTML = '';
    this.contentChanged.emit('');
  }
}
