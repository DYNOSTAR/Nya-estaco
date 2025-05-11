from django.shortcuts import render, get_object_or_404, redirect
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .models import Product, Category, Order, OrderItem
from .forms import OrderCreateForm
from cart.cart import Cart

# Homepage
def home(request):
    featured_products = Product.objects.filter(available=True)[:4]
    categories = Category.objects.all()
    
    return render(request, 'store/home.html', {
        'featured_products': featured_products,
        'categories': categories
    })

# Product listing
def product_list(request, category_slug=None):
    category = None
    categories = Category.objects.all()
    products = Product.objects.filter(available=True)
    
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)
    
    return render(request, 'store/products.html', {
        'category': category,
        'categories': categories,
        'products': products
    })

# Product detail
def product_detail(request, id, slug):
    product = get_object_or_404(Product, id=id, slug=slug, available=True)
    return render(request, 'store/product_detail.html', {'product': product})

# Order creation
def order_create(request):
    cart = Cart(request)
    
    if request.method == 'POST':
        form = OrderCreateForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            if hasattr(cart, 'coupon') and cart.coupon:
                order.coupon = cart.coupon
                order.discount = cart.coupon.discount
            order.save()
            
            for item in cart:
                OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    price=item['price'],
                    quantity=item['quantity']
                )
            
            cart.clear()
            
            subject = f'Nyaestaco Stores - Order #{order.id}'
            message = 'Thank you for your order!'
            html_message = render_to_string('store/order/email.html', {'order': order})
            email_from = settings.DEFAULT_FROM_EMAIL
            recipient_list = [order.customer_email, settings.ORDER_NOTIFICATION_EMAIL]
            
            send_mail(subject, message, email_from, recipient_list, html_message=html_message, fail_silently=False)
            
            return render(request, 'store/order/created.html', {'order': order})
    else:
        form = OrderCreateForm()
    
    return render(request, 'store/order/create.html', {'cart': cart, 'form': form})

# Add to cart
def add_to_cart(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    quantity = int(request.POST.get('quantity', 1))
    cart.add(product, quantity)
    return redirect('store:product_detail', id=product.id, slug=product.slug)

# Alternative cart add placeholder (if needed)
def cart_add(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    # Add cart logic here
    return redirect('store:product_list')

# Static pages
def about(request):
    return render(request, 'store/about.html')

def contact(request):
    return render(request, 'store/contact.html')
def cart_add(request, product_id):
    # Add logic to add the product to cart
    return redirect('store:product_list')