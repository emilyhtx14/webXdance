from django.shortcuts import render

# Create your views here.
from .models  import Matching
from .forms import MatchingForm

def matching_create_view(request):
    form = MatchingForm(request.POST or None)
    if form.is_valid():
        form.save()
        form = MatchingForm()
    context = {
        'form': form
    }
    return render(request, "matching/matching_create.html", context)

def create_home_view(request):
    return render(request, "matching/matching_home.html", {})

def matching_detail_view(request):
    user_list = Matching.objects.all()
    user_name = user_list.latest('id').name
    user_exp = user_list.latest('id').experience
    user_skills = user_list.latest('id').skills
    user_role = user_list.latest('id').role
    user_choreo = user_list.latest('id').choreography_pref
    user_learn = user_list.latest('id').learning_pref

    points = 0.0
    points_dict = {}
    for dancer in user_list:
        dancer_name = dancer.name
        if(dancer == user_name):
            break
        if(dancer_name in points_dict):
            pass
        else:
            points_dict[dancer_name] = 0

        dancer_exp = dancer.experience
        dancer_skills = dancer.skills
        dancer_role = dancer.role
        dancer_choreo = dancer.choreography_pref
        dancer_learn = dancer.learning_pref

        # ranking process if the latest user only possesses one role
        """
        comments key:
        choreographer = choreographer only
        mentor = mentor only
        student = student only
        choreographer + mentor = mentor and choreographer but not student
        """
        # choreographer: eliminate all non-choreographer
        if 'Choreographer' in user_role and 'Student' not in user_role and 'Mentor' not in user_role:
            if 'Choreographer' not in dancer_role:
                    points_dict[dancer_name] -= 100

        # if you are only a student, you eliminate all profiles that are student, choreographer, choreographer/student
        if 'Student' in user_role and 'Choreographer' not in user_role and 'Mentor' not in user_role:
            if 'Mentor' not in dancer_role:
                    points_dict[dancer_name] -= 100

        #if you are only a teacher, you eliminate all profiles that are teacher, choreographer, teacher/choreographer
        if 'Mentor' in user_role and 'Choreographer' not in user_role and 'Mentor' not in user_role:
            if 'Student' not in dancer_role:
                    points_dict[dancer_name] -= 100

        # user has multiple roles
        # personal profile: choreographer + mentor then you can eliminate mentor+non-choreographer
        if 'Choreographer' in user_role and 'Mentor' in user_role and 'Student' not in user_role:
            if 'Mentor' in dancer_role and 'Choreographer' not in dancer_role:
                points_dict[dancer_name] -= 100

        # personal profile: choreographer/student then you can eliminate student/non-choreographer
        if 'Choreographer' in user_role and 'Student' in user_role and 'Mentor' not in user_role:
            if 'Student' in dancer_role and 'Choreographer' not in dancer_role:
                points_dict[dancer_name] -= 100

        # personal profile: mentor/student then you can eliminate choreographer
        if 'Choreographer' not in user_role and 'Student' in user_role and 'Mentor' in user_role:
            if 'Choreographer' in dancer_role:
                points_dict[dancer_name] -= 100

        # secondary ranking process for remaining contenders
        # only choreographer
        if 'Choreographer' in user_role and 'Student' not in user_role and 'Mentor' not in user_role:
            if 'Choreographer' in dancer_role:
                points_dict[dancer_name] += 8
                # check matches between user's personal choreo preferences with each user's choreo pref in db
                for u_choreo in user_choreo:
                    if u_choreo in dancer_choreo:
                        points_dict[dancer_name] += 8
            if 'Student' in dancer_role:
                points_dict[dancer_name] -= 8
            if 'Mentor' in dancer_role:
                points_dict[dancer_name] -= 8

        #only a student
        if 'Choreographer' not in user_role and 'Student' in user_role and 'Mentor' not in user_role:
            if 'Mentor' in dancer_role:
                points_dict[dancer_name] += 8
                for u_learn in user_learn:
                    if u_learn in dancer_skills:
                        points_dict[dancer_name] += 8
            if 'Choreographer' in dancer_role:
                points_dict[dancer_name] -= 8
            if 'Student' in dancer_role:
                points_dict[dancer_name] -= 8

        # only a teacher
        if 'Choreographer' not in user_role and 'Student' not in user_role and 'Mentor' in user_role:
            if 'Student' in dancer_role:
                points_dict[dancer_name] += 8
                for u_skills in user_skills:
                    if u_skills in dancer_learn:
                        points_dict[dancer_name] += 8
            if 'Choreographer' in dancer_role:
                points_dict[dancer_name] -= 8
            if 'Mentor' in dancer_role:
                points_dict[dancer_name] -= 8

        # mentor + choreographer
        if 'Choreographer' in user_role and 'Student' not in user_role and 'Mentor' in user_role:
            if 'Student' in dancer_role:
                points_dict[dancer_name] += 8
                for u_skills in user_skills:
                    if u_skills in dancer_learn:
                        points_dict[dancer_name] += 8
            if 'Choreographer' in dancer_role:
                points_dict[dancer_name] += 8
                for u_choreo in user_choreo:
                    if u_choreo in dancer_choreo:
                        points_dict[dancer_name] += 8
            if 'Mentor' in dancer_role:
                points_dict[dancer_name] -= 8

        # student + choreographer
        if 'Choreographer' in user_role and 'Student' in user_role and 'Mentor' not in user_role:
            if 'Mentor' in dancer_role:
                points_dict[dancer_name] += 8
                for u_learn in user_learn:
                    if u_learn in dancer_skills:
                        points_dict[dancer_name] += 8
            if 'Choreographer' in dancer_role:
                points_dict[dancer_name] += 8
                for u_choreo in user_choreo:
                    if u_choreo in dancer_choreo:
                        points_dict[dancer_name] += 8
            if 'Student' in dancer_role:
                points_dict[dancer_name] -= 8

        # teacher + student
        if 'Choreographer' not in user_role and 'Student' in user_role and 'Mentor' in user_role:
            if 'Mentor' in dancer_role:
                points_dict[dancer_name] += 8
                for u_learn in user_learn:
                    if u_learn in dancer_skills:
                        points_dict[dancer_name] += 8
            if 'Student' in dancer_role:
                points_dict[dancer_name] += 8
                for u_skills in user_skills:
                    if u_skills in dancer_learn:
                        points_dict[dancer_name] += 8
            if 'Choreographer' in dancer_role:
                points_dict[dancer_name] -= 8

        # teacher + student + choreographer
        if 'Choreographer' not in user_role and 'Student' in user_role and 'Mentor' in user_role:
            if 'Mentor' in dancer_role:
                points_dict[dancer_name] += 8
                for u_learn in user_learn:
                    if u_learn in dancer_skills:
                        points_dict[dancer_name] += 8
            if 'Student' in dancer_role:
                points_dict[dancer_name] += 8
                for u_skills in user_skills:
                    if u_skills in dancer_learn:
                        points_dict[dancer_name] += 8
            if 'Choreographer' in dancer_role:
                points_dict[dancer_name] += 8
                for u_choreo in user_choreo:
                    if u_choreo in dancer_choreo:
                        points_dict[dancer_name] += 8

    context = {
        'points': points_dict,
        'patients': user_list,
        'last_user': user_name
    }
    return render(request, "matching/matching_detail.html", context)

