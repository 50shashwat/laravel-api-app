<?php

namespace App;

use App\Traits\Filterable;
use App\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use App\Scopes\ActiveScope;

class Post extends BaseModel
{
    use Filterable,SoftDeletes;
    
    /**
     * The attributes that are mass assignable.
     * @var array
     */
    protected $fillable = ['user_id','title','access','description','location','expired_at', 'price', 'currency', 'active'];

    protected $attributes = array(
        'active' => 1
    );

    const TYPE_PRIVATE = 0;
    const TYPE_PUBLIC = 1;
    const REGULAR_POST_COUNT = 7;

    /**
     * Relation between post and user models
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('expired_at_scope', function(Builder $builder) {
            $builder->where('posts.expired_at','>',Carbon::today()->toDateString());
        });
        static::addGlobalScope(new ActiveScope);
    }



    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    /**
     * Relation between post and tag models
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tags()
    {
        return $this->hasMany(PostTag::class);
    }

    /**
     * Relation between post and message models
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Relation between post and image postImage models
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function images()
    {
        return $this->hasMany(PostImage::class)->orderBy('created_at', 'desc');
    }

    public function imageDestinationPath()
    {
        return "uploads/posts/images/{$this->id}/";
    }

    public function scopeActive($query)
    {
        return $query->where('active', 1);
    }
    
    public static function getPosts()
    {
        $postModel = new self;


      $posts = $postModel->leftJoin('post_privacy', 'posts.id', '=', 'post_privacy.post_id')
            ->leftJoin('user_contacts', function ($join) {
                $join->on('post_privacy.access_id', '=', 'user_contacts.id')
                    ->where('post_privacy.type', '=', 'contact');
            })
            ->leftJoin('user_groups', function ($join) {
                $join->on('user_groups.group_id', '=', 'post_privacy.access_id')
                    ->where('post_privacy.type', '=', 'group');
            })
            ->where(function($query) {
                $query->where('posts.access', 1);
                if (JWTAuth::getToken())
                {
                    $id = JWTAuth::parseToken()->authenticate()->id;
                    $query->orwhere(function ($query) use($id) {
                        $query->whereNull('user_contacts.deleted_at')
                            ->where('user_contacts.status', '=', 'accepted')
                            ->where('user_contacts.contact_id', '=', $id);
                    });

                    $query->orwhere(function ($query) use($id) {
                        $query->whereNull('user_groups.deleted_at')
                            ->where('user_groups.user_id', '=', $id);
                    });

                    $query->orwhere('posts.user_id', '=', $id);
                }

            })
            ->orderBy('posts.created_at','desc')
            ->groupBy('posts.id')
            ->select('posts.*');

        return $posts;
    }

    public function conversation()
    {
        return $this->hasMany(Conversation::class)->select('member_1_id as sender','member_2_id as recipient');
    }

}
