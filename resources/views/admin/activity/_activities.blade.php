<tr>
    <td>
        @if($activity->type->name == 'user')
            <span class="label label-info">{{ $activity->type->name }}</span>
        @elseif($activity->type->name == 'post')
            <span class="label label-default">{{ $activity->type->name }}</span>
        @else
            <span class="label label-danger">{{ $activity->type->name }}</span>
        @endif
        @if(isset($isNew) && $isNew)
                <span class="label label-success">New</span>
        @endif
    </td>
    <td>{{ $activity->user->fullName() }}</td>
    <td>{{ $activity->message }}</td>
    <td>{{ $activity->ip }}</td>
    <td>{{ $activity->created_at }}</td>
</tr>