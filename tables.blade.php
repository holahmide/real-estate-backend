@extends('layouts.app')

@section('content')
<div class="container text-center">
        <a href="/admin" class="btn btn-dark">Back to dashboard</a>
    </div>
<div class="container">
    <div id="report">
         <table class="table table-responsive text-center" style="text-align:center;" width="100%">
        @if($file === 'users')
        <h1 class="text-center">Table of Users that have registered</h1>
        <thead class="">
            <tr>
                <th>ID</th>
            <th>Reg_no</th>
            <th>Name</th>
            <th>Level</th>
            <th>Room</th>
            <th>Department</th>
            <th>Sub-Unit</th>
            <th>Email</th>
            <th>Sex</th>
            <th>User_Status</th>
             <th>mail_delivery</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
            <tr>
                <td>{{$user->id}}</td>
                <td>{{$user->regno}}</td>
                <td>{{$user->name}}</td>
                <td>{{$user->level}}</td>
                <td>{{$user->room}}</td>
                <td>{{$user->department}}</td>
                <td>{{$user->sub_unit}}</td>
                <td>{{$user->email}}</td>
                <td>{{$user->sex}}</td>
                <td>{{$user->status}}</td>
                 <td>{{$user->mail_delivery}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'admin')
        <h1 class="text-center">Table of Admin</h1>
        <thead class="">
            <tr>
             <th>ID</th>
            <th>Reg_no</th>
            <th>Name</th>
            <th>Email</th>
            <th>Level</th>
            </tr>
        </thead>
        <tbody>
            @foreach($admins as $admin)
            <tr>
                <td>{{$admin->id}}</td>
                <td>{{$admin->regno}}</td>
                <td>{{$admin->name}}</td>
                <td>{{$admin->email}}</td>
                <td>{{$admin->level}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'new_mem')
        <h1 class="text-center">Table of New Members Approved</h1>
        <thead class="">
            <tr>
             <th>S/N</th>
            <th>Reg_no</th>
            <th>Name</th>
            </tr>
        </thead>
        <tbody>
            @foreach($administer as $admin)
            <tr>
                <td>{{$loop->index + 1}}</td>
                <td>{{$admin->regno}}</td>
                <td>{{$admin->name}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'application')
        <h1 class="text-center">Table of Application Letters</h1>
        <thead class="">
            <tr>
            <th>S/N</th>
            <th>ID</th>
            <th>Reg_no</th>
            <th>Name</th>
            <th>Email</th>
            <th>Level</th>
            <th>File/size</th>
            <th>isApproved</th>
            </tr>
        </thead>
        <tbody>
            @foreach($application as $app)
            <tr>
                <td>{{$loop->index + 1}}</td>
                <td>{{$app->id}}</td>
                <td>{{$app->regno}}</td>
                <td>{{$app->name}}</td>
                <td>{{$app->email}}</td>
                <td>{{$app->admin}}</td>
                <td><a href="files/{{$app->path}}/{{$app->filename}}">{{$app->filename}} ({{$app->size/1000}}KB)</a></td>
                <td>{{$app->isapproved}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'attendance')
        <h1 class="text-center">Table of Attendances</h1>
        <thead class="">
            <tr>
            <th>S/N</th>
            <th>ID</th>
            <th>Reg_no</th>
            <th>Created_at</th>

            </tr>
        </thead>
        <tbody>
            @foreach($temp_q as $app)
            <tr>
                <td>{{$loop->index + 1}}</td>
                <td>{{$app->attendance_id}}</td>
                <td>{{$app->regno}}</td>
                <td>{{$app->created_at}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif


        @if($file === 'compilation')
           <compilation-component :exam="{{$examrecord}}" :interview="{{$interview}}" :members="{{$members}}" :cutoff="{{$cutoff}}"></compilation-component>
           <p class="text-center" ><button id="print" onclick="window.print_qualify()" class="btn btn-dark">Print Out Pasting List</button></p>
        @endif

        @if($file === 'examrecord')
        <h1 class="text-center">Table of Exams</h1>
        <thead class="">
            <tr>
            <th>ID</th>
            <th>Reg_no</th>
            <th>Name</th>
            <th>Score</th>
            <th>Total</th>
            <th>status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($examrecord as $app)
            <tr>
                <td>{{$app->id}}</td>
                <td>{{$app->regno}}</td>
                <td>{{$app->name}}</td>
                <td>{{$app->score}}</td>
                <td>{{$app->total}}</td>
                <td>{{$app->status}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'interview')
        <h1 class="text-center">Table of Interview Record</h1>
        <thead class="">
            <tr>
                    <th>ID</th>
            <th>Reg_no</th>
            <th>Spirituality</th>
            <th>Dressing</th>
            <th>Speech</th>
            <th>Academics</th>
            <th>Relation</th>
            <th>others</th>
            <th>INTERVIEWER</th>
            <th>Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach($interview as $app)
            <tr>
                    <td>{{$app->id}}</td>
                <td>{{$app->regno}}</td>
                <td>{{$app->spirituality}}</td>
                <td>{{$app->dressing}}</td>
                <td>{{$app->speech}}</td>
                <td>{{$app->Academics}}</td>
                <td>{{$app->Relation}}</td>
                <td>{{$app->others}}</td>
                <td>{{$app->admin}}</td>
                <td>{{$app->updated_at}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'question')
        <h1 class="text-center">Table of Approved Questions</h1>
        <thead class="">
            <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Option A</th>
            <th>Option B</th>
            <th>Option C</th>
            <th>Option D</th>
            <th>Answer</th>
            <th>Created by</th>
            </tr>
        </thead>
        <tbody>
            @foreach($question as $app)
            <tr>
                <td>{{$app->id}}</td>
                <td>{{$app->question}}</td>
                <td>{{$app->optiona}}</td>
                <td>{{$app->optionb}}</td>
                <td>{{$app->optionc}}</td>
                <td>{{$app->optiond}}</td>
                <td>{{$app->answer}}</td>
                <td>{{$app->created_by}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'temp_q')
        <h1 class="text-center">Table of Unapproved Questions</h1>
        <thead class="">
            <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Option A</th>
            <th>Option B</th>
            <th>Option C</th>
            <th>Option D</th>
            <th>Answer</th>
            <th>Created by</th>
            <th>Approval state</th>
            </tr>
        </thead>
        <tbody>
            @foreach($temp_q as $app)
            <tr>
                <td>{{$app->id}}</td>
                <td>{{$app->question}}</td>
                <td>{{$app->optiona}}</td>
                <td>{{$app->optionb}}</td>
                <td>{{$app->optionc}}</td>
                <td>{{$app->optiond}}</td>
                <td>{{$app->answer}}</td>
                <td>{{$app->admin}}</td>
                <td>{{$app->isapproved}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'temp_reg')
        <h1 class="text-center">Table of Registrable New Members</h1>
        <thead class="">
            <tr>
             <th>ID</th>
            <th>Reg_no</th>
            <th>Registered_at</th>
            </tr>
        </thead>
        <tbody>
            @foreach($temp_reg as $app)
            <tr>
                 <td>{{$app->id}}</td>
                <td>{{$app->regno}}</td>
                <td>{{$app->updated_at}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'temp_admin')
        <h1 class="text-center">Table of Registrable Admin</h1>
        <thead class="">
            <tr>
            <th>ID</th>
            <th>Reg_no</th>
            <th>Email</th>
            <th>Administration Level(max ....)</th>
            <th>Passcode</th>
            <th>Registered_at</th>
            </tr>
        </thead>
        <tbody>
            @foreach($temp_admin as $app)
            <tr>
                <td>{{$app->id}}</td>
                <td>{{$app->regno}}</td>
                <td>{{$app->email}}</td>
                <td>{{$app->level}}</td>
                <td>{{$app->passcode}}</td>
                <td>{{$app->updated_at}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'temp_regs')
        <h1 class="text-center">Table of Registrable Members</h1>
        <thead class="">
            <tr>
            <th>ID</th>
            <th>Webmail</th>
            <th>Link</th>
            <th>Registration_status</th>
            <th>admin</th>
            <th>Registered_at</th>
            </tr>
        </thead>
        <tbody>
            @foreach($t_record as $app)
            <tr>
                <td>{{$app->id}}</td>
                <td>{{$app->webmail}}</td>
                <td>{{$app->link}}</td>
                <td>{{$app->isRegistered}}</td>
                <td>{{$app->admin}}</td>
                <td>{{$app->updated_at}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'member')
        <h1 class="text-center">Table of Registered Members</h1>
        <thead class="">
            <tr>
                <th>ID</th>
                <th>GHM ID</th>
            <th>Reg_no</th>
            <th>Name</th>
            <th>Level</th>
            <th>Room</th>
            <th>Department</th>
            <th>Sub-Unit</th>
            <th>Email</th>
            <th>Sex</th>
            <th>Link</th>
            <th>mail_delivery</th>
             <th>isRegistered</th>
            </tr>
        </thead>
        <tbody>
            @foreach($new_members as $user)
            <tr>
                <td>{{$user->id}}</td>
                <td>{{$user->ghmid}}</td>
                <td>{{$user->regno}}</td>
                <td>{{$user->lastname.' '.$user->firstname}}</td>
                <td>{{$user->level}}</td>
                <td>{{$user->hall.'('.$user->room_number.')'}}</td>
                <td>{{$user->department}}</td>
                <td>{{$user->sub_unit}}</td>
                <td>{{$user->webmail}}</td>
                <td>{{$user->sex}}</td>
                <td>{{$user->link}}</td>
                 <td>{{$user->mail_delivery}}</td>
                 <td>{{$user->isRegistered}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif


        @if($file === 'announcement')
        <h1 class="text-center">Table of Announcement</h1>
        <thead class="">
            <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Admin</th>
            <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($application as $app)
            <tr>
                <td>{{$app->id}}</td>
                <td>{{$app->title}}</td>
                <td>{{$app->admin}}</td>
                <td>{{$app->status}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif

         @if($file === 'dues_dump')
        <h1 class="text-center">Table of Monthly Dues Dump</h1>
        <thead class="">
            <tr>
            <th>ID</th>
            <th>regno</th>
            <th>name</th>
            <th>paid</th>
            <th>period</th>
            </tr>
        </thead>
        <tbody>
            @foreach($application as $app)
            <tr>
                <td>{{$app->id}}</td>
                <td>{{$app->regno}}</td>
                <td>{{$app->name}}</td>
                <td>{{$app->paid}}</td>
                <th>{{$app->period}}</th>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'user_dump')
        <h1 class="text-center">Table of New Members Dump</h1>
        <thead class="">
            <tr>
            <th>ID</th>
            <th>regno</th>
            <th>name</th>
            <th>level</th>
            <th>period</th>
            </tr>
        </thead>
        <tbody>
            @foreach($application as $app)
            <tr>
                <td>{{$app->id}}</td>
                <td>{{$app->regno}}</td>
                <td>{{$app->name}}</td>
                <td>{{$app->level}}</td>
                <th>{{$app->period}}</th>
            </tr>
            @endforeach
        </tbody>
        @endif

         @if($file === 'member_dump')
        <h1 class="text-center">Table of Members Dump</h1>
        <thead class="">
            <tr>
            <th>ID</th>
            <th>regno</th>
            <th>name</th>
            <th>level</th>
            <th>entity</th>
            <th>period</th>
            </tr>
        </thead>
        <tbody>
            @foreach($application as $app)
            <tr>
                <td>{{$app->id}}</td>
                <td>{{$app->regno}}</td>
                <td>{{$app->name}}</td>
                <td>{{$app->level}}</td>
                <td>{{$app->entity}}</td>
                <th>{{$app->period}}</th>
            </tr>
            @endforeach
        </tbody>
        @endif

        @if($file === 'start_exam')
        <h1 class="text-center">Table of Exam Record</h1>
        <thead class="">
            <tr>
            <th>No. of Questions</th>
            <th>Timing</th>
            <th>Host</th>
            <th>status</th>
            <th>Registered_at</th>
            </tr>
        </thead>
        <tbody>
            @foreach($start_exam as $app)
            <tr>
                <td>{{$app->question}}</td>
                <td>{{$app->timing}}</td>
                <td>{{$app->host}}</td>
                <td>{{$app->status}}</td>
                <td>{{$app->updated_at}}</td>
            </tr>
            @endforeach
        </tbody>
        @endif


    </table>

    </div>

    <p class="text-center" ><button id="printPage" onclick="window.print()" class="btn btn-dark">Print</button></p>
</div>

<script lang='javascript'>

    function print(){
        var data = '<div id="div_print">';
                   data += $('#report').html();
                   //data += '<input type="button" style="text-align:center" value="Print" onClick="window.print()">';
                   data += '</div>';

                   myWindow=window.open('','','width=500,height=500');
                   myWindow.innerWidth = screen.width;
                   myWindow.innerHeight = screen.height;
                   myWindow.screenX = 0;
                   myWindow.screenY = 0;
                   myWindow.document.write(data);
                   myWindow.focus();
                   myWindow.print();
    }

    function print_qualify(){
        var data = '<div id="div_qualify">';
                   data += $('#qualify').html();
                   //data += '<input type="button" style="text-align:center" value="Print" onClick="window.print()">';
                   data += '</div>';

                   myWindow=window.open('','','width=500,height=500');
                   myWindow.innerWidth = screen.width;
                   myWindow.innerHeight = screen.height;
                   myWindow.screenX = 0;
                   myWindow.screenY = 0;
                   myWindow.document.write(data);
                   myWindow.focus();
                   myWindow.print();
    }
</script>
@endsection
