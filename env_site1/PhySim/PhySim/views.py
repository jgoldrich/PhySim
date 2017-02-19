from django.http import HttpResponse
from django.shortcuts import render_to_response

def hello_world(request):
	return HttpResponse("<h1>Hello A, are you null?</h1>")

def root_page(request):
	return HttpResponse("Hello A, are you nuller?")

def text_render(request):
	return render_to_response("/SampleHTML.html")

#def get_context_data(self, **kwargs):
	# ignore this lol
