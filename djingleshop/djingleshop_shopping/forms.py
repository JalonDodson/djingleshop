from django import forms
from .models import Product, Cart

class ProductForm(forms.ModelForm):
    name = forms.CharField(widget=forms.TextInput(attrs={'class': 'product-input', 'placeholder': 'Product Name'}))
    description = forms.CharField(widget=forms.TextInput(attrs={'class': 'product-input', 'placeholder': 'Description'}))
    price = forms.FloatField(widget=forms.NumberInput(attrs={'class': 'product-input', 'placeholder': 'Price'}))
    product_image = forms.FileField(widget=forms.FileInput(attrs={"type": "file", 'class': 'hidden', 'id': 'product-image', "accept": "image/jpeg, image/png, image/jpg"}))
    
    class Meta:
        model = Product
        fields = ('description', 'name', 'price', 'product_image')
