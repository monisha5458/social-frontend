import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-post',
  imports:[CommonModule,FormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  postContent = '';
  media: File | null = null;

  constructor(private postService: PostService, private router: Router) {}

  onMediaSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.media = file;
    }
  }

  createPost() {
    if (this.postContent) {
      this.postService.createPost(this.postContent, this.media).subscribe({
        next: (newPost) => {
          alert('Post created successfully!');
          this.router.navigate(['/dashboard']); // redirect after posting
        },
        error: (error) => {
          console.error('Error creating post:', error);
        }
      });
    }
  }
}
