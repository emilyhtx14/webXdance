# Generated by Django 3.1.5 on 2021-01-14 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matching', '0002_auto_20210114_1552'),
    ]

    operations = [
        migrations.AlterField(
            model_name='matching',
            name='choreographer',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='matching',
            name='mentor',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='matching',
            name='student',
            field=models.BooleanField(),
        ),
    ]
