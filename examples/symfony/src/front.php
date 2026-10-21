<?php

declare(strict_types=1);

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;

require dirname(__DIR__) . '/vendor/autoload.php';

$routes = new RouteCollection();
$routes->add('home', new Route('/', ['_template' => 'home.html.twig']));
$routes->add('about', new Route('/about', ['_template' => 'about.html.twig']));
$routes->add('product', new Route('/product', ['_template' => 'product.html.twig']));

$request = Request::createFromGlobals();
$path = parse_url($request->getRequestUri(), PHP_URL_PATH);
if (!is_string($path) || $path === '') {
    $path = '/';
}
if ($path !== '/' && str_ends_with($path, '/')) {
    $path = rtrim($path, '/') ?: '/';
}

$context = new RequestContext();
$context->fromRequest($request);

try {
    $match = (new UrlMatcher($routes, $context))->match($path);
} catch (ResourceNotFoundException) {
    (new Response('Not found', 404))->send();
    return;
}

$twig = new Environment(
    new FilesystemLoader(dirname(__DIR__) . '/templates'),
    ['autoescape' => 'html']
);

$html = $twig->render($match['_template']);
(new Response($html, 200, ['Content-Type' => 'text/html; charset=UTF-8']))->send();
