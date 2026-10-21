@extends('layouts.app')

@section('content')
<section class="about">
    <p class="kicker">About this example</p>
    <h1>One head for every page</h1>
    <p><code>resources/views/layouts/app.blade.php</code> owns the document head. Home, About, and Product extend that layout, so they share the same banner tags.</p>
</section>
@endsection
