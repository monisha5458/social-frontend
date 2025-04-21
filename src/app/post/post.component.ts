import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  @Input() post: any;
  @Output() like = new EventEmitter<string>(); // Emitting postId when like button is clicked
  @Output() delete = new EventEmitter<string>(); // New emitter to handle delete

  likePost(postId: string): void {
    this.like.emit(postId); // Emitting event to the parent component
  }

  onDelete(postId: string): void {
    // Emit the postId to the parent component for deletion
    if (confirm('Are you sure you want to delete this post?')) {
      this.delete.emit(postId); // Send the postId to the parent for deletion
    }
  }
}
