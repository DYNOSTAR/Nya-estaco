from django import forms
from .models import Order

class OrderCreateForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['customer_name', 'customer_email', 'customer_phone', 
                 'address', 'delivery', 'note']
        widgets = {
            'address': forms.Textarea(attrs={'rows': 3}),
            'note': forms.Textarea(attrs={'rows': 3}),
        }