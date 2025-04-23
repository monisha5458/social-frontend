import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: any;
  @Output() like = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  userId!: string;

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.userId = user?._id;
  }

  likePost(postId: string) {
    this.like.emit(postId);
  }

  onDelete(postId: string) {
    if (confirm('Delete this post?')) {
      this.delete.emit(postId);
    }
  }

  isLiked(): boolean {
    return this.post.likes.includes(this.userId);
  }
}