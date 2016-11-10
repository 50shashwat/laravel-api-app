<?php

use App\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ApiUserTest extends TestCase
{
    use DatabaseTransactions;

    public function test_it_should_create_new_user_record_in_database()
    {
        $this->json('POST','api/v1/register',[
            'first_name' => 'Test',
            'last_name' => 'Test',
            'email' => 'test@test.com',
            'password' => 'test_pass',
            'password_confirmation' => 'test_pass',
            'company_name' => 'test',
        ])->seeJson([
            'first_name' => 'Test',
            'last_name' => 'Test',
            'email' => 'test@test.com',
            'company_name' => 'test',
            'biography' => null,
            'url' => null,
            'telephone' => null,
            'address' => null,
            'is_active' => false,
            'code' => 200
        ]);
    }

    public function test_it_should_login_user()
    {
        $user = $this->createNewUser();
        $this->json('POST', 'api/v1/login', ['email' => $user->email,'password' => 'test123'])
            ->seeJson([
                'success' => true,
            ]);
    }

    public function test_it_should_get_invalid_credentials_response_when_login()
    {
        $this->json('POST','api/v1/login', ['email' => 'someFalseMail@example.com','password' => 'qwerty'])
            ->seeJson([
                'error' => 'invalid_credentials'
            ]);
    }

    public function test_it_should_get_required_field_error_message_when_login()
    {
        $this->json('POST','api/v1/login', ['email' => 'someFalseMail@example.com'])
            ->arrayHasKey('message');
    }

    public function test_it_should_get_not_active_user_error_response_for_not_active_user()
    {
        $token = $this->getTokenForUser();
        $this->json('POST',"api/v1/posts/create?token=$token",[
            'title' => 'Test title',
            'description' => 'Test description',
            'location'  => 'Test location',
            'expired_at' => '2016-29-03 15:30:12',
            'tags'   => 'tag1,tag2,tag3'
        ])->arrayHasKey('error');
    }

    public function test_it_should_get_error_token_required_when_not_authenticated()
    {
        $this->json('POST','api/v1/posts/create',[
            'title' => 'Test title',
            'description' => 'Test description',
            'location'  => 'Test location',
            'expired_at' => '2016-29-03 15:30:12',
            'tags'   => 'tag1,tag2,tag3'
        ])->seeJson([
            'error' => 'token_not_provided'
        ]);
    }

    public function test_it_should_not_allow_to_send_message_to_post_creator()
    {
        $post = $this->createNewPost();

        $this->json('POST',"/api/v1/posts/$post->id/message/send",[
            'text' => 'Some text'
        ]);
    }

    private function createNewPost()
    {
        return $this->createNewUser()->posts()->create([
            'title' => 'Test title',
            'description' => 'Test description',
            'location'  => 'Test location',
            'expired_at' => '2016-29-03 15:30:12',
            'tags'   => 'tag1,tag2,tag3'
        ]);
    }
    private function getTokenForUser()
    {
        return JWTAuth::fromUser($this->createNewUser());
    }

    private function createNewUser()
    {
        return factory(User::class)->create([
            'first_name'   => 'First',
            'last_name'    => 'Last',
            'email'        => 'firstlast@example.com',
            'company_name' => 'Test',
            'password'     => 'test123'
        ]);
    }


}
