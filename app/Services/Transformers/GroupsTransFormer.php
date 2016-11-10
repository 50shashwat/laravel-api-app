<?php
namespace App\Services\Transformers;


use App\Groups;
use League\Fractal\TransformerAbstract;

class GroupsTransFormer extends TransformerAbstract
{
    public function transform(Groups $groups)
    {
        return [
            'id'               => $groups->id,
            'user_id'          => $groups->user_id,
            'name'             => $groups->name,
            'created_at'       => $groups->created_at,
            'updated_at'       => $groups->updated_at,
        ];
    }
}