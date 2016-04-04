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
from django.db import IntegrityError
from Main.models import *

# Create your views here.
def index(request):
	return render(request,'index.html')

def user_login(request):
	if request.POST:
		username= request.POST['username']
		password= request.POST['password']
		user= authenticate(username=username, password=password)
		if user:
			login(request,user)
			profile= user_profile.objects.filter(user=user)
			if profile.questions == False:
				return HttpResponseRedirect('../dashboard/')
			return HttpResponseRedirect('../dashboard/')
	return render(request,'login.html')

def register(request):
	if request.POST:
		username= request.POST['username']
		email_id= request.POST['email']
		password = request.POST['password']
		# try:
		user = User.objects.create_user(username= username, email= email_id,password= password)
		user.set_password(user.password)
		profile=user_profile(user=user,email_id=email_id)
		profile.save()
		user2= authenticate(username=username,password=password)
		login(request,user2)
		# except:
		# 	return HttpResponse('Error')
		return HttpResponseRedirect('../dashboard/')
	return render(request,'register.html')

def questions(request):
	if request.POST:
		qid= int(request.POST['qid'])
		query= question.objects.get(id=qid)
		return query
	return render(request,'initial_survey.html')

@login_required
def dashboard(request):
	user=request.user
	try:
		profile= user_profile.objects.get(user=user)
	except:
		pass
	return render(request,'dashboard.html',{'profile': profile})