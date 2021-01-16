# webXdance
Web Application optimized for video-chat and collaboration in the dance-community.
### Summary
This is a web application for the people in the online dance community. It uses the voice commands to control multiple video windows to mirror a video, or pin a window.

In addtion to the voice pin for the video, it also provides a matching feature to find a best matching for a mentor, a choreographer and a student to form a dance class group.

The instruction below about the demo is for it to run on a MAC PC.


### Repository
The project has been uploaded into github. if you have the git installed on MAC PC, you can clone the project webXdace from the github by this command and run the demo.

    git clone git@github.com:emilyhtx14/webXdance.git

### Prerequest for Demo
* The project source code, **python3** and an **virtual env** with **Django** installed are required in order to run the project demo.


* The **webXdance** directory is created with the git clone command. A sub-directory **src** under webXdance contains all the source code to run the demo. The python3 and virtual env  with Django can be installed with the follow command.

### Install virtualenv
    cd webXdance
    brew install python3
    sudo pip3 install virtualenv
    source venv/bin/active
    pip install Django==3.0

### Demo
    cd webXdance/src/djangoProject1
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver

### Use Voice to Interact with webXDance
With the application running, a voice recongination engine will be active and response to a user's voice accurately with voice commands. In the demo, there will be four video windows running simutaneously to simulate four instructors in a dance class. A dance student can use voice command to control the video without approching to the computer.

This is especially useful during the pandemic when all dance classes are virtual, where multiple instructors may dial into the video meeting remotely from their home.

Here are few sample voice commands:

    mirror one
    mirror two
    pin one
    pin two

For example, a voice '**pin two**' will pin the **window #2** out of four windows if the user want to only foucus on the video on the **window #2** without the distrction from the other videos, and the user can swith to the others via another voice command as needed. With this application, a dance student can concentrate a dance class workout stopping in the middle.

### Compatibility Feature

For the matching feature, a user creats a profile with skills and roles(student, mentor or choreographer). webXdance utilizes an algorithm to find the best possible match

### Contact
* Email : emilyhtx14@gmail.com
