    $(document).ready(function () {
        var socket = io.connect('//ec2-35-160-139-209.us-west-2.compute.amazonaws.com:4444');
        var name1="";
        var messages = $("#messages_out");
        var message_txt = $("#message_text_out")
        $('.chat .nick1').text(name1);

        function msg(message) {
            var m = '<div class="msg">' +
                    '<span class="user">' + '</span> '
                    + message.toString() +
                    '</div>';
            messages
                    .append(m)
                    .scrollTop(messages[0].scrollHeight);
        }

        function msg_system(message) {
            var m = '<div class="msg system">' + message + '</div>';
            messages
                    .append(m)
                    .scrollTop(messages[0].scrollHeight);
        }

        socket.on('connecting', function () {
            msg_system('Соединение...');
        });

        socket.on('connect', function () {
            msg_system('Соединение установленно!');
            msg_system('*НОМЕР МЕТОДА*;*ЭПСИЛОН*;*НАЧАЛЬНАЯ ТОЧКА*;*КОНЕЧНАЯ ТОЧКА*');
            msg_system('ПРИМЕР: 1;0.01;0;2');
        });

        socket.on('message', function (data) {
            msg(data);
            message_txt.focus();
        });

        $("#test_out").click(function () {
            var text = $("#message_text_out").val();
            if (text.length <= 0)
               return;
            message_txt.val("");
            socket.emit("message", text);
        });

    });
