# Generated by Django 2.2.12 on 2020-06-15 17:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('poem', '0015_nounique_userprofile'),
    ]

    operations = [
        migrations.DeleteModel(
            name='MetricInstance',
        ),
        migrations.DeleteModel(
            name='Service',
        ),
    ]