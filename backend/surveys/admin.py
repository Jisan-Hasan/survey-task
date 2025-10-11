from django.contrib import admin

from surveys.models import Survey, Question, Choice, Response, Answer, AnswerChoice

admin.site.register(Survey)
admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(Response)
admin.site.register(Answer)
admin.site.register(AnswerChoice)