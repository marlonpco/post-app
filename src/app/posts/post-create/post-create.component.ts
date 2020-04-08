
import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeTypeValidator } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  private modeCreate: boolean = true;
  private postId: string = null;
  public post: Post = null;
  public isLoading: boolean = false;
  public preview: string = null;

  public form: FormGroup;


  constructor(private _postsService: PostService,
    public _route: ActivatedRoute) {}

  ngOnInit(){
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeTypeValidator]})
    });

    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('id')){
        this.modeCreate = false;
        this.postId = paramMap.get('id');
        this.isLoading = true;
        this._postsService.getPost(this.postId).subscribe(data => {
          this.isLoading = false;
          this.post = {
            id: data.post._id,
            title: data.post.title,
            content: data.post.content,
            image: null,
            imagePath: data.post.imagePath,
            creator: data.post.creator
          }
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      }
    });
  }

  onSavePost(){

    if(this.form.invalid){
      return;
    }

    this.isLoading = true;
    const post: Post = {
      id: this.postId,
      title: this.form.value.title,
      content: this.form.value.content,
      image: this.form.value.image,
      imagePath: '',
      creator: ''
    };

    if(this.modeCreate){
      this._postsService.addPost(post);
    }else{
      this._postsService.updatePost(post);
    }


    this.form.reset();
  }

  onImagePick(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = (reader.result as string);
    };

    reader.readAsDataURL(file);
  }
}
