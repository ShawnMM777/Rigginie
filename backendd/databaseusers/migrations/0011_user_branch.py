from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('databaseusers', '0010_alter_user_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='branch',
            field=models.CharField(
                blank=True,
                choices=[
                    ('ALL', 'ALL BRANCHES'),
                    ('PasigMain', 'Pasig City Main Branch'),
                    ('QC', 'Quezon City Branch'),
                    ('MALABON', 'MALABON BRANCH'),
                    ('PARAÑAQUE', 'PARAÑAQUE BRANCH'),
                    ('TAGUIG', 'TAGUIG BRANCH'),
                    ('PASAY', 'PASAY BRANCH'),
                    ('CEBU', 'CEBU CITY BRANCH'),
                ],
                default='',
                max_length=20,
            ),
        ),
    ]
