from collections import defaultdict
from datetime import timedelta
from django.db.models import Sum
from django.db.models.functions import TruncDate
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from cart.models import OrderItem, Product


def forecast_sales(days=7):
	rows = (
		OrderItem.objects.filter(order__status='paid')
		.annotate(day=TruncDate('order__created_at'))
		.values('day')
		.annotate(units=Sum('quantity'))
		.order_by('day')
	)
	sales_by_day = {row['day']: int(row['units'] or 0) for row in rows}
	if len(sales_by_day) < 2:
		return {'historical': [], 'forecast': [], 'detail': 'At least two days of paid sales are required.'}
    
	first_day = min(sales_by_day)
	last_day = max(sales_by_day)
	historical = []
	feature_values = []
	target_values = []
	current_day = first_day
	while current_day <= last_day:
		day_index = (current_day - first_day).days
		feature_values.append([day_index])
		target_values.append(sales_by_day.get(current_day, 0))
		historical.append({'date': current_day.isoformat(), 'units': sales_by_day.get(current_day, 0)})
		current_day += timedelta(days=1)

	model = LinearRegression().fit(feature_values, target_values)
	forecast = []
	for offset in range(1, max(1, int(days)) + 1):
		forecast_day = last_day + timedelta(days=offset)
		predicted_units = max(0, round(float(model.predict([[(forecast_day - first_day).days]])[0])))
		forecast.append({'date': forecast_day.isoformat(), 'units': predicted_units})
	return {'historical': historical, 'forecast': forecast, 'detail': None}


def recommend_products(user, limit=8):
	products = list(Product.objects.filter(is_active=True, stock__gt=0))
	if len(products) < 2:
		return {'recommendations': [], 'detail': 'At least two active products are required.'}

	sales = defaultdict(int)
	for row in (
		OrderItem.objects.filter(order__status='paid', product__isnull=False)
		.values('product_id')
		.annotate(units=Sum('quantity'))
	):
		sales[row['product_id']] = int(row['units'] or 0)

	categories = {value: index for index, value in enumerate(['GPU', 'CPU', 'MB', 'RAM', 'SSD', 'HDD', 'PSU', 'CASE', 'COOL', 'PERI', 'MON', 'LAP', 'SRVR'])}
	features = []
	targets = []
	for product in products:
		features.append([
			float(product.price),
			product.stock,
			categories.get(product.category, -1),
			1 if product.recommended_for == getattr(user, 'user_type', None) else 0,
		])
		targets.append(sales[product.id])

	model = RandomForestRegressor(n_estimators=80, random_state=42, min_samples_leaf=1)
	model.fit(features, targets)
	scores = model.predict(features)
	recommendations = [
		{
			'id': product.id,
			'name': product.name,
			'category': product.category,
			'price': float(product.price),
			'stock': product.stock,
			'predicted_demand': round(max(0, float(score)), 2),
			'profile_match': product.recommended_for == getattr(user, 'user_type', None),
		}
		for product, score in zip(products, scores)
	]
	recommendations.sort(key=lambda item: (item['profile_match'], item['predicted_demand']), reverse=True)
	return {'recommendations': recommendations[:max(1, int(limit))], 'detail': None}
