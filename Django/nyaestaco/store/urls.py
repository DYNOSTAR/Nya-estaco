from django.urls import path
from . import views

app_name = 'store'

urlpatterns = [
    path('', views.home, name='home'),
    path('products/', views.product_list, name='product_list'),
    path('products/<slug:category_slug>/', views.product_list, name='product_list_by_category'),
    path('products/<int:id>/<slug:slug>/', views.product_detail, name='product_detail'),
    path('cart/add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('order/create/', views.order_create, name='order_create'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('products/', views.product_list, name='products'),
    path('cart/add/<int:product_id>/', views.cart_add, name='cart_add'),
]
