# Generated by Django 3.2.3 on 2021-05-18 03:08

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=240)),
                ('name', models.CharField(max_length=64)),
                ('price', models.FloatField()),
                ('product_code', models.IntegerField(default=569541)),
                ('product_image', models.ImageField(upload_to='product_images')),
            ],
        ),
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_token', models.IntegerField()),
                ('products', models.ManyToManyField(related_name='products_list', to='djingleshop_shopping.Product')),
            ],
        ),
    ]
