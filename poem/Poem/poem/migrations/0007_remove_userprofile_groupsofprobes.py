# Generated by Django 2.0.13 on 2019-07-12 11:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('poem', '0006_remove_profile_groupofprofiles_vo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='groupsofprobes',
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='groupsofmetricprofiles',
            field=models.ManyToManyField(blank=True, help_text='The groups of metric profiles that user will control.', related_name='user_set', related_query_name='user', to='poem.GroupOfMetricProfiles', verbose_name='groups of profiles'),
        ),
    ]
