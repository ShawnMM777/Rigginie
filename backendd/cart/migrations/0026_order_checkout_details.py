from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('cart', '0025_order_orderitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='contact_number',
            field=models.CharField(blank=True, max_length=15),
        ),
        migrations.AddField(
            model_name='order',
            name='payment_method',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='order',
            name='purchase_number',
            field=models.CharField(blank=True, max_length=24, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='order',
            name='shipping_address',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]