from django.contrib import admin
from django.urls import path
from todo.views import todo_list, todo_detail

urlpatterns = [
    path('todos/', todo_list),
    path('todos/<int:pk>/', todo_detail),
]
