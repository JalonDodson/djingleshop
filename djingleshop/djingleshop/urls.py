"""djingleshop URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from djingleshop_shopping.views import IndexView, AddProductView, add_item_to_cart, remove_item_from_cart, get_cart_items_list, search_for_products, get_products

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', IndexView.as_view(), name="main-page"),
    path('manage/addproduct/', AddProductView.as_view(), name="add-product"),
    path('manage/addcartitem/', add_item_to_cart, name="add_cart_item"),
    path('manage/removecartitem/', remove_item_from_cart, name="remove_cart_item"),
    path('getcartitems/', get_cart_items_list, name="get_cart_items"),
    path('search', search_for_products, name="search_for_products"),
    path('getproducts', get_products, name="get_products_list")
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
