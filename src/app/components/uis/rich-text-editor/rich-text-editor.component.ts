import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import Quill from 'quill';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements OnInit {
  @ViewChild('editor', { static: true }) editorElement!: ElementRef;
  @Output() contentChanged = new EventEmitter<string>();

  quill!: Quill;

  ngOnInit(): void {
    this.quill = new Quill(this.editorElement.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      }
    });

    this.quill.on('text-change', () => {
      this.contentChanged.emit(this.quill.root.innerHTML);
    });
  }

  getContent(): string {
    return this.quill.root.innerHTML;
  }
}
