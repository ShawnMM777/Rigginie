from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler


def _category_code(value, values):
	return values.index(value) if value in values else -1


def cluster_products(products, cluster_count=3):
	products = list(products)
	if not products:
		return []

	category_values = ['GPU', 'CPU', 'MB', 'RAM', 'SSD', 'HDD', 'PSU', 'CASE', 'COOL', 'PERI', 'MON', 'LAP', 'SRVR']
	brand_values = ['ASUS', 'LENOVO', 'ACER', 'HP', 'MSI', 'GOOGLE']
	features = [
		[
			float(product.price),
			product.stock,
			product.pointsbalance,
			_category_code(product.category, category_values),
			_category_code(product.brand, brand_values),
		]
		for product in products
	]

	cluster_count = max(1, min(int(cluster_count), len(products)))
	scaled_features = StandardScaler().fit_transform(features)
	labels = KMeans(n_clusters=cluster_count, n_init=10, random_state=42).fit_predict(scaled_features)
	return [
		{
			'id': product.id,
			'name': product.name,
			'category': product.category,
			'price': float(product.price),
			'stock': product.stock,
			'cluster': int(label),
		}
		for product, label in zip(products, labels)
	]
