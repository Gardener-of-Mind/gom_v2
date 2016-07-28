# -*- coding: utf-8 -*-
from django.template import RequestContext
from django.shortcuts import render, render_to_response, redirect
# from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect,Http404,HttpResponse, JsonResponse
from django.template.loader import get_template
from django.template import Context
from django.core.mail import send_mail, EmailMessage
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.db import IntegrityError
from Main.models import *
import json
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.core.urlresolvers import reverse
from GoM_django.settings import DEFAULT_SURVEY_CONFIG, BASE_DIR
import pickle
from bson.objectid import ObjectId
from utils import resolve_next_question
# Create your views here.


def index(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/dashboard/')
    return render(request, 'index.html')


def user_login(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('../dashboard/')

    if request.POST:
        username= request.POST['username']
        password= request.POST['password']
        user= authenticate(username=username, password=password)
        if user:
            login(request,user)
            # profile= user_profile.objects.filter(user=user)
            # if profile.questions == False:
                # return HttpResponseRedirect('../dashboard/')
            return HttpResponseRedirect('../dashboard/')
    return render(request,'login.html')


def register(request):
    if request.POST:
        username= request.POST['username']
        email_id= request.POST['email']
        password = request.POST['password']
        # try:
        try:
            user = User.objects.create_user(username= username, email= email_id,password= password)
        except:
            error = "Username is already Taken"
            return render(request, 'register.html', {'error' : error} )
        user.set_password(user.password)
        try:
            profile=user_profile(user=user,email_id=email_id, name=username)
            profile.save()
        except:
            error = "Email Address is already taken"
            user.delete()
            return render(request, 'register.html', {'error' : error})
        auth_user= authenticate(username=username,password=password)
        login(request,auth_user)
        # except:
        #     return HttpResponse('Error')
        return HttpResponseRedirect('/survey/default/')
    return render(request,'register.html')


def user_logout(request):
    logout(request)
    return redirect('../')

# New Survey Views
# ----------------------------------------------------------------------------


def check_survey_response(request, user_id, survey_id):
    student_user = User.object.get(id=user_id)
    if request.user.coach == request.user or student_user == request.user:
        user_response = SurveyResponses.objects(user_id=user_id, survey_id=survey_id)
        all_responses = []
        for question_response in user_response.responses:
            response_details = {}
            question = question_response.question
            response_details['question'] = question.text
            if question_type in ['dropdownbox', 'radio', 'rating', 'dual']:
                response_details['answerlist'] = [question.options[question_response.single_option].text]
            elif question_type == 'text':
                response_details['answerlist'] = [question_response.text_response]
            else:
                response_details['answerlist'] = [question.options[index].text for index, bo in enumerate(question_response.response_per_option) if bo]
            all_responses.append(response_details)
    return render(request,'check_survey.html', {'all_responses':all_responses})





def update_default_setting(request):
    if request.POST:
        survey_type = request.POST['survey_type']
        survey_id = request.POST['survey_id']
        DEFAULT_SURVEY_CONFIG[survey_type] = survey_id
        fileObject = open(BASE_DIR + '/default_survey_settings.config', 'wb')
        pickle.dump(DEFAULT_SURVEY_CONFIG, fileObject)
        fileObject.close()
        return HttpResponse('Success')
    return HttpResponse('Failure')


@login_required
def default_surveys(request):
    student_status = UserSurveyStatus.objects(user_id=request.user.id).first()
    if student_status is None:
        student_status = UserSurveyStatus(user_id=request.user.id)
    for survey_id in DEFAULT_SURVEY_CONFIG.values():
        if survey_id is not None:
            survey = Survey.objects(id=ObjectId(survey_id)).first()
            student_status.pending_surveys.append(survey)
    student_status.save()
    if request.POST:
        survey_type = request.POST['survey_type']
        survey_id = DEFAULT_SURVEY_CONFIG[survey_type]
        if survey_id is None:
            return JsonResponse({'message':
                            'This Survey is Not available at the Moment.'})
        redirect_url = '/survey/take/%s' % str(survey_id)
        return HttpResponse(redirect_url)
    return render(request, 'default_survey.html')


@login_required
def take_survey(request, survey_id):
    survey_id = ObjectId(survey_id)
    survey = Survey.objects(id=survey_id).first()
    user_response = SurveyResponses.objects(user_id=request.user.id,
                                            survey=survey).first()

    user_prof = user_profile.objects.get(user=request.user)  # chu satwik
    # has no clue about naming conventions in python.
    if request.POST:
        if 'answer' not in request.POST:  # you just revisited
            if user_response is None:
                next_question = survey.questions[0]
            else:
                next_question = user_response.current_question

        else:  # you are submitting an answer
            # If this is the first answer user_response does not exists
            if user_response is None:
                user_response = SurveyResponses(user_id=int(request.user.id),
                                                survey=survey, survey_score=0)

            question_id = ObjectId(request.POST['question_id'])
            question = Question.objects(id=question_id).first()
            answer = json.loads(request.POST['answer'])
            if question.query_type in ['dropdownbox', 'radio', 'rating', 'dual']:
                question_response = Response(question=question,
                                             single_option=int(answer))
                user_response.survey_score += question.options[int(answer)].survey_score
                user_prof.anxiety_score += question.options[int(answer)].anxiety_score
                user_prof.depression_score += question.options[int(answer)].depression_score
                user_prof.stress_score += question.options[int(answer)].stress_score
            elif question.query_type == 'text':
                question_response = Response(question=question,
                                             text_response=answer)
                # TODO: Keep track of text_scores later
            else:
                question_response = Response(question=question)
                for number, option_answer in enumerate(answer):
                    question_response.response_per_option.append(bool(option_answer))
                    if bool(option_answer) is True:
                        user_response.survey_score += question.options[int(number)].survey_score
                        user.anxiety_score += question.options[int(number)].anxiety_score
                        user.depression_score += question.options[int(number)].depression_score
                        user.stress_score += question.options[int(number)].stress_score

            # question_response.save()
            user_response.responses.append(question_response)
            # user_response.save()
            next_question = resolve_next_question(question_response, survey)
            if next_question is None:
                user_response.completed = True
                user_survey_status = UserSurveyStatus.objects(user_id=request.user.id).first()
                user_survey_status.completed_surveys.append(survey)
                user_survey_status.pending_surveys.remove(survey)
                user_survey_status.save()
                return HttpResponse('Survey Completed')
            user_response.current_question = next_question  # The Question user will be answering now.
        next_question = next_question.to_json()
        return HttpResponse(next_question)
    return render(request, 'question.html')

@login_required
def view_edit_survey(request, survey_id):
    try:
        profile= admin_profile.objects.get(user=request.user)
    except:
        return HttpResponse("Acess Denied")

    try:
        survey = Survey.objects(id=ObjectId(survey_id))
    except:
        return HttpResponse('Survey Not Found')
    if request.POST:
        questions = json.loads(request.POST['questions'])
        for question_json in questions:
            q_id = question_json['_id']
            question = Question.objects(id=ObjectId(q_id))
            question.text = question_json['text']
            question.save()
        survey.save()
    return HttpResponse(survey.to_json())
# ----------------------------------------------------------------------------


# def questions(request):
#     if request.POST:
#         survey_id = str(request.POST['oid'])
#         surveys = survey.objects(id=survey_id)
#         questions_list = survey_questions.objects(survey= survey).order_by('id')
#     surveys= Survey.objects.all().first()
#     oid = surveys.id
#     surveys= surveys.to_json()
#     # data = serializers.serialize("json", questions_list)
#     # return HttpResponse(queries)
#     return render(request,'initial_survey.html', {'oid':oid})



# def query(request):
#     if request.POST:
#         survey_id = str(request.POST['oid'])
#         survey_ob = survey.objects(id=survey_id).first()
#         questions_list = survey_questions.objects(survey= survey_ob).order_by('id')
#         queries= questions_list.to_json()
#         return HttpResponse(queries)




# def survey_submit(request):
#     user = request.user
#     try:
#         profile =user.user_profile
#     except:
#         return HttpResponse('Profile object error')

#     if request.POST:
#         answers_list = request.POST.getlist('answers[]')
#         # return HttpResponse(str(answers_list))
#         survey_id = str(request.POST['oid'])
#         survey_ob = survey.objects(id=survey_id).first()
#         questions = survey_questions.objects(survey=survey_ob)
#         category = str(survey_ob.category)
#         k=0
#         total_score= 0
#         # for query in questions:
#         #     answer = answers_list[k]
#         #     try:
#         #         answer_index = query.options.index(str(answer))
#         #         score = query.score['answer_index']
#         #     except:
#         #         pass
#         #     total_score+= score
#         #     k+=1

#         # if category == 'anxiety':
#         #     profile.anxiety_score += total_score

#         return HttpResponseRedirect('../profile/edit/')






@login_required
def dashboard(request):
    user=request.user
    try:
        profile= user_profile.objects.get(user=user)
        # user_activity_ob = UserActivity(id= int(user.id))
        # completed_tasks = user_activity_ob.completed_tasks
        # tasks=[]
        # for task_id in completed_tasks:
        #     task_ob = Task.objects(id=task_id).first()
        #     tasks.append(task_ob)

        # assigned_activity = user_activity_ob.assigned_activity
        # all_tasks = Task.objects(activity= assigned_activity)
        # pending_tasks= list(set(all_tasks) - set(completed_tasks))


        return render(request,'user/dashboard.html',{'profile': profile})
    except:
        pass
    try:
        profile= coach_profile.objects.get(user=user)
        user_profile_obs = profile.user_profile_set.all()
        return render(request,'coach/dashboard.html',{'profile': profile, 'user_profiles' : user_profile_obs})
    except:
        pass
    try:
        profile= admin_profile.objects.get(user=user)
        coach_obs = coach_profile.objects.filter(status=False)
        return render(request,'admin/dashboard.html',{'profile': profile, 'coach_obs' : coach_obs})
    except:
        pass
    return HttpResponse('Profile Not Found')




@login_required
def edit_profile(request):
    user=request.user
    try:
        profile= user_profile.objects.get(user=user)
        profile_type = 'user'
    except:
        try:
            profile= admin_profile.objects.get(user=user)
            profile_type = 'admin'
        except:
            profile= coach_profile.objects.get(user=user)
            profile_type = 'coach'

    if request.POST.get('profile_pic',False):
        # try:
        profile.profile_pic = request.FILES['display_pic']
        profile.save()
        return HttpResponseRedirect('.')
        # except:
            # return HttpResponse('Error')
    if request.POST:
        try:
            name = str(request.POST['name'])
        except:
            name = ''

        try:
            gender = str(request.POST['gender'])
        except:
            gender = 'M'

        try:
            college = str(request.POST['college'])
        except:
            college = ''

        try:
            city = str(request.POST['city'])
        except:
            city = ''

        try:
            occupation = str(request.POST['occupation'])
        except:
            occupation = ''

        try:
            phone = int(request.POST['phone'])
        except:
            phone = 0

        try:
            about_me = str(request.POST['about_me'])
        except:
            about_me = ''

        profile.name= name
        profile.gender= gender
        profile.college = college
        profile.occupation = occupation
        profile.phone = phone
        profile.city= city
        profile.about_me = about_me
        profile.save()
        return HttpResponseRedirect('.')

    return render(request,'user/profile_account.html', {'profile':profile, 'profile_type':profile_type})





@login_required
def profile_overview(request):
    user=request.user
    try:
        profile= user_profile.objects.get(user=user)
        profile_type = 'user'
    except:
        pass
    try:
        profile= coach_profile.objects.get(user=user)
        profile_type = 'coach'
    except:
        pass
    try:
        profile= admin_profile.objects.get(user=user)
        profile_type = 'admin'
    except:
        pass
    print '+++++++++++++'
    print profile_type
    print '-------------'
    if 'profile' not in locals():
        return HttpResponse('Error')
    else:
        return render(request,'user/profile_overview.html', {'profile':profile, 'profile_type':profile_type})





@login_required
def diary(request):
    user= request.user
    profile= user.user_profile
    if request.POST:
        oid = request.POST['oid']
        text = str(request.POST['text'])
        title = request.POST['title']
        try:
            diary = Diary.objects(id= ObjectId(oid)).first()
            diary.title = title
            diary.text_data = text
            diary.save()
        except:
            diary = Diary(title=title,text_data=text, user_id =int(profile.id))
            diary.save()
        diary = {"title": diary.title, "modified_date": diary.modified_date.strftime('%B %d, %Y, %I:%M %p'), "text_data": diary.text_data}
        return JsonResponse(diary)
    diaries= Diary.objects(user_id = int(profile.id))
    return render(request,'user/diary.html', {"profile": profile, "diaries" : diaries})





@login_required
def coach_user_profile(request,user_id):
    user= request.user
    try:
        profile = coach_profile.objects.get(user=user)
    except:
        # return HttpResponse('Coach Object Error')
        profile = None
        pass
    try:
        user_profile_ob = user_profile.objects.get(id= int(user_id))
    except:
        return HttpResponse('User Profile object error')

    user_survey_responses = SurveyResponses.objects(user_id=user_id)
    user_surveys = [(user_response.survey, user_respose.status) for user_response in user_survey_responses]

    return render(request, 'coach/user_details.html', {
        'profile': profile,
        'user_profile': user_profile_ob,
        'user_surveys': user_surveys or range(3)
    })



@login_required
def approved_coaches(request):
    user = request.user
    try:
        profile = admin_profile.objects.get(user=user)
    except:
        return HttpResponse('Admin object Error')

    coach_obs = coach_profile.objects.filter(status=True)
    return render(request, 'admin/approved_coach.html', {'profile' : profile, 'coach_obs' : coach_obs})







def test_pic(request):
    pro  = user_profile.objects.all()[0]
    return render_to_response('test.html', {'pro' : pro }, context_instance = RequestContext(request))


def profile_help(request):
    user = request.user
    profile= user_profile.objects.get(user=user)
    return render(request,'user/profile_help.html', {'profile' : profile})


def add_survey(request):
    user = request.user
    profile = admin_profile.objects.get(user=user)

    if request.POST:
        if 'survey' in request.POST:
            name = request.POST['name']
            category = request.POST['category']
            survey = Survey(name=str(name), category=str(category))
            survey.save()
            survey_id = survey.id
            return HttpResponse(str(survey_id))

        elif 'questions' in request.POST:
            # return HttpResponse(request.POST['questions'])
            survey_id = ObjectId(request.POST['survey_id'])
            survey = Survey.objects(id=survey_id).first()
            questions = json.loads(request.POST['questions'])
            for question_json in questions:
                text = question_json['text']
                query_type = question_json['query_type']
                options = question_json['options']
                question = Question(text=text, query_type=query_type)

                for option in options:
                    question.options.append(Option(text=option['text'],
                                            anxiety_score=option['anxiety_score'],
                                            depression_score=option['depression_score'],
                                            stress_score=option['stress_score'],
                                            survey_score=option['survey_score']))
                question.save()
                survey.questions.append(question)
            survey.save()
            return HttpResponse('success')

    return render(request, 'admin/survey_add.html', {'profile': profile})


def view_surveys(request):
    user = request.user
    profile = admin_profile.objects.get(user=user)

    if request.POST:
        survey_id = request.POST['survey_id']
        survey_ob = survey.objects(id=survey_id).first()
        survey_ob = survey_ob.to_json()
        return render(request, 'admin/survey_view.html', {'survey_ob' : survey_ob})
    surveys = Survey.objects()
    # surveys = surveys.to_json()
    return render(request, 'admin/surveys.html', {'surveys' : surveys, 'profile': profile})


def view_survey(request, survey_id):
    user = request.user
    profile = admin_profile.objects.get(user=user)

    # if request.POST:
    #     survey_id = request.POST['survey_id']
    #     survey_ob = survey.objects(id=survey_id).first()
    #     survey_ob = survey_ob.to_json()
    #     return render(request, 'admin/survey_view.html', {'survey_ob' : survey_ob})
    survey = Survey.objects(id=ObjectId(survey_id)).first()
    return render(request, 'admin/survey.html', {'survey' : survey, 'profile': profile})




# Activity Views here

def add_track(request):
    user= request.user
    profile = admin_profile.objects.get(user=user)

    if request.POST:
        if 'track' in request.POST:
            name = request.POST['name']
            category = request.POST['category']
            track = ActivityTrack(name=name, category=category)
            track.save()
            return HttpResponse(str(track.id))

        elif 'activity' in request.POST:
            track_id = request.POST['track_id']
            track = ActivityTrack.objects(id=ObjectId(track_id)).first()
            activities = json.loads(request.POST['activities'])
            for activity_json in activities:
                text = activity_json['text']
                activity_type = activity_json['activity_type']
                next_allowed_after = int(activity_json['next_allowed_after'])
                activity = Activity(text=text,activity_type=activity_type,
                                    next_allowed_after=next_allowed_after)

                if 'video_url' in activity_json:
                    activity.video_url = activity_json['video_url']
                else:
                    # ToDo: File Upload
                    pass
                activity.save()
                track.activity.append(activity)
            track.save()
            return HttpResponse('success')
    return render(request, 'add_activity.html', {'profile': profile})


def view_tracks(request):
    if request.POST:
        track_id = request.POST['track_id']
        track = ActivityTrack.objects(id=ObjectId(track_id)).first()
        return render(request, 'track_view.html', {'track': track})

    all_tracks = ActivityTrack.objects()
    return render(request, 'activities.html', {'all_tracks': all_tracks, 'profile': admin_profile.objects.get(user=request.user)})


def view_track(request, track_id):
    track = ActivityTrack.objects(id=ObjectId(track_id)).first()
    activity_track_response = ActivityTrackResponses.objects(user_id=request.user.id, track=track).first()
    if activity_track_response is None:
        activity_track_response = ActivityTrackResponses(user_id=request.user.id, track=track, current_activity=track.activity[0])
        activity_track_response.save()
    activity = activity_track_response.current_activity
    return render(request, 'take_activity.html', {'activity': activity})







#input:POST: user_id, activity_id
#output: respones : 'success'
def assign_activity_track(request):
    if request.POST:
        student_ids = request.POST['student_ids']
        student_ids = json.loads(student_ids)
        print student_ids
        track_id = request.POST['track_id']
        track = ActivityTrack.objects(id=ObjectId(track_id)).first()
        for student_id in student_ids:
            student_status = UserActivityTrackStatus.objects(user_id=int(student_id)).first()
            if student_status is None:
                student_status = UserActivityTrackStatus(user_id=int(student_id))
            student_status.pending_tracks.append(track)
            student_status.save()
        return HttpResponse('success')
    else:
        all_tracks = ActivityTrack.objects()
        # ToDo: all_tracks = ActivityTrack.objects(admin_only=False)
        c_profile = coach_profile.objects.get(user=request.user)
        students = c_profile.user_profile_set.all()
        return render(request, 'all_tracks.html', {
            'all_tracks': all_tracks,
            'students': students,
            'profile':coach_profile.objects.get(user=request.user)
        })


def assign_survey(request):
    if request.POST:
        student_ids = request.POST['student_ids']
        student_ids = json.loads(student_ids)
        print student_ids
        survey_id = request.POST['survey_id']
        survey = Survey.objects(id=ObjectId(survey_id)).first()
        for student_id in student_ids:
            student_status = UserSurveyStatus.objects(user_id=int(student_id)).first()
            if student_status is None:
                student_status = UserSurveyStatus(user_id=int(student_id))
            student_status.pending_surveys.append(survey)
            student_status.save()
        return HttpResponse('success')
    else:
        all_surveys = Survey.objects()
        # ToDo: all_tracks = Survey.objects(admin_only=False)
        c_profile = coach_profile.objects.get(user=request.user)
        students = c_profile.user_profile_set.all()
        return render(request, 'assign_surveys.html', {'all_surveys': all_surveys, 'students': students})



#input=POST: task_id, user_activity_id
#output=response: 'success'
def complete_activity(request):
    if request.POST:
        track_id = request.POST['track_id']
        track = ActivityTrack.objects(id=ObjectId(track_id)).first()
        activity_id = request.POST['activity_id']
        activity = Activity.objects(id=ObjectId(activity_id)).first()
        user_track_status = UserActivityTrackStatus.objects(user_id=request.user.id).first()
        # create new response shit if it does not exist already
        activity_track_response = ActivityTrackResponses.objects(user_id=request.user.id, track=track).first()
        if activity_track_response is None:
            activity_track_response = ActivityTrackResponses(user_id=request.user.id, track=track,
                                                            current_activity=track.activity[0])
            activity_track_response.save()
        feedback = request.POST['feedback']
        rating = int(request.POST['rating'])
        time_completed = datetime.datetime.now()
        activity_response = ActivityResponse(activity=activity, feedback=feedback, rating=rating, time_completed=time_completed)
        activity_response.save()
        print 'HO PAYA'

        activity_track_response.responses.append(activity_response)
        if len(activity_track_response.responses) == len(track.activity):
            activity_track_response.completed = True
            activity_track_response.current_activity = None
            user_track_status.completed_tracks.append(track)
            user_track_status.pending_tracks.remove(track)
            user_track_status.save()
            # Also remove from pending and move to Completed in case of UserActivityTrackStatus

        else:
            activity_track_response.current_activity = track.activity[len(activity_track_response.responses)]
        activity_track_response.save()
        return HttpResponse(json.dumps({"status": 'success', "next": not activity_track_response.completed}))

    # user = request.user
    # user_profile = user_profile.objects.get(user=user)

    # task_id = str(request.POST['task_id'])
    # user_activity_id = str(request.POST['user_activity_id'])

    # user_activity_ob = UserActivity(id= user_activity_id)
    # task_ob = Task(id =task_id).first()

    # user_activity_ob.update_one(push__completed_tasks= task_ob)

def coach_diary(request, student_id):
    if request.POST:
        student_profile = user_profile.objects.get(id=student_id)
        student_profile.remarks = request.POST['remarks']
        student_profile.save()
        return HttpResponse('Success')


def flow(request, survey_id):
    survey = Survey.objects(id=ObjectId(survey_id)).first()
    if request.POST:
        if 'questions' in request.POST:
            questions = survey.questions
            questions = [json.loads(question.to_json()) for question in questions]
            return JsonResponse({'questions': json.dumps(questions)})
        elif 'evaluation_scheme' in request.POST:
            eval_scheme = json.loads(request.POST['evaluation_scheme'])
            questions = [Question.objects(id=ObjectId(q_id)).first() for q_id in eval_scheme]
            for question in questions:
                print "%%%%%%%%%%%%%%%%%"
                print type(eval_scheme[str(question.id)])
                question.eval_scheme = eval_scheme[str(question.id)]
                question.save()
            # print "**********", survey.eval_scheme, "**************"
            survey.save()
        return HttpResponse('success')
    return render(request, 'flow/index.html')


def student_activity_profile(request):
    # return HttpResponse()
    print request.user.id, "sdafsdafsdafsda"
    user_track_status = UserActivityTrackStatus.objects(user_id=request.user.id).first()
    pending_tracks = user_track_status.pending_tracks

    profile= user_profile.objects.get(user=request.user)
    return render(request, 'user/activity_profile.html', {'pending_tracks': pending_tracks, 'profile': profile})


def student_survey_profile(request):
    # return HttpResponse()
    # print request.user.id, "sdafsdafsdafsda"
    user_survey_status = UserSurveyStatus.objects(user_id=request.user.id).first()
    pending_surveys = user_survey_status.pending_surveys

    profile= user_profile.objects.get(user=request.user)
    return render(request, 'user/survey_profile.html', {'pending_surveys': pending_surveys, 'profile': profile})

def asd(request):
    # if request.POST:
    #     print request.POST['']
    #     # form = FileUploadForm(data=request.POST, files=request.FILES)
    #     # if form.is_valid():
    #     #     print 'valid form'
    #     # else:
    #     #     print 'invalid form'
    #     #     print form.errors
    #     return HttpResponse('1')
    return render(request, 'activity_add.html')

def asds(request):
    return render(request, 'activities.html')

def asd_take(request, activity_id):
    return render(request, 'activity.html')
