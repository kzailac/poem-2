# Generated by Django 2.2.5 on 2019-12-17 10:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('poem_super_admin', '0017_yumrepo_tag'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='package',
            name='repo',
        ),
        migrations.AddField(
            model_name='package',
            name='repos',
            field=models.ManyToManyField(to='poem_super_admin.YumRepo'),
        ),
    ]
