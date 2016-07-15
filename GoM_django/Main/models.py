from django.db import models
from django.contrib.auth.models import User
from django.db import models
from mongoengine import *
from django.utils import timezone

class gauss(Document):
    email = StringField(required=True)
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)


class Diary(Document):
    modified_date = DateTimeField()
    title = StringField(required=True)
    text_data = StringField(required= True)
    user_id = IntField(required=True)

    def save(self, *args, **kwargs):
        self.modified_date = timezone.now()
        return super(Diary, self).save(*args, **kwargs)


# Survey Models

class survey(Document):
    name= StringField(max_length=50,blank=True)
    category= StringField(max_length=50,blank=True)

class survey_questions(Document):
    text=StringField(max_length=1000)
    query_type= StringField(max_length=50)
    options = ListField(null=True)  
    score= ListField(blank=True,null=True)
    survey= ReferenceField(survey)
    class Meta:
        verbose_name_plural = 'Questions'
    def __unicode__(self):
        return str(self.text)

class survey_answers(Document):
    answers = ListField(null=True)
    question= ReferenceField(survey_questions)
    user_id= IntField(null=True)


# Models for Survey

class Option(EmbeddedDocument):
    text = StringField(max_length=500)
    survey_score = IntField(default=0)
    anxiety_score = IntField(default=0)
    depression_score = IntField(default=0)
    stress_score = IntField(default=0)


class Question(Document):
    """ Stores Question Details and Evaluation Scheme"""
    text = StringField(max_length=3000)
    query_type = StringField(max_length=50)
    options = ListField(EmbeddedDocumentField(Option))
    eval_scheme = DictField()

    class Meta:
        verbose_name_plural = 'Questions'

    def __unicode__(self):
        return str(self.text)


class Response(Document):
    """ Here response_per_option mirrors the response for Multi Correct
    Options. Text Response for option-less questioss. For others we
    note downn the index of the option."""
    question = ReferenceField(Question)
    response_per_option = ListField()
    text_response = StringField(max_length=500, null=True)
    single_option = IntField(null=True)  # Index of slected option.


class Survey(Document):
    """ Used to identify a survey. Common across all copies and forks.
    Also referenced by answer collections.
    Whenever a question is replaced we update all SurveyResponses that
    refer to that particular question. If an old attempted question is edited
    then no effect. """
    name = StringField(max_length=50)
    category = StringField(max_length=50)
    questions = ListField(ReferenceField(Question))


class SurveyResponses(Document):
    """ references User. references a particular survey. Keeps track of the answers
        Keeps track of the next question to be answered."""
    user_id = IntField()
    survey = ReferenceField(Survey)
    current_question = ReferenceField(Question, null=True)
    responses = ListField(ReferenceField(Response))
    survey_score = IntField()


#Activity Models


class Activity(Document):
    name= StringField(max_length=50,blank=True)
    category= StringField(max_length=50,blank=True)


class Task(Document):
    title = StringField(max_length=100)
    details = StringField(max_length=500,blank=True)
    activity = ReferenceField(Activity)

    class Meta:
        verbose_name_plural = 'Task'
    def __unicode__(self):
        return str(self.text)


class UserActivity(Document):
    completed_tasks = ListField(ReferenceField(Task))
    assigned_activity = ReferenceField(Activity)
    user_id= IntField(null=True)





# Relational DB models



class coach_profile(models.Model):
    user = models.OneToOneField(User, null=True)    
    GENDERS = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    name = models.CharField(max_length=200)
    gender = models.CharField(max_length=1, choices=GENDERS)
    phone_one = models.BigIntegerField(blank=True,null=True, default='')
    email_id = models.EmailField(unique=True)
    about_me= models.TextField(default='')  
    city = models.CharField(max_length=20, null=True)
    profile_pic= models.ImageField(blank=True, upload_to='pictures', null=True, default='pictures/default.jpg')     
    status = models.BooleanField(default=False)
    created     = models.DateTimeField(editable=False, null=True)

    class Meta:
        verbose_name_plural = 'coach_profile'

    def __unicode__(self):
        return str(self.name)

    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.created = timezone.now()
        return super(coach_profile, self).save(*args, **kwargs)

    def number_of_students(self):
        return len(user_profile.objects.filter(coach=self))

    def view_profile_url(self):
        return '<a href="/admin/show-coach/%s"> View </a>' % self.id


class user_profile(models.Model):
    user = models.OneToOneField(User, null=True)    
    GENDERS = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    name = models.CharField(max_length=200)
    gender = models.CharField(max_length=1, choices=GENDERS)
    college = models.CharField(max_length=200, default='')
    city = models.CharField(max_length=20, null=True, default='')
    phone = models.BigIntegerField(blank=True,null=True)
    email_id = models.EmailField(unique=True)
    occupation= models.CharField(max_length=200, default='', blank=True)
    about_me= models.TextField(default='')
    coach = models.ForeignKey(coach_profile, null=True, default=None, blank= True)
    profile_pic= models.ImageField(blank=True, upload_to='pictures', null=True, default='pictures/default.jpg') 
    # questions= models.BooleanField(default=False)
    anxiety_score= models.IntegerField(blank=True,null=True)
    class Meta:
        verbose_name_plural = 'user_profile'
    def __unicode__(self):
        return str(self.name)
    


class admin_profile(models.Model):
    user = models.OneToOneField(User, null=True)    
    GENDERS = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    name = models.CharField(max_length=200)
    gender = models.CharField(max_length=1, choices=GENDERS)
    phone_one = models.BigIntegerField(blank=True,null=True)
    email_id = models.EmailField(unique=True)
    profile_pic= models.ImageField(blank=True, upload_to='pictures', null=True, default='pictures/default.jpg') 

    class Meta:
        verbose_name_plural = 'admin_profile'
    def __unicode__(self):
        return str(self.name)
