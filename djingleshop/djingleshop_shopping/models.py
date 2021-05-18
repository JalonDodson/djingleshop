from django.db import models
from random import randint

# Create your models here.

class Product(models.Model):
    description = models.CharField(max_length=240)
    name = models.CharField(max_length=64)
    price = models.FloatField()
    product_code = models.IntegerField(default=randint(300000, 999999))
    product_image = models.ImageField(upload_to="product_images")

    def __str__(self):
        return f"{self.name} -- {self.price}"

class Cart(models.Model):
    products = models.ManyToManyField(Product, related_name="products_list")
    user_token = models.IntegerField()
    
    @property
    def count(self):
        return len(self.products.all())
 