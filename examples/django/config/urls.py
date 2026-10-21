from django.urls import path

from pages.views import about, home, product

urlpatterns = [
    path("", home),
    path("about/", about),
    path("product/", product),
]
