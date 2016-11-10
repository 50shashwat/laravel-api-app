<?php

namespace App\Http\Responses;


use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Support\Arrayable;
use League\Fractal\Manager;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;
use League\Fractal\Serializer\SerializerAbstract;
use Illuminate\Http\Request;

/**
 * Class ApiResponse
 * @package App\Http\Responses
 */
class ApiResponse
{
    /**
     * @var SerializerAbstract
     */
    private $serializer;
    /**
     * @var Request
     */
    private $request;

    /**
     * @var Manager
     */
    private $manager;
    
    /*
     * @array PermError
     * */
    private $permCount = '';

    private $permError = [
        'post' => 'The limit of posts has been exceeded',
        'tag' => ['You cannot add more than ',' tags in free membership'],
        'private' => 'You can only create public post',
        'image' => ['You cannot add more than ',' images'],
    ];

    /**
     * ApiResponse constructor.
     * @param SerializerAbstract $serializer
     * @param Request $request
     */
    public function __construct(SerializerAbstract $serializer, Request $request)
    {
        $this->manager = new Manager();
        $this->manager->setSerializer($serializer);
        $this->request = $request;
    }

    /**
     * @param $includes
     */
    public function parseIncludes($includes)
    {
        $this->manager->parseIncludes($includes);
    }

    /**
     * @param $data
     * @param null $transformer
     * @param null $resourceKey
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($data, $transformer = null, $resourceKey = null)
    {
        return $this->respond($data, 200 , $transformer, $resourceKey);
    }

    /**
     * @param LengthAwarePaginator $paginator
     * @param null $transformer
     * @param null $resourceKey
     * @return \Illuminate\Http\JsonResponse
     */
    public function paginatedCollection(LengthAwarePaginator $paginator, $transformer = null, $resourceKey = null)
    {
        $paginator->appends($this->request->query());
        
        $resource = new Collection($paginator->items(),$this->getTransFormer($transformer),$resourceKey);
        
        $resource->setPaginator(new IlluminatePaginatorAdapter($paginator));
        
        return $this->setResponse($this->manager->createData($resource)->toArray());
    }

    /**
     * If user's tried to send message to himself
     * 
     * @return mixed
     */
    public function notAbleToSendMessage()
    {
        $response = [
            'code'    => 403,
            'success'  => false,
            'message' => 'Can not send message to yourself'
        ];

        return $this->setResponse($response,$response['code']);
    }

    /**
     * @param $data
     * @param null $transformer
     * @param null $resourceKey
     * @return \Illuminate\Http\JsonResponse
     */
    public function collection($data, $transformer = null, $resourceKey = null)
    {
        $resource = new Collection($data,$this->getTransFormer($transformer), $resourceKey);

        return $this->setResponse($this->manager->createData($resource)->toArray());
    }

    /**
 * @param string $message
 * @return \Illuminate\Http\JsonResponse
 */
    public function notFound($message = 'Resource Not Found')
    {
        $response = [
            'code'    => 404,
            'success'  => false,
            'data'    => [],
            'message' => $message
        ];

        return $this->setResponse($response,$response['code']);
    }

    /**
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkFavourites($message = 'This post is your favourites')
    {
        $response = [
            'code'    => 200,
            'success'  => true,
            'message' => $message
        ];

        return $this->setResponse($response,$response['code']);
    }

    /**
 * @param string $message
 * @param int $code
 * @return \Illuminate\Http\JsonResponse
 */
    public function error($message = 'Oops something went wrong', $code = 400)
    {
        $response = [
            'code'    => $code,
            'success'  => false,
            'message' => $message
        ];

        return $this->setResponse($response,$code);
    }

    public function permError($message = 'post',$count = '',$code = 400)
    {
        
        if(is_array($this->permError[$message])){
            $response = [
                'code'    => $code,
                'success'  => false,
                'message' => $this->permError[$message][0].$count.$this->permError[$message][1],
            ];
        }else{
            $response = [
                'code'    => $code,
                'success'  => false,
                'message' => $this->permError[$message],
            ];
        }


        return $this->setResponse($response,$code);
    }

