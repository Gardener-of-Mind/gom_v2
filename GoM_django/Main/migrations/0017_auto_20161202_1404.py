# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Main', '0016_auto_20160718_1033'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_profile',
            name='remarks',
            field=models.CharField(default=b'', max_length=20000, null=True, blank=True),
        ),
    ]
