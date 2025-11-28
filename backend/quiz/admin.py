from django.contrib import admin

from quiz.models import Option, Quiz,Question

# Register your models here.
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Option)
