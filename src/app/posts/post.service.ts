import { Injectable } from '@angular/core';

import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts(){
    return [...this.posts];
  }

  getPostUpdatedListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post){
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
