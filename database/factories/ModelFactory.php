<?php


$factory->define(App\User::class, function (Faker\Generator $faker) {
    return [
        'email' => $faker->email,
        'password' => 'test123',
        'first_name' => $faker->firstName,
        'last_name'  => $faker->lastName,
        'company_name' => $faker->company,
        'url'          => $faker->url,
        'biography'    => $faker->sentences,
        'address'      => $faker->address,
        'remember_token' => str_random(10),
    ];
});
