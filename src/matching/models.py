from django.db import models
from multiselectfield import MultiSelectField
# Create your models here.
DANCE_EXP = (
    ('Beginner', 'Beginner'),
    ('Intermediate', 'Intermediate'),
    ('Advanced', 'Advanced')
)

ROLE = {
    ('Mentor','Mentor'),
    ('Student','Student'),
    ('Choreographer','Choreographer')
}

SKILLS = (
    ('Contemporary', 'Contemporary'),
    ('Folkloric', 'Folkloric'),
    ('Hip-hop', 'Hip-hop'),
    ('None', 'None')
)

class Matching(models.Model):
    name = models.CharField(max_length = 100)
    experience = models.CharField(max_length = 100, choices = DANCE_EXP)
    role = MultiSelectField(choices=ROLE, default="None")
    skills = MultiSelectField(choices = SKILLS, default = "None")
    choreography_pref = MultiSelectField(choices = SKILLS, default = "None")
    learning_pref = MultiSelectField(choices=SKILLS, default="None")

