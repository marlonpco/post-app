import { Injectable } from '@angular/core';

import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsCount: number = 0;
  private postsUpdated = new Subject<{posts: Post[], postsCount: number}>();

  constructor(private _http: HttpClient,
    private _router: Router) { }

  getPostsTotalCount(){
    return this._http.get<{message: string, size: number}>('http://localhost:3000/api/posts/totalCount');
  }

  getPosts(postPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this._http.get<{message: string, posts: any, count: number}>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map(data => {
        return {posts: data.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
          };
        }),
        count: data.count};
      }))
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsCount = data.count;
        this.updateDisplay();
      });
  }

  getPost(id: string){
    return this._http.get<{message: string, post: {_id: string, title: string, content: string, imagePath: string}}>
      ('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdatedListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post){
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);
    this._http.post<{
      message: string,
      post: {
        id: string,
        title: string,
        content: string,
        imagePath: string
      }
    }>('http://localhost:3000/api/posts', postData)
      .subscribe((data) => {
        console.log(data.message);
        this.routeToMain();
      });
  }

  updatePost(post: Post){
    let postData;
    if(typeof(post.image) === 'object'){
      postData = new FormData();
      postData.append('id', post.id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', post.image, post.title);
    }else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: post.image
      };
    }
    this._http.patch<{message: string}>('http://localhost:3000/api/posts/' + post.id, postData).subscribe(
      data => {
        console.log(data.message);
        this.routeToMain();
      }
    );
  }

  deletePost(postId: string){
    this._http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        console.log('Post(\#' + postId + ') deleted!');
        const remainingPosts = this.posts.filter(post => post.id !== postId);
        this.posts = remainingPosts;
        this.postsCount = this.postsCount - 1;
        this.updateDisplay();
      });
  }

  private routeToMain(){
    this._router.navigate(['/']);
  }

  private updateDisplay(){
    this.postsUpdated.next({posts: [...this.posts], postsCount: this.postsCount});
  }
}