    /**
     * @param string $message
     * @param int $code
     * @return \Illuminate\Http\JsonResponse
     */
    public function count($data)
    {
        if($data['success']){
            $response = [
                'code' => 200,
                'success' => $data['success'],
                'type' => $data['type'],
                'message' => 'You are allowed to create a post.',
            ];
        }else{
            $response = [
                'code' => 400,
                'success' => $data['success'],
                'type' => $data['type'],
                'message' => 'You reached your post limit.',
            ];
        }

        return $this->setResponse($response);
    }

    /**
     * @param $errors
     * @return \Illuminate\Http\JsonResponse
     */
    public function validationErrors($errors)
    {
        $response = [
            'code' => '400',
            'success' => false,
            'message' => $errors
        ];
        
        return $this->setResponse($response,$response['code']);
    }

    /**
     * @param $data
     * @param $httpStatusCode
     * @param $transformer
     * @param $resourceKey
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respond($data, $httpStatusCode, $transformer, $resourceKey)
    {
        $resource = new Item($data, $this->getTransFormer($transformer), $resourceKey);

        if(!is_null($transformer))
        {
            $response = $this->manager->createData($resource)->toArray();

            $response['code'] = $httpStatusCode;

            return $this->setResponse($response,$response['code']);
        }

    }

    /**
     * @param $transformer
     * @return \Closure
     */
    protected function getTransFormer($transformer)
    {
        return $transformer ?: function ($data)
        {
            if($data instanceof Arrayable)
            {
                return $data->toArray();
            }

            return (array) $data;
        };
    }

    /**
     * @param $data
     * @param $code
     * @return \Illuminate\Http\JsonResponse
     */
    private function setResponse($data, $code = 200)
    {
        if( false !== ($callback = $this->request->get('callback')))
        {
            return response()->jsonp($callback, $data, $code);
        }

        return response()->json($data,$code);
    }

    public function postsCreationLimitExceeded()
    {
        $response = [
            'code'    => 400,
            'success'  => false,
            'message' => 'Sorry you have exceeded the limit of posts,if you want to add more posts please upgrade to the pro plan'
        ];

        return $this->setResponse($response,$response['code']);
    }

    public function favouriteProductAlreadyAdded()
    {
        $response = [
            'code' => 403,
            'success' => false,
            'message' => 'Product already added to the user\'s favourites list'
        ];

        return $this->setResponse($response,$response['code']);

    }

    public function groupsCreationLimitExceeded()
    {
        $response = [
            'code'    => 400,
            'success'  => false,
            'message' => 'Sorry you have exceeded the limit of groups'
        ];

        return $this->setResponse($response,$response['code']);
    }
    public function groupsUsersCreationLimitExceeded()
    {
        $response = [
            'code'    => 400,
            'success'  => false,
            'message' => 'Sorry you have exceeded the limit of group users'
        ];

        return $this->setResponse($response,$response['code']);
    }

    public function groupsDestroy()
    {
        $response = [
            'code'    => 200,
            'success'  => true,
            'message' => 'Your groups have been successfully deleted'
        ];

        return $this->setResponse($response,$response['code']);
    }

    public function groupsUsersDestroy()
    {
        $response = [
            'code'    => 200,
            'success'  => true,
            'message' => 'Your selected users have been successfully deleted'
        ];

        return $this->setResponse($response,$response['code']);
    }

    public function groupsPostsDestroy()
    {
        $response = [
            'code'    => 200,
            'success'  => true,
            'message' => 'Your Posts have been successfully deleted'
        ];

        return $this->setResponse($response,$response['code']);
    }

    public function contactsDestroy()
    {
        $response = [
            'code'    => 200,
            'success'  => true,
            'message' => 'Your contact have been successfully deleted'
        ];

        return $this->setResponse($response,$response['code']);
    }

    public function acceptContact()
    {
        $response = [
            'code'    => 200,
            'success'  => true,
            'message' => 'You have accepted the contact'
        ];

        return $this->setResponse($response,$response['code']);
    }

    public function checkFree($data){
        if($data){
            return $response = [
                'code'    => 401,
                'success'  => false
            ];
        }else{
            return $response = [
                'code'    => 200,
                'success'  => true
            ];
        }

    }

    public function success($message = 'Process successfully finished.'){
        $response = [
            'code'    => 200,
            'success'  => true,
            'message' => $message,
        ];

        return $this->setResponse($response,$response['code']);
    }
}