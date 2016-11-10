@extends('layouts.docs')

@section('sub-content')
    <div class="panel-group m-bot20" id="accordion">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#message-send" aria-expanded="false">
                        Send message
                    </a>
                </h4>
            </div>
            <div id="message-send" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.messages._send')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#conversations" aria-expanded="false">
                        Conversations
                    </a>
                </h4>
            </div>
            <div id="conversations" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.messages._conversations')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#openConversations" aria-expanded="false">
                        Open User Conversation
                    </a>
                </h4>
            </div>
            <div id="openConversations" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.messages._openPostConversations')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#closeConversations" aria-expanded="false">
                        Close User Conversation
                    </a>
                </h4>
            </div>
            <div id="closeConversations" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.messages._closePostConversations')
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#message-reply" aria-expanded="false">
                        Send reply
                    </a>
                </h4>
            </div>
            <div id="message-reply" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                <div class="panel-body">
                    @include('admin.docs.messages._reply')
                </div>
            </div>
        </div>
    </div>
@endsection