import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = 'Guest';  // Default value
  posts: any[] = [];
  followingPosts: any[] = [];
  postContent: string = '';
  media: File | null = null;
  userProfile: any;  // Declare userProfile

  constructor(
    private postService: PostService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.getUsernameFromLocalStorage(); // Get username from localStorage
    this.loadUserProfile();  // Load user profile
    this.loadUserPosts();
    this.loadFollowingPosts();
  }

  // Function to get the username from localStorage
  getUsernameFromLocalStorage(): string {
    const storedUsername = localStorage.getItem('username');
    return storedUsername ? storedUsername : 'Guest';  // Return stored username or 'Guest'
  }

  // Load user profile
  loadUserProfile() {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;  // Set the userProfile object
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  // Load posts from the backend
  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;  // Store the posts in the posts array
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      }
    });
  }

  // Load posts created by the current user
  loadUserPosts() {
    this.postService.getFeed().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      }
    });
  }

  // Load posts from users the current user is following
  loadFollowingPosts() {
    this.postService.getFollowingFeed().subscribe({
      next: (posts) => {
        this.followingPosts = posts;
      },
      error: (error) => {
        console.error('Error loading following posts:', error);
      }
    });
  }

  // Create a new post
  createPost() {
    if (this.postContent) {
      this.postService.createPost(this.postContent, this.media).subscribe({
        next: (newPost) => {
          this.posts.unshift(newPost);  // Add the new post at the beginning
          this.postContent = '';
          this.media = null;
        },
        error: (error) => {
          console.error('Error creating post:', error);
        }
      });
    }
  }

  // Handle media file input
  onMediaSelected(event: any) {
    this.media = event.target.files[0];
  }

  // Log out the user
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // Delete a post
  deletePost(postId: string) {
    console.log('Trying to delete post with ID:', postId); // Log to ensure it's correct

    // Change the URL to match the correct API endpoint
    this.postService.deletePost(postId).subscribe({
      next: () => {
        // Update the UI by removing the deleted post
        this.posts = this.posts.filter(post => post._id !== postId);
        this.followingPosts = this.followingPosts.filter(post => post._id !== postId);
      },
      error: (error) => {
        console.error('Error deleting post:', error);
      }
    });
  }
}
