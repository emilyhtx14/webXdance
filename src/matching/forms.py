from django import forms
from .models import Matching

DANCE_EXP = (
    ('Beginner', 'Beginner'),
    ('Intermediate', 'Intermediate'),
    ('Advanced', 'Advanced')
)

class MatchingForm(forms.ModelForm):
    name = forms.TextInput()
    experience = forms.ChoiceField(
        choices = DANCE_EXP
    )
    role = forms.CheckboxSelectMultiple()
    skills = forms.CheckboxSelectMultiple()
    choreography_pref = forms.CheckboxSelectMultiple()
    learning_pref = forms.CheckboxSelectMultiple()

    class Meta:
        model = Matching
        fields = [
            'name',
            'experience',
            'role',
            'skills',
            'choreography_pref',
            'learning_pref'
        ]
        labels = {
            'name': 'Name',
            'experience':'',
            'role':'',
            'skills':'',
            'choreography_pref':'',
            'learning_pref':''
        }

