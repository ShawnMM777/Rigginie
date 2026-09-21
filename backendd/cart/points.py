from django.db import transaction
from .models import UserPoints, PointsUser


@transaction.atomic
def award_points_for_cart(cart):
    user_points, _ = UserPoints.objects.get_or_create(user=cart.user)

    for item in cart.items.select_related('product').all():
        earned = item.product.points_value * item.quantity
        if earned <= 0:
            continue

        PointsUser.objects.create( user=cart.user,cart=cart,product=item.product, points_earned=earned, )
        user_points.add_points(earned)