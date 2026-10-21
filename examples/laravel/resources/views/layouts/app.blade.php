<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cookie Compliance</title>
    @verbatim
    <script>
        var huOptions = {
            "appID": "YOUR_APP_ID",
            "currentLanguage": "en",
            "blocking": true,
            "globalCookie": false
        };
    </script>
    @endverbatim
    <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
    @vite(['resources/css/app.css'])
</head>
<body>
    <header class="topbar">
        <a class="brand" href="/">Cookie Compliance</a>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/product">Product</a>
        </nav>
    </header>
    <main>
        @yield('content')
    </main>
    <footer class="site-footer">
        <p class="footer-name">Field Notes Market</p>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/product">Product</a>
        </nav>
    </footer>
</body>
</html>
