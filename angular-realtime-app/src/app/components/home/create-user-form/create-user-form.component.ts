import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../model';

@Component({
  selector: 'create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.css']
})
export class CreateUserFormComponent {

  @Output() createUser: EventEmitter<User> = new EventEmitter();
  
  public createUserForm = this.formBuilder.group(
    {
      name: ['', [Validators.required, Validators.minLength(5)]],
      
    });

  constructor(private formBuilder: FormBuilder) { }

  public onSubmit() {
    if (this.createUserForm.valid) {
      this.createUser.emit(
        new User((this.createUserForm.get('name').value as string).toUpperCase()),
      );
    }
  }

}
