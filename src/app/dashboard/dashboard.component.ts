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
  isProfileVisible: boolean = false; // Flag to control the profile visibility
  showUserPostSection: boolean = false; // Flag to toggle 'Your Posts' section visibility
  showFollowingPostSection: boolean = false; // Flag to toggle 'Following Posts' section visibility
  searchTerm: string = '';
  searchResults: any[] = [];

  constructor(
    private postService: PostService,
    private userService: UserService,
    private router: Router
  ) {}

   // New: perform user search
   searchUsers() {
    if (!this.searchTerm.trim()) return;
    this.userService.searchUsers(this.searchTerm).subscribe({
      next: users => this.searchResults = users,
      error: err => console.error('Search error', err)
    });
  }

  // New: toggle follow/unfollow
  toggleFollow(targetUserId: string, isFollowing: boolean) {
    const obs = isFollowing
      ? this.userService.unfollowUser(targetUserId)
      : this.userService.followUser(targetUserId);

    obs.subscribe({
      next: () => {
        // update local state so button text flips
        this.searchResults = this.searchResults.map(u =>
          u._id === targetUserId ? { ...u, isFollowing: !isFollowing } : u
        );
      },
      error: err => console.error('Follow toggle error', err)
    });
  }

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

  goToUserProfile() {
    this.router.navigate(['/profile']);
  }
  

  // Load user profile
  loadUserProfile() {
    this.userService.getUserProfile().subscribe({
      next: profile => {
        this.userProfile = profile;
        // annotate searchResults if needed
        this.searchResults = this.searchResults.map(u => ({
          ...u,
          isFollowing: profile.following.includes(u._id)
        }));
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

  // Toggle the visibility of the user profile section
  toggleProfileVisibility() {
    this.isProfileVisible = !this.isProfileVisible;
  }

  // Toggle 'Your Posts' section visibility
  showUserPosts() {
    this.showUserPostSection = true;
    this.showFollowingPostSection = false;  // Hide 'Following Posts' when 'Your Posts' is shown
  }

  // Toggle 'Following Posts' section visibility
  showFollowingPosts() {
    this.showFollowingPostSection = true;
    this.showUserPostSection = false;  // Hide 'Your Posts' when 'Following Posts' is shown
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
  navigateToCreatePost() {
    this.router.navigate(['/create-post']);
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
  // Add this method to your DashboardComponent class
deletePost(postId: string): void {
  this.postService.deletePost(postId).subscribe({
    next: () => {
      // Remove the post from the posts array after successful deletion
      this.posts = this.posts.filter(post => post._id !== postId);
    },
    error: (error) => {
      console.error('Error deleting post:', error);
    }
  });
}
like(postId: string) {
  this.postService.likePost(postId).subscribe({
    next: () => {
      this.loadFollowingPosts(); // ✅ Refresh following posts instead
    },
    error: (err) => console.error('Error liking post:', err)
  });
}

unlike(postId: string) {
  this.postService.unlikePost(postId).subscribe({
    next: () => {
      this.loadFollowingPosts(); // ✅ Same here
    },
    error: (err) => console.error('Error unliking post:', err)
  });
}

}
