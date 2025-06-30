import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService,Task } from '../service/task.service';
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  tasks:Task[] = [];
  newTask: string = '';
  constructor(private TaskService: TaskService,private router: Router) {}
  ngOnInit() {
    this.loadTasks();
    // Request notification permission from the user
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Run background task every minute
    setInterval(() => {
      this.showTaskNotification();
    }, 3600000); // Every 60 mins
  }

  loadTasks(){
    this.TaskService.getTasks().subscribe(tasks => this.tasks = tasks);
  }


  private showTaskNotification() {

    const userName = localStorage.getItem('userName') || 'User';
    const appName = localStorage.getItem('appName') || 'Todo App';

    if (Notification.permission === "granted") {
      let notificationMessage = '';

      if (this.remainingTasks > 0) {
        // User has pending tasks
        notificationMessage = `Hey ${userName}, you have ${this.remainingTasks} tasks to complete! ✅`;
      } else {
        notificationMessage = `Hey ${userName}, you have no tasks! Add new tasks in "${appName}" to stay productive. 🚀`;
      }

      const notification = new Notification("🚀 Reminder!", {
        body: notificationMessage,
        icon: "/favicon.png"
      });

      notification.onclick = () => {
        window.focus();
        this.router.navigate(['/todos']); // Navigate to the task page
      };
    }else{
      if ("Notification" in window) {
        Notification.requestPermission();
      }
    }
  }


  addTask() {
    if (this.newTask.trim()) {
      const newTask : Task = {text: this.newTask,completed:false,editing: false};
      this.TaskService.createTask(newTask).subscribe(t => {
        this.newTask = '';
        this.tasks.unshift(t);
      })
    }
  }

  toggleTaskCompletion(index: number) {
    const task = this.tasks[index];
    task.completed = !task.completed;
    this.TaskService.updateTask(task.id!,task).subscribe(t=>{
      this.tasks[index] = t;
    })
  }

  toggleEditTask(index: number) {
    const task = this.tasks[index];
    if(task.editing){
      this.updateTask(index)
    }
    task.editing = !task.editing;
  }

  updateTask(index:number){
    const task = this.tasks[index];
    task.editing = false;
    
    this.TaskService.updateTask(task.id!,task).subscribe(t=>{
      this.tasks[index] = t;
    })
  }

  deleteTask(index: number) {
    const task = this.tasks[index];
    this.TaskService.deleteTask(task.id!).subscribe(t=>{
      this.tasks.splice(index,1)
    })
  }

  get remainingTasks() {
    return this.tasks.filter(task => !task.completed).length;
  }

  get completedTasks() {
    return this.tasks.filter(task => task.completed).length;
  }

}
