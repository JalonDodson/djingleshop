from django.http import JsonResponse
from django.core import serializers
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from .forms import ProductForm
from .models import Product, Cart
import json
from django.forms.models import model_to_dict

# Create your views here.
class IndexView(View):
    def get(self, request):
        products = Product.objects.all()
        return render(request, 'index.html', {'products': products})


class AddProductView(View):
    def post(self, request):
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect(reverse("main-page"))

    def get(self, request):
        form = ProductForm()
        return render(request, 'add_product.html', {'form': form})

@csrf_exempt
def add_item_to_cart(request):
    if request.is_ajax and request.method == "POST":
        data = request.POST
        user_cart = Cart.objects.filter(user_token=data["user_token"]).first()
        product = Product.objects.filter(id=data["product_id"]).first()
        if not bool(user_cart):
            user_cart = Cart.objects.create(user_token=data["user_token"])
        
        does_exist = user_cart.products.filter(id=product.id)
        if not does_exist:
            user_cart.products.add(product)
            user_cart.save()

        cart_count = user_cart.products.all().count()
        serializer_inst = serializers.serialize("json", [product])
        return JsonResponse({"instance": serializer_inst, "productId": product.id, "cart_count": cart_count}, status=200)

    return JsonResponse({"error": "add_cart_failure"}, status=400)

@csrf_exempt
def remove_item_from_cart(request):
    if request.is_ajax and request.method == "POST":
        data = request.POST
        user_cart = Cart.objects.filter(user_token=data["user_token"]).first()

        prod = Product.objects.filter(id=data["product_id"]).first()
        user_cart.products.remove(prod)
        user_cart.save()
        return JsonResponse({"productId": prod.id}, status=200)
    return JsonResponse({"error": "rm_cart_failure"}, status=400)
            
@csrf_exempt
def get_cart_items_list(request):
    if request.is_ajax:
        data = request.GET
        user_cart = Cart.objects.filter(user_token=int(data["userToken"])).first()
        if user_cart.products.all():
            products_list = [model_to_dict(x) for x in user_cart.products.all()]
            for p in products_list:
                p["product_image"] = p["product_image"].url
        else:
            products_list = []

        return JsonResponse({"products_list": json.dumps(products_list), "cart_count": user_cart.products.all().count()}, status=200)
    return JsonResponse({"error": "get_cart_failure"}, status=400)


def search_for_products(request):
    data = request.GET
    query_string = data["query"]
    product_list = None
    if query_string.isdigit():
        prod = Product.objects.filter(product_code = int(query_string)).first()
        if bool(prod):
            product_list = [prod]
    else:
        prods = Product.objects.filter(name__icontains=query_string).all()
        if bool(prods):
            product_list = prods
    return render(request, 'search.html', {"product_list": product_list, "query_string": query_string})

def get_products(request):
    if request.is_ajax:
        data = request.GET
        query_string = data["q"]
        product_list = None

        if query_string.isdigit():
            prod = Product.objects.filter(product_code = int(query_string)).first()
            if bool(prod):
                product_list = [prod]
        else:
            if data["t"] == "name":
                prod_raw = [model_to_dict(x) for x in Product.objects.filter(name__icontains=query_string).all().order_by('name')]
            else:
                prod_raw = [model_to_dict(x) for x in Product.objects.filter(name__icontains=query_string).all().order_by('price')]

            if bool(prod_raw):
                product_list = prod_raw

        for p in product_list:
                p["product_image"] = p["product_image"].url

        return JsonResponse({"products_list": json.dumps(product_list)}, status=200)
    return JsonResponse({"error": "get_cart_failure"}, status=400)