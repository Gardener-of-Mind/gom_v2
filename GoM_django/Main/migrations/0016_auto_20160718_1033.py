# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Main', '0015_auto_20160414_1707'),
    ]

    operations = [
        migrations.AddField(
            model_name='user_profile',
            name='depression_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user_profile',
            name='remarks',
            field=models.CharField(default=b'', max_length=5000, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='user_profile',
            name='stress_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='user_profile',
            name='anxiety_score',
            field=models.IntegerField(default=0),
        ),
    ]
