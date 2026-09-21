from django.db import models
from django.conf import settings


class Product(models.Model):
    CATEGORY_CHOICES = [ ('GPU', 'Graphics Card'), ('CPU', 'Processor'), ('MB', 'Motherboard'),('RAM', 'Memory'), ('SSD', 'SSD Storage'), ('HDD', 'HDD Storage'),('PSU', 'Power Supply'), ('CASE', 'Case'), ('COOL', 'Cooling'),('PERI', 'Peripherals'), ('MON', 'Monitor'), ('LAP', 'Laptop'),('SRVR', 'Server'),]
    RECOMMENDED_FOR_CHOICES = [ ('student', 'Student'), ('working', 'Working'),('gamer', 'Gamer'), ('enthusiast', 'Enthusiast'), ]
    PRODUCT_CATEGORY = [ ('DC', 'Discount'), ('PRE-SALE', 'Pre-Sales'), ('NR', 'New Release'),]
    PRODUCT_TYPE = [ ('GL', 'Gaming Laptop'), ('CL', 'CHROMEBOOK LAPTOP'), ('WL', 'Working Laptop'), ('UL', 'UltraBook Laptop'), ('2IN1', '2in1 Laptop')]
    BRANCHES = [ ('ALL', 'ALL BRANCHES'), ('PasigMain','Pasig City Main Branch'), ('QC','Quezon City Branch'), ('MALABON','MALABON BRANCH'), ('PARAÑAQUE','PARAÑAQUE BRANCH'), ('TAGUIG','TAGUIG BRANCH'), ('PASAY','PASAY BRANCH'), ('CEBU','CEBU CITY BRANCH'),]
    SUB_BRAND = [ ('ASUS', 'ASUS'), ('ROG', 'ROG'), ('HP', 'HP'),('TUFF', 'TUFF'), ('PREDATOR', 'PREDATOR'), ('AERO', 'AERO'), ('AUROS', 'AUROS'), ('ALIENWARE', 'ALIENWARE'), ('ACER', 'ACER'), ('GOOGLE', 'GOOGLE'), ('GOOGLE', 'GOOGLE'), ('THINKPAD', 'THINKPAD'), ('YOGA', 'YOGA'), ('LOQ', 'LOQ'), ('THINKBOOK', 'THINKBOOK'), ('SLIMBOOK', 'SLIMBOOK'), ('XPS', 'XPS'), ('MACBOOK', 'MACBOOK'), ('ZENBOOK', 'ZENBOOK'), ('SPECTRE', 'SPECTRE'), ('SWIFT', 'SWIFT'), ('SURFACE', 'SURFACE'), ('SPIN', 'SPIN'), ('ENVY', 'ENVY'), ('FLEX', 'FLEX'),] 
    BRAND = [ ('ASUS', 'ASUS'), ('LENOVO', 'LENOVO'), ('ACER', 'ACER'), ('HP', 'Hewlett Packard'), ('MSI', 'Micro Star International'), ('GOOGLE', 'GOOGLE'),]
    CPU_BRAND = [ ('INTL', 'INTEL'), ('AMD', 'Advance Micro Devices')]
    GPU_BRAND = [ ('NVDA', 'NVIDIA'), ('AMDR', 'RADEON')]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    mainimg = models.ImageField(upload_to='products/', blank=True, null=True)
    img1 = models.ImageField(upload_to='products/', blank=True, null=True)
    img2 = models.ImageField(upload_to='products/', blank=True, null=True)
    img3 = models.ImageField(upload_to='products/', blank=True, null=True)
    img4 = models.ImageField(upload_to='products/', blank=True, null=True)
    img5 = models.ImageField(upload_to='products/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    pointsbalance = models.PositiveIntegerField(default=0)
    recommended_for = models.CharField(max_length=20, choices=RECOMMENDED_FOR_CHOICES, blank=True, null=True)
    product_cat = models.CharField(max_length=20, choices=PRODUCT_CATEGORY, blank=True, null=True)
    branches = models.CharField(max_length=200, choices=BRANCHES, blank=True)
    description = models.TextField(blank=True, default='')
    cpu = models.CharField(max_length=20, choices=CPU_BRAND, blank=True, null=True)
    gpu = models.CharField(max_length=20, choices=GPU_BRAND, blank=True, null=True)
    brand = models.CharField(max_length=20, choices=BRAND, blank=True, null=True)
    subbrand = models.CharField(max_length=20, choices=SUB_BRAND, blank=True, null=True)
    typeproduct = models.CharField(max_length=20, choices=PRODUCT_TYPE, blank=True, null=True)

    def __str__(self):
        return self.name

    
class UserPoints(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='points')
    points = models.PositiveIntegerField(default=0)

    def add_points(self, points):
        self.points += points
        self.save(update_fields=['points'])

    def __str__(self):
        return f'{self.user.email} - {self.points} pts'

class ProductSpecs(models.Model):
    product = models.ForeignKey(Product, related_name='specifications', on_delete=models.CASCADE)
    hardware = models.CharField(max_length=300)
    hardwarename = models.CharField(max_length=400)

    class Meta:
        unique_together = ('hardware', 'hardwarename')
    def __str__(self):
        return f"{self.product.name} - {self.hardware} : {self.hardwarename}"

class PointsUser(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='points_user')
    cart = models.ForeignKey('Cart', on_delete=models.SET_NULL, null=True, blank=True, related_name='points_user')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    points_earned = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.email} earned {self.points_earned} pts'


class Cart(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f'{self.user.email} cart'

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())

    @property
    def item_count(self):
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f'{self.quantity}x {self.product.name}'

    @property
    def subtotal(self):
        return self.product.price * self.quantity


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    purchase_number = models.CharField(max_length=24, unique=True, null=True, blank=True)
    shipping_address = models.CharField(max_length=255, blank=True)
    contact_number = models.CharField(max_length=15, blank=True)
    payment_method = models.CharField(max_length=30, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='paid')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Order {self.pk} ({self.status})'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.quantity}x {self.product_name}'